# Webhooks

This document provides details on the webhooks used in the Groovystreetz backend.

## Printful Webhook

### `POST /api/webhooks/printful/`

This endpoint is designed to receive webhook notifications from Printful, our print-on-demand service provider. It is used to keep our system's order information in sync with Printful's.

#### Security

This endpoint is exempt from CSRF (Cross-Site Request Forgery) protection because Printful, as an external service, does not have access to our application's CSRF token.

#### Events

The webhook currently handles the following event:

*   **`order_shipped`**: This event is triggered when Printful ships an order. The webhook will then update the corresponding order in our database with the `shipped` status and the tracking number.

#### Expected Payload

The webhook expects a JSON payload with the following structure for the `order_shipped` event:

```json
{
    "type": "order_shipped",
    "data": {
        "order": {
            "id": "printful_order_id"
        },
        "shipment": {
            "tracking_number": "ABC123XYZ"
        }
    }
}
```
