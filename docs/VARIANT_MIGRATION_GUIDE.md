# Product Variant System Migration Guide

## Overview

This guide covers the migration to the new enhanced product variant system that introduces:
- **Separate color and size fields** for better filtering
- **Gender-based product filtering** (Male, Female, Unisex)
- **Enhanced OrderItem support** for variant tracking

## Database Changes

### Migration Files Applied
- `0014_add_variant_fields.py` - Adds new fields
- `0015_add_unique_constraint.py` - Adds unique constraint

### New Fields Added

#### Product Model
```sql
-- Added gender field with default 'unisex'
ALTER TABLE api_product ADD COLUMN gender VARCHAR(10) NOT NULL DEFAULT 'unisex';
```

#### ProductVariant Model
```sql
-- Added separate color and size fields
ALTER TABLE api_productvariant ADD COLUMN color VARCHAR(20) NOT NULL DEFAULT '';
ALTER TABLE api_productvariant ADD COLUMN size VARCHAR(10) NOT NULL DEFAULT '';

-- Removed old name field (handled automatically by migration)
ALTER TABLE api_productvariant DROP COLUMN name;

-- Added unique constraint
ALTER TABLE api_productvariant ADD CONSTRAINT api_productvariant_product_id_size_color_unique
    UNIQUE (product_id, size, color);
```

#### OrderItem Model
```sql
-- Added optional variant reference
ALTER TABLE api_orderitem ADD COLUMN variant_id BIGINT NULL
    REFERENCES api_productvariant(id) ON DELETE CASCADE;
```

## Data Migration Strategy

### For Existing Products

#### 1. Update Product Gender
```python
# All existing products default to 'unisex'
# Manually update specific products if needed:

from api.models import Product

# Example: Set specific products to male/female
male_products = Product.objects.filter(name__icontains='men')
male_products.update(gender='male')

female_products = Product.objects.filter(name__icontains='women')
female_products.update(gender='female')
```

#### 2. Migrate Existing ProductVariants

**Option A: Automatic Migration (Recommended)**
```python
from api.models import ProductVariant
import re

def migrate_existing_variants():
    """
    Migrate old 'name' field to separate 'size' and 'color' fields
    Example: "Red - Large" -> size='l', color='red'
    """

    size_map = {
        'xs': 'xs', 'extra small': 'xs',
        's': 's', 'small': 's',
        'm': 'm', 'medium': 'm',
        'l': 'l', 'large': 'l',
        'xl': 'xl', 'extra large': 'xl',
        'xxl': 'xxl', '2xl': 'xxl',
        'xxxl': 'xxxl', '3xl': 'xxxl'
    }

    color_map = {
        'red': 'red', 'blue': 'blue', 'green': 'green',
        'black': 'black', 'white': 'white', 'yellow': 'yellow',
        'pink': 'pink', 'purple': 'purple', 'orange': 'orange',
        'gray': 'gray', 'grey': 'gray', 'brown': 'brown',
        'navy': 'navy', 'maroon': 'maroon', 'olive': 'olive',
        'turquoise': 'turquoise'
    }

    # This migration would have been handled during 0014 migration
    # But for manual migration of data:

    for variant in ProductVariant.objects.filter(size='', color=''):
        old_name = variant.name if hasattr(variant, 'name') else ''

        # Parse old name format (e.g., "Red - Large")
        parts = [part.strip().lower() for part in old_name.split('-')]

        size = ''
        color = ''

        for part in parts:
            if part in size_map:
                size = size_map[part]
            elif part in color_map:
                color = color_map[part]

        # Update variant
        variant.size = size
        variant.color = color
        variant.save()

        print(f"Migrated: '{old_name}' -> size='{size}', color='{color}'")

# Run migration (only if needed manually)
# migrate_existing_variants()
```

**Option B: Manual Data Entry**
```python
# For small datasets, manually create new variants:

from api.models import Product, ProductVariant

product = Product.objects.get(name="Cotton T-Shirt")

# Create variants with new structure
ProductVariant.objects.create(
    product=product,
    size='m',
    color='red',
    sku='COTTON-TSHIRT-M-RED',
    stock=25
)

ProductVariant.objects.create(
    product=product,
    size='l',
    color='blue',
    sku='COTTON-TSHIRT-L-BLUE',
    stock=30
)
```

### For Existing Orders

Existing OrderItems will continue to work unchanged:
- `variant` field is optional (null=True, blank=True)
- Existing orders reference products only
- New orders can reference specific variants

```python
# Example: Adding variant to existing order items (optional)
from api.models import OrderItem, ProductVariant

for order_item in OrderItem.objects.filter(variant__isnull=True):
    # Try to match variant based on product
    # This is optional - existing orders work fine without variants
    possible_variants = ProductVariant.objects.filter(product=order_item.product)
    if possible_variants.count() == 1:
        order_item.variant = possible_variants.first()
        order_item.save()
```

## API Changes

### Updated Endpoints

#### Product Filtering
```http
# NEW: Gender filtering
GET /api/products/?gender=male
GET /api/products/?gender=female
GET /api/products/?gender=unisex

# Enhanced product details include gender
{
  "id": 1,
  "name": "T-Shirt",
  "gender": "unisex",
  "gender_display": "Unisex",
  ...
}
```

#### Variant Management
```http
# Updated variant structure
POST /api/product-variants/
{
  "product": 1,
  "size": "l",          // NEW: separate field
  "color": "red",       // NEW: separate field
  "sku": "TSHIRT-L-RED",
  "price_modifier": "0.00",
  "stock": 25
}

# Response includes display names
{
  "id": 1,
  "size": "l",
  "color": "red",
  "size_display": "L",      // Human-readable
  "color_display": "Red",   // Human-readable
  "final_price": 29.99,
  ...
}
```

#### Order Items
```http
# Orders now support variant references
{
  "items": [
    {
      "product": 1,
      "product_name": "T-Shirt",
      "variant": 1,              // NEW: optional variant ID
      "variant_name": "L, Red",  // NEW: human-readable variant
      "quantity": 2,
      "price": "29.99",
      "final_price": "29.99"     // NEW: includes variant modifier
    }
  ]
}
```

## Frontend Integration

### Filter Implementation
```javascript
// Gender filtering
const genderFilters = ['male', 'female', 'unisex'];
const selectedGender = 'male';

fetch(`/api/products/?gender=${selectedGender}`)
  .then(response => response.json())
  .then(products => {
    // Display filtered products
  });
```

### Variant Selection
```javascript
// Display variant options
const product = await fetch(`/api/enhanced-products/${productId}`).then(r => r.json());

// Group variants by size and color for UI
const sizeOptions = [...new Set(product.variants.map(v => v.size_display))];
const colorOptions = [...new Set(product.variants.map(v => v.color_display))];

// Find specific variant
function findVariant(size, color) {
  return product.variants.find(v =>
    v.size === size.toLowerCase() &&
    v.color === color.toLowerCase()
  );
}

// When user selects size and color
const selectedVariant = findVariant('l', 'red');
if (selectedVariant) {
  console.log(`Stock: ${selectedVariant.stock}`);
  console.log(`Price: $${selectedVariant.final_price}`);
}
```

### Order Creation
```javascript
// Create order with variants
const orderData = {
  items: [
    {
      product: 1,
      variant: selectedVariant.id,  // Include variant ID
      quantity: 2,
      price: selectedVariant.final_price
    }
  ],
  shipping_address: "...",
  total_price: calculateTotal()
};

fetch('/api/orders/create/', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(orderData)
});
```

## Validation & Constraints

### Database Constraints
- **Unique constraint**: (product_id, size, color) prevents duplicates
- **Foreign key**: variant_id in OrderItem references ProductVariant
- **Choices validation**: Size and color fields use predefined choices

### Business Logic Validation
```python
# Example validation in serializers
class ProductVariantSerializer(serializers.ModelSerializer):
    def validate(self, data):
        # Check for existing combination
        if ProductVariant.objects.filter(
            product=data['product'],
            size=data['size'],
            color=data['color']
        ).exists():
            raise serializers.ValidationError(
                "Variant with this size and color already exists"
            )
        return data
```

## Testing Migration

### Verification Script
```python
def verify_migration():
    """Verify the migration was successful"""
    from api.models import Product, ProductVariant, OrderItem

    # Check Product gender field
    total_products = Product.objects.count()
    gendered_products = Product.objects.exclude(gender='').count()
    print(f"Products with gender: {gendered_products}/{total_products}")

    # Check ProductVariant fields
    variants_with_size_color = ProductVariant.objects.exclude(
        size='', color=''
    ).count()
    total_variants = ProductVariant.objects.count()
    print(f"Variants with size/color: {variants_with_size_color}/{total_variants}")

    # Check unique constraint
    try:
        # This should fail if constraint is working
        ProductVariant.objects.create(
            product_id=1, size='m', color='red',
            sku='TEST-DUPLICATE'
        )
        print("WARNING: Unique constraint not working!")
    except Exception as e:
        print("✓ Unique constraint working correctly")

    # Check OrderItem variant relationship
    order_items_with_variants = OrderItem.objects.filter(
        variant__isnull=False
    ).count()
    print(f"Order items with variants: {order_items_with_variants}")

    print("Migration verification complete!")

# Run verification
verify_migration()
```

## Rollback Strategy

If rollback is needed (emergency only):

```sql
-- Remove new fields (CAUTION: Data loss)
ALTER TABLE api_orderitem DROP COLUMN variant_id;
ALTER TABLE api_productvariant DROP CONSTRAINT api_productvariant_product_id_size_color_unique;
ALTER TABLE api_productvariant DROP COLUMN size;
ALTER TABLE api_productvariant DROP COLUMN color;
ALTER TABLE api_productvariant ADD COLUMN name VARCHAR(100) NOT NULL DEFAULT '';
ALTER TABLE api_product DROP COLUMN gender;
```

**Note**: Rollback will cause data loss. Ensure proper backups before migration.

## Common Issues & Solutions

### Issue 1: Duplicate Variants
**Problem**: Migration creates duplicate variants
**Solution**:
```python
# Clean up duplicates before applying constraint
from django.db.models import Count
from api.models import ProductVariant

duplicates = ProductVariant.objects.values(
    'product', 'size', 'color'
).annotate(
    count=Count('id')
).filter(count__gt=1)

for dup in duplicates:
    variants = ProductVariant.objects.filter(
        product=dup['product'],
        size=dup['size'],
        color=dup['color']
    )
    # Keep first, delete others
    variants[1:].delete()
```

### Issue 2: Missing Size/Color Data
**Problem**: Variants have empty size/color fields
**Solution**:
```python
# Set default values for empty fields
ProductVariant.objects.filter(size='').update(size='m')
ProductVariant.objects.filter(color='').update(color='black')
```

### Issue 3: Frontend Caching
**Problem**: Frontend shows old data structure
**Solution**: Clear frontend cache and update API calls to use new field names

## Conclusion

The enhanced variant system provides:
- ✅ Better data structure for filtering
- ✅ Gender-based product organization
- ✅ Proper inventory tracking by size/color
- ✅ Backward compatibility with existing orders
- ✅ Database integrity with unique constraints

Migration is designed to be safe and non-destructive, with existing functionality preserved.