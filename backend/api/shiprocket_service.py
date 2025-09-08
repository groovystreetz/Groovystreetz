# backend/api/shiprocket_service.py

import requests
import logging
from datetime import datetime, timedelta
from django.conf import settings
from django.core.cache import cache
from typing import Dict, Optional, List, Tuple
import json

logger = logging.getLogger(__name__)

class ShipRocketAPIError(Exception):
    """Custom exception for ShipRocket API errors"""
    pass

class ShipRocketService:
    """
    Service class for interacting with ShipRocket API
    Handles authentication, token management, and all API calls
    """
    
    BASE_URL = "https://apiv2.shiprocket.in/v1/external"
    AUTH_URL = "https://apiv2.shiprocket.in/v1/external/auth/login"
    TOKEN_CACHE_KEY = "shiprocket_auth_token"
    TOKEN_EXPIRY_CACHE_KEY = "shiprocket_token_expiry"
    
    def __init__(self):
        self.email = getattr(settings, 'SHIPROCKET_EMAIL', None)
        self.password = getattr(settings, 'SHIPROCKET_PASSWORD', None)
        self.session = requests.Session()
        
        if not self.email or not self.password:
            raise ShipRocketAPIError("ShipRocket credentials not found in settings")
    
    def _get_auth_token(self) -> str:
        """
        Get authentication token from cache or request new one
        Token is valid for 240 hours (10 days)
        """
        # Check if we have a cached token
        token = cache.get(self.TOKEN_CACHE_KEY)
        expiry = cache.get(self.TOKEN_EXPIRY_CACHE_KEY)
        
        if token and expiry and datetime.now() < expiry:
            return token
        
        # Request new token
        logger.info("Requesting new ShipRocket authentication token")
        
        payload = {
            "email": self.email,
            "password": self.password
        }
        
        try:
            response = requests.post(self.AUTH_URL, json=payload, timeout=30)
            response.raise_for_status()
            
            data = response.json()
            
            if 'token' not in data:
                raise ShipRocketAPIError(f"Authentication failed: {data}")
            
            token = data['token']
            
            # Cache token for 240 hours minus 1 hour for safety
            expiry_time = datetime.now() + timedelta(hours=239)
            cache.set(self.TOKEN_CACHE_KEY, token, timeout=239*3600)
            cache.set(self.TOKEN_EXPIRY_CACHE_KEY, expiry_time, timeout=239*3600)
            
            logger.info("Successfully obtained new ShipRocket token")
            return token
            
        except requests.RequestException as e:
            logger.error(f"Failed to authenticate with ShipRocket: {e}")
            raise ShipRocketAPIError(f"Authentication failed: {e}")
    
    def _make_request(self, method: str, endpoint: str, data: dict = None, params: dict = None) -> dict:
        """
        Make authenticated request to ShipRocket API
        """
        token = self._get_auth_token()
        url = f"{self.BASE_URL}/{endpoint.lstrip('/')}"
        
        headers = {
            'Authorization': f'Bearer {token}',
            'Content-Type': 'application/json'
        }
        
        try:
            if method.upper() == 'GET':
                response = self.session.get(url, headers=headers, params=params, timeout=30)
            elif method.upper() == 'POST':
                response = self.session.post(url, headers=headers, json=data, timeout=30)
            elif method.upper() == 'PUT':
                response = self.session.put(url, headers=headers, json=data, timeout=30)
            elif method.upper() == 'DELETE':
                response = self.session.delete(url, headers=headers, timeout=30)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")
            
            # Handle token expiry
            if response.status_code == 401:
                logger.warning("ShipRocket token expired, requesting new token")
                cache.delete(self.TOKEN_CACHE_KEY)
                cache.delete(self.TOKEN_EXPIRY_CACHE_KEY)
                # Retry with new token
                token = self._get_auth_token()
                headers['Authorization'] = f'Bearer {token}'
                
                if method.upper() == 'GET':
                    response = self.session.get(url, headers=headers, params=params, timeout=30)
                elif method.upper() == 'POST':
                    response = self.session.post(url, headers=headers, json=data, timeout=30)
                elif method.upper() == 'PUT':
                    response = self.session.put(url, headers=headers, json=data, timeout=30)
                elif method.upper() == 'DELETE':
                    response = self.session.delete(url, headers=headers, timeout=30)
            
            response.raise_for_status()
            return response.json()
            
        except requests.RequestException as e:
            logger.error(f"ShipRocket API request failed: {method} {url} - {e}")
            if hasattr(e, 'response') and e.response is not None:
                try:
                    error_data = e.response.json()
                    logger.error(f"ShipRocket API error details: {error_data}")
                except:
                    logger.error(f"ShipRocket API error response: {e.response.text}")
            raise ShipRocketAPIError(f"API request failed: {e}")
    
    def create_order(self, order_data: dict) -> dict:
        """
        Create order in ShipRocket
        Returns order creation response with AWB code and courier details
        """
        logger.info(f"Creating ShipRocket order for order data: {order_data.get('order_id', 'Unknown')}")
        
        try:
            response = self._make_request('POST', 'orders/create/adhoc', data=order_data)
            logger.info(f"Successfully created ShipRocket order: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to create ShipRocket order: {e}")
            raise
    
    def get_courier_serviceability(self, pickup_postcode: str, delivery_postcode: str, 
                                 weight: float, cod: int = 0) -> dict:
        """
        Check courier serviceability and get shipping rates
        """
        params = {
            'pickup_postcode': pickup_postcode,
            'delivery_postcode': delivery_postcode,
            'weight': weight,
            'cod': cod
        }
        
        logger.info(f"Checking courier serviceability: {params}")
        
        try:
            response = self._make_request('GET', 'courier/serviceability', params=params)
            logger.info(f"Courier serviceability response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to check courier serviceability: {e}")
            raise
    
    def track_shipment(self, shipment_id: str) -> dict:
        """
        Track shipment status
        """
        try:
            response = self._make_request('GET', f'courier/track/shipment/{shipment_id}')
            logger.info(f"Shipment tracking response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to track shipment {shipment_id}: {e}")
            raise
    
    def track_awb(self, awb_code: str) -> dict:
        """
        Track shipment by AWB code
        """
        try:
            response = self._make_request('GET', f'courier/track/awb/{awb_code}')
            logger.info(f"AWB tracking response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to track AWB {awb_code}: {e}")
            raise
    
    def generate_pickup(self, shipment_id: str) -> dict:
        """
        Generate pickup request for shipment
        """
        data = {
            'shipment_id': shipment_id
        }
        
        try:
            response = self._make_request('POST', 'courier/generate/pickup', data=data)
            logger.info(f"Pickup generation response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to generate pickup for shipment {shipment_id}: {e}")
            raise
    
    def cancel_shipment(self, awb_codes: List[str]) -> dict:
        """
        Cancel shipment(s)
        """
        data = {
            'awbs': awb_codes
        }
        
        try:
            response = self._make_request('POST', 'orders/cancel/shipment/awbs', data=data)
            logger.info(f"Shipment cancellation response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to cancel shipments {awb_codes}: {e}")
            raise
    
    def get_order_details(self, order_id: str) -> dict:
        """
        Get order details from ShipRocket
        """
        try:
            response = self._make_request('GET', f'orders/show/{order_id}')
            logger.info(f"Order details response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to get order details for {order_id}: {e}")
            raise
    
    def return_order(self, order_id: str, return_reason: str = "Customer Request") -> dict:
        """
        Create return request for an order
        """
        data = {
            'order_id': order_id,
            'return_reason': return_reason
        }
        
        try:
            response = self._make_request('POST', 'orders/create/return', data=data)
            logger.info(f"Return order response: {response}")
            return response
        except Exception as e:
            logger.error(f"Failed to create return for order {order_id}: {e}")
            raise


# Singleton instance for global use
shiprocket_service = ShipRocketService()