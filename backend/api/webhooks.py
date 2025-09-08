# backend/api/webhooks.py

import json
import logging
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils.decorators import method_decorator
from rest_framework import views, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import Order
from .shiprocket_utils import ShipRocketHelper

logger = logging.getLogger(__name__)

@method_decorator(csrf_exempt, name='dispatch')
class ShipRocketWebhookView(views.APIView):
    """
    Handle ShipRocket webhook notifications for order status updates
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Process ShipRocket webhook payload
        """
        try:
            # Log the incoming webhook for debugging
            webhook_data = request.data if hasattr(request, 'data') else json.loads(request.body)
            logger.info(f"Received ShipRocket webhook: {webhook_data}")
            
            # Parse webhook data
            parsed_data = ShipRocketHelper.parse_shiprocket_webhook(webhook_data)
            
            # Extract order information
            order_id = parsed_data.get('order_id')
            awb_code = parsed_data.get('awb_code')
            current_status = parsed_data.get('current_status')
            
            if not order_id and not awb_code:
                logger.warning("Webhook received without order_id or awb_code")
                return Response({
                    'error': 'Invalid webhook data: missing order_id or awb_code'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Find the order
            order = None
            
            # Try to find by order ID first
            if order_id:
                try:
                    order = Order.objects.get(id=order_id)
                except Order.DoesNotExist:
                    logger.warning(f"Order with ID {order_id} not found")
            
            # If not found by order ID, try by AWB code
            if not order and awb_code:
                try:
                    order = Order.objects.get(awb_code=awb_code)
                except Order.DoesNotExist:
                    logger.warning(f"Order with AWB {awb_code} not found")
            
            if not order:
                logger.error(f"No order found for webhook data: order_id={order_id}, awb_code={awb_code}")
                return Response({
                    'error': 'Order not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            # Update order with webhook data
            self._update_order_from_webhook(order, parsed_data)
            
            logger.info(f"Successfully processed webhook for order {order.id}")
            
            return Response({
                'success': True,
                'message': 'Webhook processed successfully',
                'order_id': order.id,
                'status': current_status
            }, status=status.HTTP_200_OK)
        
        except json.JSONDecodeError as e:
            logger.error(f"Invalid JSON in webhook: {e}")
            return Response({
                'error': 'Invalid JSON format'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        except Exception as e:
            logger.error(f"Error processing ShipRocket webhook: {e}")
            return Response({
                'error': 'Webhook processing failed'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def _update_order_from_webhook(self, order: Order, webhook_data: dict):
        """
        Update order based on webhook data
        """
        from django.utils import timezone
        from datetime import datetime
        
        # Update basic ShipRocket information
        if 'current_status' in webhook_data:
            order.shiprocket_status = webhook_data['current_status']
        
        if 'courier_company' in webhook_data:
            order.courier_company_name = webhook_data['courier_company']
        
        if 'courier_id' in webhook_data:
            order.courier_company_id = webhook_data['courier_id']
        
        # Update dates based on status
        current_status = webhook_data.get('current_status', '')
        
        if current_status == 'PICKED_UP' and not order.shipped_date:
            if 'pickup_date' in webhook_data and webhook_data['pickup_date']:
                try:
                    order.shipped_date = datetime.fromisoformat(webhook_data['pickup_date'].replace('Z', '+00:00'))
                except:
                    order.shipped_date = timezone.now()
            else:
                order.shipped_date = timezone.now()
            
            # Update Django order status
            if order.status == 'pending':
                order.status = 'shipped'
        
        elif current_status == 'DELIVERED' and not order.delivered_date:
            if 'delivery_date' in webhook_data and webhook_data['delivery_date']:
                try:
                    order.delivered_date = datetime.fromisoformat(webhook_data['delivery_date'].replace('Z', '+00:00'))
                except:
                    order.delivered_date = timezone.now()
            else:
                order.delivered_date = timezone.now()
            
            # Update Django order status
            order.status = 'delivered'
        
        elif current_status in ['CANCELLED', 'RTO', 'LOST']:
            order.status = 'cancelled'
        
        # Update estimated delivery date
        if 'expected_delivery' in webhook_data and webhook_data['expected_delivery']:
            try:
                order.estimated_delivery_date = datetime.fromisoformat(
                    webhook_data['expected_delivery'].replace('Z', '+00:00')
                )
            except:
                pass
        
        # Save the updated order
        order.save()
        
        # Log the update
        logger.info(f"Order {order.id} updated from webhook: status={current_status}, django_status={order.status}")


@csrf_exempt
@require_http_methods(["POST"])
def shiprocket_webhook_legacy(request):
    """
    Legacy function-based view for ShipRocket webhooks
    Keep this for backward compatibility if needed
    """
    try:
        webhook_data = json.loads(request.body)
        logger.info(f"Legacy webhook received: {webhook_data}")
        
        # Process using the class-based view logic
        view = ShipRocketWebhookView()
        mock_request = type('MockRequest', (), {'data': webhook_data})()
        response = view.post(mock_request)
        
        if hasattr(response, 'status_code') and response.status_code == 200:
            return JsonResponse({'success': True})
        else:
            return JsonResponse({'error': 'Processing failed'}, status=400)
    
    except Exception as e:
        logger.error(f"Legacy webhook error: {e}")
        return JsonResponse({'error': 'Webhook processing failed'}, status=500)


class ShipRocketWebhookTestView(views.APIView):
    """
    Test endpoint for ShipRocket webhook integration
    """
    permission_classes = [AllowAny]
    
    def post(self, request):
        """
        Test webhook processing with sample data
        """
        sample_webhook = {
            'order_id': request.data.get('order_id', '1'),
            'awb_code': request.data.get('awb_code', 'TEST123456'),
            'current_status': request.data.get('current_status', 'PICKED_UP'),
            'courier_company_name': 'Test Courier',
            'courier_company_id': '1',
            'pickup_date': '2024-01-15T10:00:00Z',
            'etd': '2024-01-18T18:00:00Z'
        }
        
        # Process the test webhook
        webhook_view = ShipRocketWebhookView()
        mock_request = type('MockRequest', (), {'data': sample_webhook})()
        response = webhook_view.post(mock_request)
        
        return Response({
            'message': 'Test webhook processed',
            'sample_data': sample_webhook,
            'processing_result': response.data if hasattr(response, 'data') else 'Unknown'
        }, status=status.HTTP_200_OK)
    
    def get(self, request):
        """
        Get webhook test information
        """
        return Response({
            'message': 'ShipRocket Webhook Test Endpoint',
            'endpoints': {
                'webhook': '/api/webhooks/shiprocket/',
                'test': '/api/webhooks/shiprocket/test/',
                'legacy': '/api/webhooks/shiprocket/legacy/'
            },
            'sample_payload': {
                'order_id': 'your_order_id',
                'awb_code': 'airway_bill_code',
                'current_status': 'PICKED_UP|DELIVERED|CANCELLED',
                'courier_company_name': 'courier_name',
                'pickup_date': '2024-01-15T10:00:00Z',
                'delivery_date': '2024-01-18T15:30:00Z',
                'etd': '2024-01-18T18:00:00Z'
            }
        }, status=status.HTTP_200_OK)