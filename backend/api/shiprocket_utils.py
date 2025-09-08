# backend/api/shiprocket_utils.py

import json
import logging
from decimal import Decimal
from typing import Dict, List, Optional, Tuple
from django.conf import settings
from django.utils import timezone
from .models import Order, Address, Product
import re

logger = logging.getLogger(__name__)

class ShipRocketDataMapper:
    """
    Utility class for mapping Django model data to ShipRocket API format
    """
    
    @staticmethod
    def parse_shipping_address(address_text: str) -> Dict[str, str]:
        """
        Parse shipping address text into components
        This is a basic parser - you might want to enhance it based on your address format
        """
        lines = [line.strip() for line in address_text.split('\n') if line.strip()]
        
        # Basic parsing logic - customize based on your address format
        parsed = {
            'address': '',
            'address_2': '',
            'city': '',
            'state': '',
            'country': 'India',
            'pin_code': ''
        }
        
        if len(lines) >= 1:
            parsed['address'] = lines[0]
        if len(lines) >= 2:
            parsed['address_2'] = lines[1] if len(lines) > 3 else ''
        
        # Try to extract pincode (6 digit number)
        for line in lines:
            pincode_match = re.search(r'\b\d{6}\b', line)
            if pincode_match:
                parsed['pin_code'] = pincode_match.group()
                # Remove pincode from the line and use remaining as city/state
                remaining = line.replace(parsed['pin_code'], '').strip(', ')
                if remaining:
                    parts = remaining.split(',')
                    if len(parts) >= 2:
                        parsed['city'] = parts[-2].strip()
                        parsed['state'] = parts[-1].strip()
                    elif len(parts) == 1:
                        parsed['city'] = parts[0].strip()
                break
        
        return parsed
    
    @staticmethod
    def get_order_weight(order: Order) -> float:
        """
        Calculate total order weight based on products
        Returns weight in kilograms
        """
        total_weight = 0.0
        default_weight = settings.SHIPROCKET_DEFAULT_DIMENSIONS['weight']
        
        for item in order.items.all():
            # If product has weight, use it; otherwise use default
            product_weight = getattr(item.product, 'weight', default_weight)
            if not product_weight:
                product_weight = default_weight
            total_weight += float(product_weight) * item.quantity
        
        # Minimum weight of 0.1 kg
        return max(total_weight, 0.1)
    
    @staticmethod
    def get_order_dimensions(order: Order) -> Dict[str, float]:
        """
        Calculate order dimensions (simplified approach)
        Returns dimensions in centimeters
        """
        defaults = settings.SHIPROCKET_DEFAULT_DIMENSIONS
        
        # For simplicity, we'll use default dimensions
        # In a real scenario, you might calculate based on product dimensions
        return {
            'length': defaults['length'],
            'breadth': defaults['breadth'], 
            'height': defaults['height']
        }
    
    @staticmethod
    def map_order_to_shiprocket(order: Order, billing_address: Optional[Address] = None) -> Dict:
        """
        Map Django Order object to ShipRocket order format
        """
        # Parse shipping address
        shipping_info = ShipRocketDataMapper.parse_shipping_address(order.shipping_address)
        
        # Get pickup address from settings
        pickup_info = settings.SHIPROCKET_DEFAULT_PICKUP
        
        # Calculate order weight and dimensions
        weight = ShipRocketDataMapper.get_order_weight(order)
        dimensions = ShipRocketDataMapper.get_order_dimensions(order)
        
        # Prepare order items
        order_items = []
        for item in order.items.all():
            order_items.append({
                'name': item.product.name,
                'sku': getattr(item.product, 'sku', f'PROD-{item.product.id}'),
                'units': item.quantity,
                'selling_price': float(item.price),
                'discount': '',
                'tax': '',
                'hsn': getattr(item.product, 'hsn_code', '')
            })
        
        # Build ShipRocket order data
        shiprocket_order = {
            'order_id': str(order.id),
            'order_date': order.created_at.strftime('%Y-%m-%d %H:%M'),
            'pickup_location': pickup_info['pickup_location'],
            'channel_id': '',
            'comment': f'Order from GroovyStreetz - Order #{order.id}',
            'billing_customer_name': order.user.get_full_name() if order.user else 'Guest Customer',
            'billing_last_name': '',
            'billing_address': shipping_info['address'],
            'billing_address_2': shipping_info.get('address_2', ''),
            'billing_city': shipping_info['city'],
            'billing_pincode': shipping_info['pin_code'],
            'billing_state': shipping_info['state'],
            'billing_country': shipping_info['country'],
            'billing_email': order.user.email if order.user else 'customer@groovystreetz.com',
            'billing_phone': getattr(order.user, 'phone', '9999999999') if order.user else '9999999999',
            'shipping_is_billing': True,
            'shipping_customer_name': '',
            'shipping_last_name': '',
            'shipping_address': '',
            'shipping_address_2': '',
            'shipping_city': '',
            'shipping_pincode': '',
            'shipping_country': '',
            'shipping_state': '',
            'shipping_email': '',
            'shipping_phone': '',
            'order_items': order_items,
            'payment_method': 'Prepaid',  # Assuming prepaid orders
            'sub_total': float(order.original_price),
            'length': dimensions['length'],
            'breadth': dimensions['breadth'],
            'height': dimensions['height'],
            'weight': weight
        }
        
        # Add COD details if needed
        if hasattr(order, 'payment_method') and getattr(order, 'payment_method') == 'COD':
            shiprocket_order.update({
                'payment_method': 'COD',
                'cod_amount': float(order.total_price)
            })
        
        return shiprocket_order
    
    @staticmethod
    def extract_address_components(address_obj: Address) -> Dict[str, str]:
        """
        Extract address components from Address model object
        """
        return {
            'name': f"{address_obj.user.first_name} {address_obj.user.last_name}".strip(),
            'phone': getattr(address_obj.user, 'phone', '9999999999'),
            'email': address_obj.user.email,
            'address': address_obj.address_line_1,
            'address_2': address_obj.address_line_2 or '',
            'city': address_obj.city,
            'state': address_obj.state,
            'country': address_obj.country,
            'pin_code': address_obj.postal_code
        }


class ShipRocketStatusMapper:
    """
    Maps ShipRocket status codes to Django order statuses
    """
    
    SHIPROCKET_TO_DJANGO_STATUS = {
        'NEW': 'pending',
        'AWB_ASSIGNED': 'pending', 
        'PICKUP_GENERATED': 'pending',
        'PICKED_UP': 'shipped',
        'IN_TRANSIT': 'shipped',
        'OUT_FOR_DELIVERY': 'shipped',
        'DELIVERED': 'delivered',
        'CANCELLED': 'cancelled',
        'RTO': 'cancelled',
        'LOST': 'cancelled',
        'DAMAGED': 'cancelled'
    }
    
    @staticmethod
    def get_django_status(shiprocket_status: str) -> str:
        """
        Convert ShipRocket status to Django order status
        """
        return ShipRocketStatusMapper.SHIPROCKET_TO_DJANGO_STATUS.get(
            shiprocket_status, 'pending'
        )


class ShipRocketValidator:
    """
    Validation utilities for ShipRocket integration
    """
    
    @staticmethod
    def validate_pincode(pincode: str) -> bool:
        """
        Validate Indian pincode format
        """
        if not pincode:
            return False
        return bool(re.match(r'^\d{6}$', str(pincode).strip()))
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """
        Validate phone number format
        """
        if not phone:
            return False
        # Remove all non-digits
        digits = re.sub(r'\D', '', phone)
        # Should be 10 digits for Indian numbers
        return len(digits) == 10
    
    @staticmethod
    def validate_order_for_shiprocket(order: Order) -> Tuple[bool, List[str]]:
        """
        Validate order for ShipRocket integration
        Returns (is_valid, list_of_errors)
        """
        errors = []
        
        # Check if order has items
        if not order.items.exists():
            errors.append("Order has no items")
        
        # Check if order has shipping address
        if not order.shipping_address:
            errors.append("Order has no shipping address")
        else:
            # Parse and validate address components
            shipping_info = ShipRocketDataMapper.parse_shipping_address(order.shipping_address)
            
            if not shipping_info['pin_code']:
                errors.append("Shipping address must contain a valid pincode")
            elif not ShipRocketValidator.validate_pincode(shipping_info['pin_code']):
                errors.append(f"Invalid pincode format: {shipping_info['pin_code']}")
            
            if not shipping_info['city']:
                errors.append("Shipping address must contain city")
            
            if not shipping_info['address']:
                errors.append("Shipping address must contain street address")
        
        # Check user information
        if order.user:
            if not order.user.email:
                errors.append("Customer email is required")
            
            phone = getattr(order.user, 'phone', None)
            if phone and not ShipRocketValidator.validate_phone(phone):
                errors.append("Invalid customer phone number format")
        
        # Check order total
        if order.total_price <= 0:
            errors.append("Order total must be greater than zero")
        
        return len(errors) == 0, errors
    
    @staticmethod
    def sanitize_shiprocket_data(data: Dict) -> Dict:
        """
        Sanitize data before sending to ShipRocket API
        """
        sanitized = data.copy()
        
        # Ensure phone numbers are 10 digits
        for field in ['billing_phone', 'shipping_phone']:
            if field in sanitized and sanitized[field]:
                phone = re.sub(r'\D', '', str(sanitized[field]))
                if len(phone) >= 10:
                    sanitized[field] = phone[-10:]  # Take last 10 digits
                else:
                    sanitized[field] = '9999999999'  # Default number
        
        # Ensure pincodes are 6 digits
        for field in ['billing_pincode', 'shipping_pincode']:
            if field in sanitized and sanitized[field]:
                pincode = re.sub(r'\D', '', str(sanitized[field]))
                if len(pincode) == 6:
                    sanitized[field] = pincode
                else:
                    # Remove invalid pincode
                    sanitized[field] = ''
        
        # Ensure numeric fields are properly formatted
        numeric_fields = ['sub_total', 'length', 'breadth', 'height', 'weight']
        for field in numeric_fields:
            if field in sanitized and sanitized[field]:
                try:
                    sanitized[field] = float(sanitized[field])
                except (ValueError, TypeError):
                    if field == 'weight':
                        sanitized[field] = 0.5  # Default weight
                    else:
                        sanitized[field] = 0
        
        # Ensure order items have required fields
        if 'order_items' in sanitized:
            for item in sanitized['order_items']:
                if 'selling_price' in item:
                    try:
                        item['selling_price'] = float(item['selling_price'])
                    except (ValueError, TypeError):
                        item['selling_price'] = 0.0
                
                if 'units' in item:
                    try:
                        item['units'] = int(item['units'])
                    except (ValueError, TypeError):
                        item['units'] = 1
        
        return sanitized


class ShipRocketHelper:
    """
    Helper functions for common ShipRocket operations
    """
    
    @staticmethod
    def calculate_shipping_discount(original_shipping: float, applied_shipping: float) -> float:
        """
        Calculate shipping discount amount
        """
        return max(0, original_shipping - applied_shipping)
    
    @staticmethod
    def is_cod_available(pincode: str, order_value: float) -> bool:
        """
        Check if COD is available for given pincode and order value
        This is a placeholder - implement based on your business rules
        """
        # Basic validation
        if not ShipRocketValidator.validate_pincode(pincode):
            return False
        
        # Example business rules
        if order_value > 50000:  # COD not available for orders above ₹50,000
            return False
        
        # Add more business logic as needed
        return True
    
    @staticmethod
    def format_tracking_url(awb_code: str) -> str:
        """
        Generate tracking URL for AWB code
        """
        if not awb_code:
            return ''
        return f"https://shiprocket.co/tracking/{awb_code}"
    
    @staticmethod
    def parse_shiprocket_webhook(webhook_data: Dict) -> Dict:
        """
        Parse and standardize ShipRocket webhook data
        """
        parsed = {
            'order_id': webhook_data.get('order_id'),
            'awb_code': webhook_data.get('awb_code'),
            'shipment_id': webhook_data.get('shipment_id'),
            'current_status': webhook_data.get('current_status'),
            'delivery_date': webhook_data.get('delivered_date'),
            'pickup_date': webhook_data.get('pickup_date'),
            'expected_delivery': webhook_data.get('etd'),
            'courier_company': webhook_data.get('courier_company_name'),
            'courier_id': webhook_data.get('courier_company_id'),
            'tracking_data': webhook_data.get('scans', [])
        }
        
        return {k: v for k, v in parsed.items() if v is not None}
    
    @staticmethod
    def get_business_days_from_now(days: int) -> timezone.datetime:
        """
        Calculate business date (excluding weekends) from current date
        """
        current = timezone.now()
        business_days_added = 0
        
        while business_days_added < days:
            current += timezone.timedelta(days=1)
            # Skip weekends (Saturday=5, Sunday=6)
            if current.weekday() < 5:
                business_days_added += 1
        
        return current