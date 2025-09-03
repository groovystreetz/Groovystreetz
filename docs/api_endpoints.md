# Comprehensive API Endpoints Reference

## **Recently Added Features (Complete Implementation)**

### ✅ **New Category & Product Features**
```http
# Get category by ID with image
GET /api/categories/{id}/
Response: { "id": 1, "name": "T-Shirts", "slug": "t-shirts", "image": "categories/tshirts.jpg" }

# Enhanced products with variants, images, reviews
GET /api/enhanced-products/
Query: ?categories=tshirts,hoodies&search=red&min_price=10&max_price=100&new_arrivals=true

# New arrivals (last 30 days)
GET /api/new-arrivals/
```

### ✅ **Order Management Enhancements**
```http
# Update order status (Admin/SuperAdmin)
PATCH /api/admin/orders/{order_id}/status/
{
  "status": "shipped",  # pending, shipped, delivered, cancelled
  "tracking_number": "TRACK123456"
}

# Orders now include user details and address
GET /api/orders/{id}/
Response includes: { "user_details": { "name": "John Doe", "email": "john@example.com", "phone": "+1234567890" } }
```

### ✅ **User Profile & Address Management**
```http
# Enhanced profile editing
PATCH /api/profile/edit/
{ "first_name": "John", "last_name": "Doe", "phone": "+1234567890", "email": "new@email.com" }

# Multiple addresses with default setting
GET /api/enhanced-addresses/
POST /api/enhanced-addresses/
{ "address_line_1": "123 Main St", "city": "NYC", "is_default": true }

# Delete address
DELETE /api/addresses/{address_id}/delete/

# Soft delete user account
DELETE /api/user/delete/

# Admin contact update for support
PATCH /api/admin/users/{user_id}/contact/
{ "phone": "+9876543210", "email": "support@email.com" }
```

### ✅ **Product Variants & Multiple Images**
```http
# Product variants (color, size, etc.)
GET /api/product-variants/?product={product_id}
POST /api/product-variants/
{
  "product": 1,
  "name": "Red - Large",
  "sku": "TSHIRT-RED-L",
  "price_modifier": "5.00",  # Extra ₹5 for this variant
  "stock": 50
}

# Multiple images per product/variant
GET /api/product-images/?product={product_id}
POST /api/product-images/
{
  "product": 1,
  "variant": 2,  # Optional: specific to red variant
  "image": [file],
  "alt_text": "Red t-shirt front view",
  "is_primary": true,
  "order": 0
}
```

### ✅ **Review & Rating System**
```http
# Product reviews with 5-star rating
GET /api/reviews/?product={product_id}
POST /api/reviews/
{
  "product": 1,
  "rating": 5,  # 1-5 stars
  "title": "Great product!",
  "comment": "Love the quality and fit!"
}

# Mark review as helpful
POST /api/reviews/{review_id}/helpful/

# Admin review management
GET /api/admin/reviews/
PATCH /api/admin/reviews/{id}/  # Approve/disapprove
```

### ✅ **Reward Points System**
```http
# Get user's reward points
GET /api/reward-points/
Response: {
  "reward_points": { "total_points": 2500 },
  "recent_transactions": [
    { "transaction_type": "earn", "points": 10, "description": "Purchase reward", "created_at": "..." }
  ]
}

# Redeem points (1000 points = ₹1000 coupon)
POST /api/reward-points/redeem/
{ "points": 1000 }
Response: {
  "message": "Successfully redeemed 1000 points",
  "coupon_code": "REWARD12345",
  "coupon_value": 1000,
  "remaining_points": 1500
}
```

### ✅ **Testimonials System**
```http
# Public testimonials
GET /api/testimonials/
Query: ?featured=true

# Submit testimonial
POST /api/testimonials/
{ "content": "Amazing service and products!", "rating": 5 }

# Admin testimonial management
GET /api/admin/testimonials/
PATCH /api/admin/testimonials/{id}/
{ "is_approved": true, "is_featured": true }
```

### ✅ **Contact Us System**
```http
# Submit contact message
POST /api/contact/
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "subject": "order",  # general, order, product, shipping, return, technical, other
  "message": "I have a question about my recent order..."
}

# Admin contact management
GET /api/admin/contacts/
Query: ?resolved=false

# Mark contact as resolved
PATCH /api/admin/contacts/{message_id}/resolve/
```

### ✅ **Multiple Category Filtering**
```http
# Filter products by multiple categories
GET /api/enhanced-products/?categories=tshirts,hoodies,jeans
# Comma-separated category slugs

# Advanced filtering
GET /api/enhanced-products/?categories=tshirts&min_price=10&max_price=50&search=cotton&new_arrivals=true
```

### ✅ **Homepage Content Management**
```http
# Banners
GET /api/banners/
Query: ?type=hero  # hero, promotion, category

# Spotlight content
GET /api/spotlights/

# Admin banner management
GET /api/admin/banners/
POST /api/admin/banners/
{
  "title": "Summer Sale",
  "subtitle": "Up to 50% off!",
  "image": [file],
  "banner_type": "promotion",
  "link_url": "/products/sale",
  "link_text": "Shop Now",
  "start_date": "2024-06-01T00:00:00Z",
  "end_date": "2024-08-31T23:59:59Z",
  "order": 1
}

# Admin spotlight management
GET /api/admin/spotlights/
POST /api/admin/spotlights/
{
  "title": "Featured Product",
  "description": "Check out our best seller!",
  "spotlight_type": "product",
  "product": 1,
  "image": [file],
  "order": 1
}
```

## **Advanced Permission System**

### ✅ **Granular Role & Permission Management**
```http
# List all permissions
GET /api/permissions/
Response: [
  {
    "id": 1,
    "name": "Read Products",
    "codename": "read_products",
    "permission_type": "read",
    "resource_type": "products"
  }
]

# Role management (SuperAdmin only)
GET /api/admin/roles/
POST /api/admin/roles/
{
  "name": "Product Manager",
  "description": "Can manage products only",
  "permission_ids": [1, 2, 3, 4],  # read_products, write_products, delete_products, manage_products
  "is_active": true
}

# Assign roles to users
POST /api/admin/assign-roles/
{
  "user_id": 5,
  "role_ids": [1, 2]  # Multiple roles can be assigned
}

# Check user permissions
GET /api/user/permissions/
Response: {
  "user": "admin@example.com",
  "role": "admin",
  "permissions": {
    "products": [
      { "codename": "read_products", "permission_type": "read" },
      { "codename": "write_products", "permission_type": "write" }
    ],
    "orders": [ ... ]
  },
  "permission_count": 15
}

# Check specific permission
POST /api/user/check-permission/
{ "permission": "read_products" }
Response: { "user": "admin@example.com", "permission": "read_products", "has_permission": true }

# Initialize default permissions (run once)
POST /api/admin/initialize-permissions/
```

## **Permission Types & Resources**

### **Permission Types:**
- `read` - View/read access
- `write` - Create/update access  
- `delete` - Delete access
- `manage` - Full management access

### **Resource Types:**
- `users` - User Management
- `products` - Product Management
- `orders` - Order Management
- `coupons` - Coupon Management
- `reviews` - Review Management
- `testimonials` - Testimonial Management
- `contacts` - Contact Management
- `banners` - Banner Management
- `spotlights` - Spotlight Management
- `rewards` - Reward Points Management
- `analytics` - Analytics & Reports

### **Example Permission Codenames:**
- `read_products` - Can view products
- `write_orders` - Can create/update orders
- `delete_users` - Can delete users
- `manage_coupons` - Full coupon management

## **Enhanced Coupon System**

### ✅ **Coupon Validation & Application**
```http
# Validate coupon before applying
POST /api/coupons/validate/
{
  "coupon_code": "SAVE20",
  "order_total": "100.00"
}

Response: {
  "valid": true,
  "coupon": {
    "code": "SAVE20",
    "name": "20% Off Everything",
    "discount_type": "percentage",
    "discount_value": "20.00",
    "no_return_policy": false
  },
  "discount_amount": "20.00",
  "final_total": "80.00"
}

# Apply coupon to order
POST /api/coupons/apply/
{ "coupon_code": "SAVE20" }

# Admin coupon management
GET /api/admin/coupons/
Query: ?is_active=true&discount_type=percentage

# Coupon analytics
GET /api/admin/coupon-stats/
Response: {
  "total_coupons": 50,
  "active_coupons": 35,
  "expired_coupons": 10,
  "total_usage": 1250,
  "total_discount_given": 15750.50,
  "top_coupons": [
    { "code": "SAVE20", "usage_count": 450, "discount_type": "percentage" }
  ]
}
```

## **Response Examples**

### **Enhanced Product Response (with variants & images)**
```json
{
  "id": 1,
  "name": "Cotton T-Shirt",
  "description": "Premium cotton t-shirt",
  "price": "29.99",
  "category": "T-Shirts",
  "stock": 100,
  "variants": [
    {
      "id": 1,
      "name": "Red - Large",
      "sku": "TSHIRT-RED-L",
      "price_modifier": "0.00",
      "final_price": "29.99",
      "stock": 25
    },
    {
      "id": 2,
      "name": "Blue - Medium", 
      "sku": "TSHIRT-BLUE-M",
      "price_modifier": "0.00",
      "final_price": "29.99",
      "stock": 30
    }
  ],
  "images": [
    {
      "id": 1,
      "image": "/media/products/gallery/tshirt-red-front.jpg",
      "alt_text": "Red t-shirt front view",
      "is_primary": true,
      "variant": 1
    },
    {
      "id": 2,
      "image": "/media/products/gallery/tshirt-red-back.jpg", 
      "alt_text": "Red t-shirt back view",
      "is_primary": false,
      "variant": 1
    }
  ],
  "reviews": [
    {
      "id": 1,
      "user_name": "John Doe",
      "rating": 5,
      "title": "Great quality!",
      "comment": "Love the fit and fabric quality.",
      "is_verified_purchase": true,
      "helpful_count": 5
    }
  ],
  "average_rating": 4.5,
  "review_count": 12
}
```

### **Enhanced Order Response (with user details)**
```json
{
  "id": 123,
  "user_details": {
    "name": "John Doe",
    "email": "john@example.com", 
    "phone": "+1234567890"
  },
  "items": [
    {
      "product": 1,
      "quantity": 2,
      "price": "29.99"
    }
  ],
  "original_price": "79.98",
  "discount_amount": "15.00",
  "total_price": "64.98",
  "shipping_address": "123 Main St, NYC, NY 10001",
  "status": "shipped",
  "tracking_number": "TRACK123456",
  "coupon_code": "SAVE20",
  "has_discount": true,
  "discount_percentage": 18.75,
  "no_return_allowed": false,
  "created_at": "2024-01-15T10:30:00Z"
}
```

## **All Endpoints Summary**

### **Authentication & Profile**
- `POST /api/register/` - User registration  
- `POST /api/login/` - User login
- `POST /api/logout/` - User logout  
- `PATCH /api/profile/edit/` - Edit user profile
- `DELETE /api/user/delete/` - Delete user account

### **Categories & Products** 
- `GET /api/categories/` - List categories
- `GET /api/categories/{id}/` - Get category by ID ✅
- `GET /api/enhanced-products/` - Enhanced product list ✅
- `GET /api/enhanced-products/{id}/` - Enhanced product detail ✅
- `GET /api/new-arrivals/` - New arrival products ✅

### **Product Management (Admin)**
- `GET/POST/PATCH/DELETE /api/admin/products/` - Full product CRUD
- `GET/POST/PATCH/DELETE /api/product-variants/` - Variant management ✅
- `GET/POST/PATCH/DELETE /api/product-images/` - Image management ✅

### **Orders**
- `POST /api/orders/create/` - Create order
- `GET /api/orders/` - User order history  
- `GET /api/orders/{id}/` - Order details
- `PATCH /api/admin/orders/{id}/status/` - Update order status ✅

### **Reviews & Ratings** ✅
- `GET /api/reviews/` - List reviews
- `POST /api/reviews/` - Create review
- `POST /api/reviews/{id}/helpful/` - Mark helpful
- Admin: `GET/POST/PATCH/DELETE /api/admin/reviews/`

### **Addresses** ✅
- `GET/POST/PATCH/DELETE /api/enhanced-addresses/` - Enhanced address management
- `DELETE /api/addresses/{id}/delete/` - Delete address

### **Wishlist**
- `GET /api/wishlist/` - Get wishlist
- `POST /api/wishlist/add/{product_id}/` - Add to wishlist
- `DELETE /api/wishlist/remove/{product_id}/` - Remove from wishlist
- `POST /api/wishlist/toggle/{product_id}/` - Toggle wishlist
- `DELETE /api/wishlist/clear/` - Clear wishlist
- `GET /api/wishlist/stats/` - Wishlist stats
- `GET /api/wishlist/check/{product_id}/` - Check if in wishlist

### **Coupons**
- `POST /api/coupons/validate/` - Validate coupon ✅
- `POST /api/coupons/apply/` - Apply coupon ✅
- Admin: `GET/POST/PATCH/DELETE /api/admin/coupons/`
- `GET /api/admin/coupon-stats/` - Coupon analytics

### **Reward Points** ✅
- `GET /api/reward-points/` - Get user points
- `POST /api/reward-points/redeem/` - Redeem points

### **Content Management** ✅
- `GET /api/testimonials/` - Public testimonials
- `POST /api/testimonials/` - Submit testimonial  
- `POST /api/contact/` - Contact form
- `GET /api/banners/` - Homepage banners
- `GET /api/spotlights/` - Featured content
- Admin: Full CRUD for all content types

### **Admin & User Management**
- `GET /api/admin/users/` - List users
- `PATCH /api/admin/users/{id}/` - Update user
- `PATCH /api/admin/users/{id}/contact/` - Update contact info ✅
- `GET /api/admin/orders/` - All orders
- `GET /api/admin/sales-report/` - Sales analytics

### **Permission System** ✅
- `GET /api/permissions/` - List permissions
- `GET/POST/PATCH/DELETE /api/admin/roles/` - Role management
- `POST /api/admin/assign-roles/` - Assign user roles
- `GET /api/user/permissions/` - User permissions
- `POST /api/user/check-permission/` - Check permission
- `POST /api/admin/initialize-permissions/` - Initialize system

**🎯 Total: 60+ endpoints covering all requested functionality!**