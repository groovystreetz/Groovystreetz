# backend/api/coupon_utils.py

from decimal import Decimal
from django.utils import timezone
from django.core.exceptions import ValidationError
from .models import Coupon, CouponUsage


class CouponValidator:
    """
    Comprehensive coupon validation and calculation utility
    """
    
    def __init__(self, coupon_code, user, order_items=None, order_total=None):
        self.coupon_code = coupon_code.upper().strip()
        self.user = user
        self.order_items = order_items or []
        self.order_total = Decimal(str(order_total or 0))
        self.coupon = None
        self.errors = []

    def validate(self):
        """
        Perform comprehensive coupon validation
        Returns: (is_valid, errors, coupon_instance)
        """
        try:
            # Check if coupon exists
            self.coupon = Coupon.objects.get(code=self.coupon_code)
        except Coupon.DoesNotExist:
            self.errors.append("Invalid coupon code")
            return False, self.errors, None

        # Run all validation checks
        validation_checks = [
            self._check_active_status,
            self._check_date_validity,
            self._check_user_restrictions,
            self._check_usage_limits,
            self._check_minimum_order_value,
            self._check_product_restrictions,
        ]

        for check in validation_checks:
            if not check():
                break

        is_valid = len(self.errors) == 0
        return is_valid, self.errors, self.coupon

    def _check_active_status(self):
        """Check if coupon is active"""
        if not self.coupon.is_active:
            self.errors.append("This coupon is currently inactive")
            return False
        return True

    def _check_date_validity(self):
        """Check if coupon is within valid date range"""
        now = timezone.now()
        if now < self.coupon.valid_from:
            self.errors.append("This coupon is not yet valid")
            return False
        if now > self.coupon.valid_until:
            self.errors.append("This coupon has expired")
            return False
        return True

    def _check_user_restrictions(self):
        """Check user-specific restrictions"""
        if not self.coupon.can_be_used_by_user(self.user):
            self.errors.append("You are not eligible to use this coupon")
            return False
        return True

    def _check_usage_limits(self):
        """Check usage limits (total and per-user)"""
        # Check total usage limit
        if self.coupon.max_uses_total is not None:
            if self.coupon.total_uses >= self.coupon.max_uses_total:
                self.errors.append("This coupon has reached its usage limit")
                return False

        # Check per-user usage limit
        user_usage_count = self.coupon.get_user_usage_count(self.user)
        if user_usage_count >= self.coupon.max_uses_per_user:
            self.errors.append("You have already used this coupon the maximum number of times")
            return False

        return True

    def _check_minimum_order_value(self):
        """Check minimum order value requirement"""
        if self.order_total < self.coupon.minimum_order_value:
            self.errors.append(f"Minimum order value of ${self.coupon.minimum_order_value} required")
            return False
        return True

    def _check_product_restrictions(self):
        """Check product/category restrictions"""
        # If no restrictions specified, coupon applies to all products
        if not self.coupon.categories.exists() and not self.coupon.products.exists():
            return True

        # Check if any order items match the restrictions
        applicable_items = []
        
        for item in self.order_items:
            product = item.get('product') if isinstance(item, dict) else item.product
            
            # Check product-specific restrictions
            if self.coupon.products.filter(id=product.id).exists():
                applicable_items.append(item)
                continue
            
            # Check category restrictions
            if product.category and self.coupon.categories.filter(id=product.category.id).exists():
                applicable_items.append(item)

        if not applicable_items:
            self.errors.append("This coupon is not applicable to any items in your cart")
            return False

        return True


class CouponCalculator:
    """
    Calculate discount amount based on coupon type and order details
    """
    
    @staticmethod
    def calculate_discount(coupon, order_total, order_items=None):
        """
        Calculate the discount amount for a given coupon and order
        Returns: (discount_amount, final_total)
        """
        order_total = Decimal(str(order_total))
        discount_amount = Decimal('0')

        if coupon.discount_type == 'percentage':
            discount_amount = (order_total * coupon.discount_value) / Decimal('100')
        
        elif coupon.discount_type == 'fixed':
            discount_amount = min(coupon.discount_value, order_total)
        
        elif coupon.discount_type == 'free_shipping':
            # Assuming shipping cost calculation - could be enhanced
            # For now, we'll apply a fixed shipping discount
            shipping_cost = Decimal('10.00')  # This should be dynamic
            discount_amount = min(shipping_cost, order_total)
        
        elif coupon.discount_type == 'buy_x_get_y':
            # This requires more complex logic based on specific product quantities
            # For now, we'll implement a simple version
            discount_amount = CouponCalculator._calculate_buy_x_get_y_discount(
                coupon, order_items or []
            )

        # Ensure discount doesn't exceed order total
        discount_amount = min(discount_amount, order_total)
        final_total = order_total - discount_amount

        return discount_amount, final_total

    @staticmethod
    def _calculate_buy_x_get_y_discount(coupon, order_items):
        """
        Calculate discount for buy X get Y free offers
        This is a simplified implementation
        """
        discount_amount = Decimal('0')
        
        # Example: Buy 2 get 1 free (discount_value represents the ratio)
        # This would need to be enhanced based on specific business rules
        
        for item in order_items:
            product = item.get('product') if isinstance(item, dict) else item.product
            quantity = item.get('quantity', 1) if isinstance(item, dict) else item.quantity
            price = item.get('price') if isinstance(item, dict) else item.price
            
            # Simple logic: for every 3 items, discount 1
            free_items = quantity // 3
            discount_amount += Decimal(str(price)) * free_items

        return discount_amount


def apply_coupon_to_order(coupon_code, user, order_items, order_total):
    """
    Main function to validate and apply coupon to an order
    Returns: {
        'valid': bool,
        'errors': list,
        'discount_amount': Decimal,
        'final_total': Decimal,
        'coupon': Coupon instance,
        'no_return_policy': bool
    }
    """
    validator = CouponValidator(coupon_code, user, order_items, order_total)
    is_valid, errors, coupon = validator.validate()

    result = {
        'valid': is_valid,
        'errors': errors,
        'discount_amount': Decimal('0'),
        'final_total': Decimal(str(order_total)),
        'coupon': coupon,
        'no_return_policy': False
    }

    if is_valid and coupon:
        discount_amount, final_total = CouponCalculator.calculate_discount(
            coupon, order_total, order_items
        )
        
        result.update({
            'discount_amount': discount_amount,
            'final_total': final_total,
            'no_return_policy': coupon.no_return_policy
        })

    return result


def record_coupon_usage(coupon, user, order, discount_amount, original_order_value):
    """
    Record coupon usage for tracking and analytics
    """
    CouponUsage.objects.create(
        coupon=coupon,
        user=user,
        order=order,
        discount_amount=discount_amount,
        original_order_value=original_order_value
    )