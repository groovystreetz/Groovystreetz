# ShipRocket Integration for GroovyStreetz

This document provides comprehensive information about the ShipRocket shipping integration implemented in your Django backend.

## 🚀 Features Implemented

### Core Features
- ✅ **Automatic Order Creation**: Orders are automatically created in ShipRocket when placed on your platform
- ✅ **Real-time Shipping Rates**: Calculate shipping costs for different couriers
- ✅ **Pincode Serviceability**: Check if delivery is available to specific locations
- ✅ **Order Tracking**: Track shipments with real-time status updates
- ✅ **Webhook Integration**: Automatic status updates from ShipRocket
- ✅ **Admin Management**: Admin panel for managing shipments

### Advanced Features
- ✅ **Multi-courier Support**: Access to ShipRocket's entire courier network
- ✅ **Automatic Pickup Generation**: Schedules pickups automatically
- ✅ **Status Synchronization**: Syncs order status with ShipRocket
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Public Tracking**: Customer-facing tracking without authentication

## 📋 Setup Instructions

### 1. Environment Variables
Copy `.env.example` to `.env` and configure the following variables:

```bash
# ShipRocket API Configuration
SHIPROCKET_EMAIL=your-shiprocket-email@example.com
SHIPROCKET_PASSWORD=your-shiprocket-password
SHIPROCKET_ENABLED=true

# ShipRocket Pickup Address (Your warehouse/store address)
SHIPROCKET_PICKUP_LOCATION=Primary
SHIPROCKET_PICKUP_NAME=GroovyStreetz
SHIPROCKET_PICKUP_EMAIL=pickup@groovystreetz.com
SHIPROCKET_PICKUP_PHONE=9876543210
SHIPROCKET_PICKUP_ADDRESS=Your pickup address line 1
SHIPROCKET_PICKUP_ADDRESS_2=Your pickup address line 2
SHIPROCKET_PICKUP_CITY=Your City
SHIPROCKET_PICKUP_STATE=Your State
SHIPROCKET_PICKUP_COUNTRY=India
SHIPROCKET_PICKUP_PINCODE=123456

# Default Package Dimensions
SHIPROCKET_DEFAULT_LENGTH=10
SHIPROCKET_DEFAULT_BREADTH=10
SHIPROCKET_DEFAULT_HEIGHT=5
SHIPROCKET_DEFAULT_WEIGHT=0.5

# Auto-pickup setting
SHIPROCKET_AUTO_PICKUP=true
```

### 2. Database Migration
The migration has already been applied, but if you need to run it again:

```bash
python manage.py migrate
```

### 3. ShipRocket Account Setup
1. Create an account at [ShipRocket](https://www.shiprocket.in/)
2. Go to Settings > API > Configure
3. Create an API user with email and password
4. Use these credentials in your `.env` file

## 📡 API Endpoints

### Shipping Endpoints

#### Calculate Shipping Rates
```
POST /api/shipping/calculate-rates/
Content-Type: application/json

{
    "delivery_pincode": "110001",
    "weight": 0.5,
    "cod": false,
    "order_value": 1000
}
```

#### Check Pincode Serviceability
```
GET /api/shipping/pincode/{pincode}/
```

### Tracking Endpoints

#### Track Order (Authenticated)
```
GET /api/orders/{order_id}/tracking/
Authorization: Bearer {token}
```

#### Public Tracking (No Auth Required)
```
GET /api/tracking/{awb_code}/
```

### Admin Endpoints

#### Manage Shipment
```
POST /api/admin/orders/{order_id}/shipment/
Content-Type: application/json

{
    "action": "generate_pickup" | "cancel_shipment" | "sync_status"
}
```

### Webhook Endpoints

#### ShipRocket Webhook (Configure in ShipRocket Panel)
```
POST /api/webhooks/shiprocket/
```

#### Test Webhook
```
POST /api/webhooks/shiprocket/test/
```

## 🔧 Configuration Options

### Order Model Fields Added

The following fields have been added to the Order model:

- `shiprocket_order_id`: ShipRocket's internal order ID
- `awb_code`: Airway Bill number for tracking
- `courier_company_id`: ID of the assigned courier
- `courier_company_name`: Name of the courier company
- `shipment_id`: ShipRocket shipment ID
- `shipment_pickup_token`: Token for pickup scheduling
- `shiprocket_status`: Current status from ShipRocket
- `estimated_delivery_date`: Expected delivery date
- `shipped_date`: Date when shipment was picked up
- `delivered_date`: Date when shipment was delivered
- `shipping_charges`: Actual shipping cost
- `is_shiprocket_enabled`: Toggle ShipRocket for specific orders

### Order Serializer Updates

The OrderSerializer now includes all ShipRocket fields with appropriate read-only permissions.

## 🔄 Workflow

### Order Creation Flow

1. Customer places an order on your platform
2. Django creates the order in the database
3. If ShipRocket is enabled:
   - Order is automatically sent to ShipRocket
   - AWB code and courier details are received
   - Pickup is automatically scheduled (if enabled)
   - Order is updated with ShipRocket information

### Status Update Flow

1. ShipRocket sends webhook notifications for status changes
2. Your webhook endpoint receives the notification
3. Order status is automatically updated in your database
4. Customers can track their orders in real-time

## 📊 Admin Features

### Django Admin Integration

ShipRocket fields are included in the Order admin interface for easy management.

### Admin API Functions

- **Generate Pickup**: Schedule pickup for existing orders
- **Cancel Shipment**: Cancel shipments before pickup
- **Sync Status**: Manually sync order status with ShipRocket

## 🛡️ Error Handling

### Graceful Failures

- If ShipRocket API is unavailable, orders are still created in Django
- Errors are logged for debugging
- Orders can be manually synced later

### Validation

- Address validation before sending to ShipRocket
- Pincode format validation
- Phone number format validation
- Order weight and dimensions validation

## 📝 Logging

ShipRocket operations are logged to:
- Console (development)
- File: `logs/shiprocket.log` (production)

Log levels:
- INFO: Successful operations
- WARNING: Validation failures
- ERROR: API failures and errors

## 🔍 Testing

### Test Endpoints

Use the test webhook endpoint to verify integration:

```bash
curl -X POST http://localhost:8000/api/webhooks/shiprocket/test/ \
-H "Content-Type: application/json" \
-d '{
    "order_id": "1",
    "current_status": "PICKED_UP"
}'
```

### Testing Checklist

- [ ] Environment variables configured
- [ ] ShipRocket credentials valid
- [ ] Pickup address configured
- [ ] Order creation triggers ShipRocket integration
- [ ] Shipping rate calculation works
- [ ] Order tracking functions properly
- [ ] Webhooks receive and process updates
- [ ] Admin functions work correctly

## 🚨 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify ShipRocket email/password in `.env`
   - Check if API user is created in ShipRocket panel

2. **Order Creation Fails**
   - Check pickup address configuration
   - Verify product weights and dimensions
   - Ensure shipping address has valid pincode

3. **Webhooks Not Working**
   - Configure webhook URL in ShipRocket panel
   - Ensure endpoint is accessible from internet
   - Check webhook payload format

### Debugging

Enable debug logging by setting:
```python
LOGGING['loggers']['api.shiprocket_service']['level'] = 'DEBUG'
```

## 📈 Performance Considerations

### Caching

- Authentication tokens are cached for 239 hours
- Rate calculation responses can be cached (implement as needed)

### Asynchronous Processing

For high-volume stores, consider:
- Using Celery for background order processing
- Implementing retry mechanisms for failed API calls
- Adding rate limiting for API calls

## 🔐 Security

- API credentials stored in environment variables
- Webhook endpoints include validation
- All sensitive operations require authentication
- Comprehensive logging for audit trails

## 🆘 Support

For issues with:
- **ShipRocket API**: Contact ShipRocket support
- **Integration Code**: Check logs and validate configuration
- **Django Integration**: Review model and serializer implementations

## 📚 API Documentation

ShipRocket API documentation: https://apidocs.shiprocket.in/

## 🎯 Next Steps

Recommended enhancements:
1. Add bulk order processing
2. Implement return/exchange workflows
3. Add shipping label generation
4. Create customer notification system
5. Add analytics and reporting dashboard