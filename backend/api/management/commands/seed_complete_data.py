"""
Django management command to seed complete product data for Groovystreetz backend.
Includes products, variants, images, reviews, testimonials, coupons, and more.

Usage: python manage.py seed_complete_data
"""

from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.db import transaction
from django.utils import timezone
from decimal import Decimal
import random
from datetime import datetime, timedelta
import os
from PIL import Image
import io

from api.models import (
    Category, Product, ProductVariant, ProductImage, Review, Testimonial,
    Coupon, Banner, Spotlight, Address, Wishlist, RewardPoints, RewardTransaction,
    ContactMessage, Order, OrderItem, Permission, Role, UserRole
)

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed complete product data with variants, images, reviews, and more'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset existing data before creating new data',
        )
        parser.add_argument(
            '--admin-email',
            type=str,
            default='admin@groovystreetz.com',
            help='Email for admin user',
        )
        parser.add_argument(
            '--admin-password',
            type=str,
            default='admin123',
            help='Password for admin user',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('🚀 Seeding complete Groovystreetz data...'))
        
        try:
            with transaction.atomic():
                if options['reset']:
                    self.reset_data()
                
                self.create_users(options)
                self.create_categories()
                self.create_products_with_variants()
                self.create_product_images()
                self.create_reviews()
                self.create_testimonials()
                self.create_coupons()
                self.create_banners()
                self.create_spotlights()
                self.create_addresses()
                self.create_wishlists()
                self.create_reward_system()
                self.create_sample_orders()
                self.create_contact_messages()
                self.create_roles_and_permissions()
                
            self.stdout.write(self.style.SUCCESS('✅ Complete data seeding completed successfully!'))
            self.print_summary(options)
            
        except Exception as e:
            raise CommandError(f'Error seeding data: {str(e)}')

    def reset_data(self):
        """Reset existing data"""
        self.stdout.write('🔄 Resetting existing data...')
        
        # Delete in reverse order of dependencies
        OrderItem.objects.all().delete()
        Order.objects.all().delete()
        ProductImage.objects.all().delete()
        ProductVariant.objects.all().delete()
        Review.objects.all().delete()
        Testimonial.objects.all().delete()
        Coupon.objects.all().delete()
        Banner.objects.all().delete()
        Spotlight.objects.all().delete()
        Address.objects.all().delete()
        Wishlist.objects.all().delete()
        RewardTransaction.objects.all().delete()
        RewardPoints.objects.all().delete()
        ContactMessage.objects.all().delete()
        UserRole.objects.all().delete()
        Role.objects.all().delete()
        Permission.objects.all().delete()
        Product.objects.all().delete()
        Category.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()
        
        self.stdout.write('✅ Data reset completed')

    def create_users(self, options):
        """Create admin and test users"""
        self.stdout.write('👥 Creating users...')
        
        # Create superadmin user
        admin_email = options['admin_email']
        admin_password = options['admin_password']
        
        if not User.objects.filter(email=admin_email).exists():
            admin_user = User.objects.create_user(
                username='admin',
                email=admin_email,
                password=admin_password,
                first_name='Admin',
                last_name='User',
                role='superadmin',
                is_staff=True,
                is_superuser=True
            )
            self.stdout.write(f'  ✅ Created superadmin: {admin_email}')
        else:
            admin_user = User.objects.get(email=admin_email)
            admin_user.role = 'superadmin'
            admin_user.is_staff = True
            admin_user.is_superuser = True
            admin_user.save()
            self.stdout.write(f'  ✅ Updated existing admin: {admin_email}')

        # Create regular admin user
        if not User.objects.filter(email='manager@groovystreetz.com').exists():
            User.objects.create_user(
                username='manager',
                email='manager@groovystreetz.com',
                password='manager123',
                first_name='Store',
                last_name='Manager',
                role='admin',
                is_staff=True
            )
            self.stdout.write('  ✅ Created admin: manager@groovystreetz.com')

        # Create test customer users
        test_customers = [
            {
                'username': 'testcustomer1',
                'email': 'customer1@test.com',
                'password': 'test123',
                'first_name': 'John',
                'last_name': 'Doe'
            },
            {
                'username': 'testcustomer2', 
                'email': 'customer2@test.com',
                'password': 'test123',
                'first_name': 'Jane',
                'last_name': 'Smith'
            },
            {
                'username': 'testcustomer3',
                'email': 'customer3@test.com',
                'password': 'test123',
                'first_name': 'Mike',
                'last_name': 'Johnson'
            },
            {
                'username': 'testcustomer4',
                'email': 'customer4@test.com',
                'password': 'test123',
                'first_name': 'Sarah',
                'last_name': 'Wilson'
            },
            {
                'username': 'testcustomer5',
                'email': 'customer5@test.com',
                'password': 'test123',
                'first_name': 'Alex',
                'last_name': 'Brown'
            }
        ]
        
        for customer_data in test_customers:
            if not User.objects.filter(email=customer_data['email']).exists():
                User.objects.create_user(
                    username=customer_data['username'],
                    email=customer_data['email'],
                    password=customer_data['password'],
                    first_name=customer_data['first_name'],
                    last_name=customer_data['last_name'],
                    role='customer'
                )
                self.stdout.write(f'  ✅ Created customer: {customer_data["email"]}')

    def create_categories(self):
        """Create product categories"""
        self.stdout.write('📁 Creating categories...')
        
        categories_data = [
            {
                'name': 'Streetwear',
                'slug': 'streetwear'
            },
            {
                'name': 'Accessories',
                'slug': 'accessories'
            },
            {
                'name': 'Footwear',
                'slug': 'footwear'
            },
            {
                'name': 'Electronics',
                'slug': 'electronics'
            },
            {
                'name': 'Hoodies & Sweatshirts',
                'slug': 'hoodies-sweatshirts'
            },
            {
                'name': 'T-Shirts',
                'slug': 't-shirts'
            },
            {
                'name': 'Pants & Jeans',
                'slug': 'pants-jeans'
            },
            {
                'name': 'Jackets',
                'slug': 'jackets'
            }
        ]
        
        for cat_data in categories_data:
            category, created = Category.objects.get_or_create(
                name=cat_data['name'],
                defaults={'slug': cat_data['slug']}
            )
            if created:
                self.stdout.write(f'  ✅ Created category: {category.name}')

    def create_products_with_variants(self):
        """Create comprehensive products with variants"""
        self.stdout.write('🛍️ Creating products with variants...')
        
        # Get categories
        streetwear = Category.objects.get(name='Streetwear')
        accessories = Category.objects.get(name='Accessories')
        footwear = Category.objects.get(name='Footwear')
        electronics = Category.objects.get(name='Electronics')
        hoodies = Category.objects.get(name='Hoodies & Sweatshirts')
        tshirts = Category.objects.get(name='T-Shirts')
        pants = Category.objects.get(name='Pants & Jeans')
        jackets = Category.objects.get(name='Jackets')
        
        products_data = [
            # Streetwear Hoodies
            {
                'name': 'Groovy Street Hoodie',
                'description': 'Premium cotton hoodie with urban street design. Perfect for those who want to make a statement with their style.',
                'price': Decimal('79.99'),
                'category': hoodies,
                'stock': 50,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'black', 'stock': 10, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 15, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 12, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 8, 'price_modifier': 0},
                    {'size': 's', 'color': 'white', 'stock': 5, 'price_modifier': 0},
                    {'size': 'm', 'color': 'white', 'stock': 8, 'price_modifier': 0},
                    {'size': 'l', 'color': 'white', 'stock': 6, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'white', 'stock': 4, 'price_modifier': 0},
                ]
            },
            {
                'name': 'Urban Vibes Hoodie',
                'description': 'Comfortable oversized hoodie with street art graphics. Made from premium cotton blend.',
                'price': Decimal('89.99'),
                'category': hoodies,
                'stock': 40,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'navy', 'stock': 8, 'price_modifier': 0},
                    {'size': 'm', 'color': 'navy', 'stock': 12, 'price_modifier': 0},
                    {'size': 'l', 'color': 'navy', 'stock': 10, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'navy', 'stock': 6, 'price_modifier': 0},
                    {'size': 's', 'color': 'gray', 'stock': 4, 'price_modifier': 0},
                    {'size': 'm', 'color': 'gray', 'stock': 6, 'price_modifier': 0},
                    {'size': 'l', 'color': 'gray', 'stock': 5, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'gray', 'stock': 3, 'price_modifier': 0},
                ]
            },
            # T-Shirts
            {
                'name': 'Street Art Graphic Tee',
                'description': 'Comfortable cotton t-shirt with unique street art graphics. Perfect for casual wear.',
                'price': Decimal('29.99'),
                'category': tshirts,
                'stock': 100,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'black', 'stock': 20, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 25, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 20, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 15, 'price_modifier': 0},
                    {'size': 's', 'color': 'white', 'stock': 10, 'price_modifier': 0},
                    {'size': 'm', 'color': 'white', 'stock': 15, 'price_modifier': 0},
                    {'size': 'l', 'color': 'white', 'stock': 12, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'white', 'stock': 8, 'price_modifier': 0},
                ]
            },
            {
                'name': 'Vintage Band Tee',
                'description': 'Retro-inspired band t-shirt with vintage graphics. Soft cotton blend.',
                'price': Decimal('34.99'),
                'category': tshirts,
                'stock': 80,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'black', 'stock': 15, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 20, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 18, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 12, 'price_modifier': 0},
                    {'size': 's', 'color': 'maroon', 'stock': 8, 'price_modifier': 0},
                    {'size': 'm', 'color': 'maroon', 'stock': 10, 'price_modifier': 0},
                    {'size': 'l', 'color': 'maroon', 'stock': 9, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'maroon', 'stock': 6, 'price_modifier': 0},
                ]
            },
            # Pants
            {
                'name': 'Street Style Cargo Pants',
                'description': 'Comfortable cargo pants with multiple pockets. Perfect for urban adventures.',
                'price': Decimal('69.99'),
                'category': pants,
                'stock': 60,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'black', 'stock': 8, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 12, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 10, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 6, 'price_modifier': 0},
                    {'size': 's', 'color': 'olive', 'stock': 5, 'price_modifier': 0},
                    {'size': 'm', 'color': 'olive', 'stock': 8, 'price_modifier': 0},
                    {'size': 'l', 'color': 'olive', 'stock': 7, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'olive', 'stock': 4, 'price_modifier': 0},
                ]
            },
            # Jackets
            {
                'name': 'Urban Denim Jacket',
                'description': 'Classic denim jacket with modern street style. Perfect for layering.',
                'price': Decimal('99.99'),
                'category': jackets,
                'stock': 35,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'blue', 'stock': 6, 'price_modifier': 0},
                    {'size': 'm', 'color': 'blue', 'stock': 10, 'price_modifier': 0},
                    {'size': 'l', 'color': 'blue', 'stock': 8, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'blue', 'stock': 5, 'price_modifier': 0},
                    {'size': 's', 'color': 'black', 'stock': 3, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 5, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 4, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 2, 'price_modifier': 0},
                ]
            },
            # Accessories
            {
                'name': 'Street Style Snapback Cap',
                'description': 'Adjustable snapback cap with embroidered logo. Perfect for completing your street look.',
                'price': Decimal('24.99'),
                'category': accessories,
                'stock': 75,
                'gender': 'unisex',
                'variants': [
                    {'size': '', 'color': 'black', 'stock': 25, 'price_modifier': 0},
                    {'size': '', 'color': 'white', 'stock': 20, 'price_modifier': 0},
                    {'size': '', 'color': 'navy', 'stock': 15, 'price_modifier': 0},
                    {'size': '', 'color': 'red', 'stock': 15, 'price_modifier': 0},
                ]
            },
            {
                'name': 'Urban Backpack',
                'description': 'Durable backpack for urban adventures. Multiple compartments and laptop sleeve.',
                'price': Decimal('59.99'),
                'category': accessories,
                'stock': 30,
                'gender': 'unisex',
                'variants': [
                    {'size': '', 'color': 'black', 'stock': 12, 'price_modifier': 0},
                    {'size': '', 'color': 'navy', 'stock': 10, 'price_modifier': 0},
                    {'size': '', 'color': 'olive', 'stock': 8, 'price_modifier': 0},
                ]
            },
            # Footwear
            {
                'name': 'Street Runner Sneakers',
                'description': 'Comfortable sneakers for street style. Lightweight and breathable.',
                'price': Decimal('129.99'),
                'category': footwear,
                'stock': 40,
                'gender': 'unisex',
                'variants': [
                    {'size': 's', 'color': 'white', 'stock': 8, 'price_modifier': 0},
                    {'size': 'm', 'color': 'white', 'stock': 10, 'price_modifier': 0},
                    {'size': 'l', 'color': 'white', 'stock': 8, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'white', 'stock': 6, 'price_modifier': 0},
                    {'size': 's', 'color': 'black', 'stock': 4, 'price_modifier': 0},
                    {'size': 'm', 'color': 'black', 'stock': 6, 'price_modifier': 0},
                    {'size': 'l', 'color': 'black', 'stock': 5, 'price_modifier': 0},
                    {'size': 'xl', 'color': 'black', 'stock': 3, 'price_modifier': 0},
                ]
            },
            # Electronics
            {
                'name': 'Wireless Street Earbuds',
                'description': 'Premium wireless earbuds with noise cancellation. Perfect for music lovers.',
                'price': Decimal('89.99'),
                'category': electronics,
                'stock': 60,
                'gender': 'unisex',
                'variants': [
                    {'size': '', 'color': 'black', 'stock': 25, 'price_modifier': 0},
                    {'size': '', 'color': 'white', 'stock': 20, 'price_modifier': 0},
                    {'size': '', 'color': 'blue', 'stock': 15, 'price_modifier': 0},
                ]
            },
            {
                'name': 'Phone Case - Street Art',
                'description': 'Protective phone case with street art design. Compatible with all major phones.',
                'price': Decimal('19.99'),
                'category': electronics,
                'stock': 150,
                'gender': 'unisex',
                'variants': [
                    {'size': '', 'color': 'black', 'stock': 50, 'price_modifier': 0},
                    {'size': '', 'color': 'white', 'stock': 40, 'price_modifier': 0},
                    {'size': '', 'color': 'red', 'stock': 30, 'price_modifier': 0},
                    {'size': '', 'color': 'blue', 'stock': 30, 'price_modifier': 0},
                ]
            }
        ]
        
        for product_data in products_data:
            variants_data = product_data.pop('variants', [])
            
            product, created = Product.objects.get_or_create(
                name=product_data['name'],
                defaults=product_data
            )
            
            if created:
                self.stdout.write(f'  ✅ Created product: {product.name} - ${product.price}')
                
                # Create variants
                for variant_data in variants_data:
                    sku = f"{product.name.replace(' ', '').upper()[:8]}{variant_data['size'].upper() if variant_data['size'] else ''}{variant_data['color'].upper()[:3]}"
                    
                    ProductVariant.objects.create(
                        product=product,
                        size=variant_data['size'] if variant_data['size'] else '',
                        color=variant_data['color'],
                        sku=sku,
                        price_modifier=variant_data['price_modifier'],
                        stock=variant_data['stock']
                    )
                
                self.stdout.write(f'    ✅ Created {len(variants_data)} variants for {product.name}')

    def create_product_images(self):
        """Create placeholder product images"""
        self.stdout.write('📸 Creating product images...')
        
        # This would normally create actual image files
        # For now, we'll just create the database records
        products = Product.objects.all()
        
        for product in products:
            # Create 2-4 images per product
            num_images = random.randint(2, 4)
            
            for i in range(num_images):
                is_primary = i == 0
                ProductImage.objects.create(
                    product=product,
                    image=f'products/gallery/{product.name.replace(" ", "_").lower()}_{i+1}.jpg',
                    alt_text=f'{product.name} - Image {i+1}',
                    is_primary=is_primary,
                    order=i
                )
            
            # Create images for variants too
            for variant in product.variants.all():
                if random.choice([True, False]):  # 50% chance
                    ProductImage.objects.create(
                        product=product,
                        variant=variant,
                        image=f'products/gallery/{product.name.replace(" ", "_").lower()}_{variant.color}_{variant.size}.jpg',
                        alt_text=f'{product.name} - {variant.color} {variant.size}',
                        is_primary=False,
                        order=0
                    )
        
        self.stdout.write(f'  ✅ Created images for {products.count()} products')

    def create_reviews(self):
        """Create product reviews"""
        self.stdout.write('⭐ Creating product reviews...')
        
        products = Product.objects.all()
        customers = User.objects.filter(role='customer')
        
        review_templates = [
            {
                'titles': ['Great product!', 'Love it!', 'Perfect fit', 'Amazing quality', 'Highly recommend'],
                'comments': [
                    'This is exactly what I was looking for. Great quality and perfect fit!',
                    'Love the design and the material is really comfortable.',
                    'Fast shipping and the product arrived in perfect condition.',
                    'Great value for money. Will definitely order again!',
                    'The quality exceeded my expectations. Very satisfied with my purchase.',
                    'Perfect for my style. The fit is exactly as described.',
                    'Great customer service and the product is amazing.',
                    'Love the attention to detail. This is a quality product.',
                    'Fast delivery and the product looks even better in person.',
                    'Excellent quality and great design. Highly recommend!'
                ]
            }
        ]
        
        for product in products:
            # Create 3-8 reviews per product
            num_reviews = random.randint(3, 8)
            selected_customers = random.sample(list(customers), min(num_reviews, len(customers)))
            
            for customer in selected_customers:
                rating = random.randint(3, 5)  # Mostly positive reviews
                title = random.choice(review_templates[0]['titles'])
                comment = random.choice(review_templates[0]['comments'])
                
                Review.objects.create(
                    product=product,
                    user=customer,
                    rating=rating,
                    title=title,
                    comment=comment,
                    is_verified_purchase=random.choice([True, False]),
                    helpful_count=random.randint(0, 10)
                )
        
        self.stdout.write(f'  ✅ Created reviews for {products.count()} products')

    def create_testimonials(self):
        """Create customer testimonials"""
        self.stdout.write('💬 Creating testimonials...')
        
        customers = User.objects.filter(role='customer')
        
        testimonial_data = [
            {
                'content': 'GroovyStreetz has the best streetwear collection! The quality is amazing and the designs are unique.',
                'rating': 5
            },
            {
                'content': 'Fast shipping and great customer service. My order arrived exactly as described.',
                'rating': 5
            },
            {
                'content': 'Love the variety of products. From hoodies to accessories, they have everything I need.',
                'rating': 4
            },
            {
                'content': 'The fit is perfect and the material is really comfortable. Will definitely order again!',
                'rating': 5
            },
            {
                'content': 'Great prices for such high quality products. Highly recommend this store!',
                'rating': 5
            },
            {
                'content': 'The customer service team was very helpful with my order. Great experience overall.',
                'rating': 4
            },
            {
                'content': 'Love the street art designs on the t-shirts. Very unique and stylish.',
                'rating': 5
            },
            {
                'content': 'The hoodies are so comfortable and warm. Perfect for the winter season.',
                'rating': 5
            }
        ]
        
        for i, testimonial in enumerate(testimonial_data):
            if i < len(customers):
                customer = customers[i]
                Testimonial.objects.create(
                    user=customer,
                    content=testimonial['content'],
                    rating=testimonial['rating'],
                    is_approved=True,
                    is_featured=random.choice([True, False])
                )
        
        self.stdout.write(f'  ✅ Created {len(testimonial_data)} testimonials')

    def create_coupons(self):
        """Create various types of coupons"""
        self.stdout.write('🎫 Creating coupons...')
        
        admin_user = User.objects.filter(role='superadmin').first()
        
        coupon_data = [
            {
                'code': 'WELCOME10',
                'name': 'Welcome Discount',
                'description': '10% off your first order',
                'discount_type': 'percentage',
                'discount_value': Decimal('10.00'),
                'minimum_order_value': Decimal('50.00'),
                'max_uses_total': 1000,
                'max_uses_per_user': 1,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=30),
                'is_active': True
            },
            {
                'code': 'SAVE20',
                'name': '20% Off Sale',
                'description': '20% off on all streetwear items',
                'discount_type': 'percentage',
                'discount_value': Decimal('20.00'),
                'minimum_order_value': Decimal('100.00'),
                'max_uses_total': 500,
                'max_uses_per_user': 2,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=14),
                'is_active': True
            },
            {
                'code': 'FREESHIP',
                'name': 'Free Shipping',
                'description': 'Free shipping on orders over $75',
                'discount_type': 'free_shipping',
                'discount_value': Decimal('0.00'),
                'minimum_order_value': Decimal('75.00'),
                'max_uses_total': 1000,
                'max_uses_per_user': 5,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=60),
                'is_active': True
            },
            {
                'code': 'FLAT15',
                'name': 'Flat $15 Off',
                'description': '$15 off on orders over $100',
                'discount_type': 'fixed',
                'discount_value': Decimal('15.00'),
                'minimum_order_value': Decimal('100.00'),
                'max_uses_total': 200,
                'max_uses_per_user': 1,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=7),
                'is_active': True
            },
            {
                'code': 'VIP30',
                'name': 'VIP Customer Discount',
                'description': '30% off for VIP customers',
                'discount_type': 'percentage',
                'discount_value': Decimal('30.00'),
                'minimum_order_value': Decimal('150.00'),
                'max_uses_total': 50,
                'max_uses_per_user': 1,
                'valid_from': timezone.now(),
                'valid_until': timezone.now() + timedelta(days=90),
                'is_active': True,
                'no_return_policy': True
            }
        ]
        
        for coupon_info in coupon_data:
            coupon = Coupon.objects.create(
                code=coupon_info['code'],
                name=coupon_info['name'],
                description=coupon_info['description'],
                discount_type=coupon_info['discount_type'],
                discount_value=coupon_info['discount_value'],
                minimum_order_value=coupon_info['minimum_order_value'],
                max_uses_total=coupon_info['max_uses_total'],
                max_uses_per_user=coupon_info['max_uses_per_user'],
                valid_from=coupon_info['valid_from'],
                valid_until=coupon_info['valid_until'],
                is_active=coupon_info['is_active'],
                no_return_policy=coupon_info.get('no_return_policy', False),
                created_by=admin_user
            )
            
            # Assign to specific categories or products
            if coupon_info['code'] == 'SAVE20':
                streetwear_cat = Category.objects.get(name='Streetwear')
                coupon.categories.add(streetwear_cat)
            
            self.stdout.write(f'  ✅ Created coupon: {coupon.code} - {coupon.name}')

    def create_banners(self):
        """Create homepage banners"""
        self.stdout.write('🎨 Creating banners...')
        
        banner_data = [
            {
                'title': 'New Collection Drop',
                'subtitle': 'Fresh streetwear styles just arrived',
                'banner_type': 'hero',
                'link_url': '/products?category=streetwear',
                'link_text': 'Shop Now',
                'is_active': True,
                'order': 1
            },
            {
                'title': '20% Off All Hoodies',
                'subtitle': 'Limited time offer on our best hoodies',
                'banner_type': 'promotion',
                'link_url': '/products?category=hoodies-sweatshirts',
                'link_text': 'Get Yours',
                'is_active': True,
                'order': 2
            },
            {
                'title': 'Free Shipping',
                'subtitle': 'On orders over $75',
                'banner_type': 'promotion',
                'link_url': '/shipping-info',
                'link_text': 'Learn More',
                'is_active': True,
                'order': 3
            }
        ]
        
        for banner_info in banner_data:
            Banner.objects.create(
                title=banner_info['title'],
                subtitle=banner_info['subtitle'],
                image=f'banners/{banner_info["title"].replace(" ", "_").lower()}.jpg',
                banner_type=banner_info['banner_type'],
                link_url=banner_info['link_url'],
                link_text=banner_info['link_text'],
                is_active=banner_info['is_active'],
                order=banner_info['order']
            )
        
        self.stdout.write(f'  ✅ Created {len(banner_data)} banners')

    def create_spotlights(self):
        """Create spotlight products and categories"""
        self.stdout.write('✨ Creating spotlights...')
        
        # Get some products and categories
        featured_products = Product.objects.all()[:4]
        categories = Category.objects.all()[:3]
        
        spotlight_data = [
            {
                'title': 'Trending Now',
                'description': 'Check out our most popular items',
                'spotlight_type': 'product',
                'product': featured_products[0] if featured_products else None,
                'is_active': True,
                'order': 1
            },
            {
                'title': 'Streetwear Collection',
                'description': 'Discover our latest streetwear styles',
                'spotlight_type': 'category',
                'category': categories[0] if categories else None,
                'is_active': True,
                'order': 2
            },
            {
                'title': 'New Arrivals',
                'description': 'Fresh styles just added to our collection',
                'spotlight_type': 'collection',
                'is_active': True,
                'order': 3
            }
        ]
        
        for spotlight_info in spotlight_data:
            Spotlight.objects.create(
                title=spotlight_info['title'],
                description=spotlight_info['description'],
                spotlight_type=spotlight_info['spotlight_type'],
                product=spotlight_info.get('product'),
                category=spotlight_info.get('category'),
                image=f'spotlight/{spotlight_info["title"].replace(" ", "_").lower()}.jpg',
                is_active=spotlight_info['is_active'],
                order=spotlight_info['order']
            )
        
        self.stdout.write(f'  ✅ Created {len(spotlight_data)} spotlights')

    def create_addresses(self):
        """Create sample addresses for customers"""
        self.stdout.write('🏠 Creating addresses...')
        
        customers = User.objects.filter(role='customer')
        
        address_data = [
            {
                'address_line_1': '123 Main Street',
                'address_line_2': 'Apt 4B',
                'city': 'New York',
                'state': 'NY',
                'postal_code': '10001',
                'country': 'USA',
                'is_default': True
            },
            {
                'address_line_1': '456 Oak Avenue',
                'address_line_2': '',
                'city': 'Los Angeles',
                'state': 'CA',
                'postal_code': '90210',
                'country': 'USA',
                'is_default': False
            },
            {
                'address_line_1': '789 Pine Street',
                'address_line_2': 'Unit 12',
                'city': 'Chicago',
                'state': 'IL',
                'postal_code': '60601',
                'country': 'USA',
                'is_default': True
            }
        ]
        
        for i, customer in enumerate(customers):
            if i < len(address_data):
                Address.objects.create(
                    user=customer,
                    **address_data[i]
                )
        
        self.stdout.write(f'  ✅ Created addresses for {min(len(customers), len(address_data))} customers')

    def create_wishlists(self):
        """Create wishlists for customers"""
        self.stdout.write('❤️ Creating wishlists...')
        
        customers = User.objects.filter(role='customer')
        products = Product.objects.all()
        
        for customer in customers:
            wishlist, created = Wishlist.objects.get_or_create(user=customer)
            if created:
                # Add 2-5 random products to wishlist
                num_products = random.randint(2, 5)
                random_products = random.sample(list(products), min(num_products, len(products)))
                wishlist.products.set(random_products)
        
        self.stdout.write(f'  ✅ Created wishlists for {customers.count()} customers')

    def create_reward_system(self):
        """Create reward points for customers"""
        self.stdout.write('🎁 Creating reward system...')
        
        customers = User.objects.filter(role='customer')
        
        for customer in customers:
            # Create reward points account
            reward_points, created = RewardPoints.objects.get_or_create(user=customer)
            if created:
                # Give some initial points
                initial_points = random.randint(50, 200)
                reward_points.total_points = initial_points
                reward_points.save()
                
                # Create initial transaction
                RewardTransaction.objects.create(
                    user=customer,
                    transaction_type='bonus',
                    points=initial_points,
                    description='Welcome bonus points'
                )
        
        self.stdout.write(f'  ✅ Created reward accounts for {customers.count()} customers')

    def create_sample_orders(self):
        """Create sample orders with items"""
        self.stdout.write('📦 Creating sample orders...')
        
        customers = User.objects.filter(role='customer')
        products = Product.objects.all()
        
        for i, customer in enumerate(customers):
            if i < 3:  # Create orders for first 3 customers
                # Create order
                order = Order.objects.create(
                    user=customer,
                    shipping_address=f'{customer.first_name} {customer.last_name}\n123 Street Ave\nCity, State 12345',
                    original_price=Decimal('0.00'),
                    discount_amount=Decimal('0.00'),
                    total_price=Decimal('0.00'),
                    status=random.choice(['pending', 'shipped', 'delivered'])
                )
                
                # Add 1-3 random products to order
                num_items = random.randint(1, 3)
                random_products = random.sample(list(products), min(num_items, len(products)))
                
                total_price = Decimal('0.00')
                for product in random_products:
                    quantity = random.randint(1, 2)
                    item_price = product.price * quantity
                    total_price += item_price
                    
                    # Get a random variant if available
                    variant = None
                    if product.variants.exists():
                        variant = random.choice(list(product.variants.all()))
                    
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        variant=variant,
                        quantity=quantity,
                        price=product.price
                    )
                
                # Update order totals
                order.original_price = total_price
                order.total_price = total_price
                order.save()
                
                self.stdout.write(f'  ✅ Created order for {customer.email} - ${order.total_price}')

    def create_contact_messages(self):
        """Create sample contact messages"""
        self.stdout.write('📧 Creating contact messages...')
        
        contact_data = [
            {
                'name': 'John Smith',
                'email': 'john.smith@email.com',
                'phone': '555-0123',
                'subject': 'order',
                'message': 'I have a question about my recent order #12345. When will it be shipped?',
                'is_resolved': False
            },
            {
                'name': 'Sarah Johnson',
                'email': 'sarah.j@email.com',
                'phone': '555-0456',
                'subject': 'product',
                'message': 'Do you have this hoodie in size XL? I really love the design!',
                'is_resolved': True
            },
            {
                'name': 'Mike Davis',
                'email': 'mike.davis@email.com',
                'phone': '555-0789',
                'subject': 'shipping',
                'message': 'My package was delivered to the wrong address. Can you help?',
                'is_resolved': False
            }
        ]
        
        for contact_info in contact_data:
            ContactMessage.objects.create(**contact_info)
        
        self.stdout.write(f'  ✅ Created {len(contact_data)} contact messages')

    def create_roles_and_permissions(self):
        """Create roles and permissions system"""
        self.stdout.write('🔐 Creating roles and permissions...')
        
        # Create permissions
        permission_data = [
            {'name': 'View Users', 'codename': 'view_users', 'permission_type': 'read', 'resource_type': 'users'},
            {'name': 'Manage Users', 'codename': 'manage_users', 'permission_type': 'manage', 'resource_type': 'users'},
            {'name': 'View Products', 'codename': 'view_products', 'permission_type': 'read', 'resource_type': 'products'},
            {'name': 'Manage Products', 'codename': 'manage_products', 'permission_type': 'manage', 'resource_type': 'products'},
            {'name': 'View Orders', 'codename': 'view_orders', 'permission_type': 'read', 'resource_type': 'orders'},
            {'name': 'Manage Orders', 'codename': 'manage_orders', 'permission_type': 'manage', 'resource_type': 'orders'},
            {'name': 'View Coupons', 'codename': 'view_coupons', 'permission_type': 'read', 'resource_type': 'coupons'},
            {'name': 'Manage Coupons', 'codename': 'manage_coupons', 'permission_type': 'manage', 'resource_type': 'coupons'},
        ]
        
        for perm_info in permission_data:
            Permission.objects.get_or_create(
                codename=perm_info['codename'],
                defaults=perm_info
            )
        
        # Create roles
        role_data = [
            {
                'name': 'Store Manager',
                'description': 'Can manage products, orders, and customers',
                'permissions': ['view_users', 'manage_users', 'view_products', 'manage_products', 'view_orders', 'manage_orders']
            },
            {
                'name': 'Content Manager',
                'description': 'Can manage products and content',
                'permissions': ['view_products', 'manage_products', 'view_coupons', 'manage_coupons']
            }
        ]
        
        for role_info in role_data:
            role, created = Role.objects.get_or_create(
                name=role_info['name'],
                defaults={'description': role_info['description']}
            )
            if created:
                # Assign permissions to role
                for perm_codename in role_info['permissions']:
                    try:
                        permission = Permission.objects.get(codename=perm_codename)
                        role.permissions.add(permission)
                    except Permission.DoesNotExist:
                        pass
                
                self.stdout.write(f'  ✅ Created role: {role.name}')
        
        self.stdout.write(f'  ✅ Created roles and permissions system')

    def print_summary(self, options):
        """Print comprehensive setup summary"""
        self.stdout.write('\n' + '='*60)
        self.stdout.write(self.style.SUCCESS('🎉 GROOVYSTREETZ COMPLETE DATA SEEDING COMPLETE'))
        self.stdout.write('='*60)
        
        # User counts
        total_users = User.objects.count()
        superadmins = User.objects.filter(role='superadmin').count()
        admins = User.objects.filter(role='admin').count()
        customers = User.objects.filter(role='customer').count()
        
        self.stdout.write(f'👥 Users Created: {total_users} total')
        self.stdout.write(f'   - Superadmins: {superadmins}')
        self.stdout.write(f'   - Admins: {admins}')
        self.stdout.write(f'   - Customers: {customers}')
        
        # Product counts
        categories = Category.objects.count()
        products = Product.objects.count()
        variants = ProductVariant.objects.count()
        images = ProductImage.objects.count()
        reviews = Review.objects.count()
        
        self.stdout.write(f'🛍️ Products: {products} products with {variants} variants')
        self.stdout.write(f'   - Categories: {categories}')
        self.stdout.write(f'   - Images: {images}')
        self.stdout.write(f'   - Reviews: {reviews}')
        
        # E-commerce features
        testimonials = Testimonial.objects.count()
        coupons = Coupon.objects.count()
        banners = Banner.objects.count()
        spotlights = Spotlight.objects.count()
        addresses = Address.objects.count()
        wishlists = Wishlist.objects.count()
        orders = Order.objects.count()
        order_items = OrderItem.objects.count()
        contact_messages = ContactMessage.objects.count()
        
        self.stdout.write(f'🎨 Content & Marketing:')
        self.stdout.write(f'   - Testimonials: {testimonials}')
        self.stdout.write(f'   - Coupons: {coupons}')
        self.stdout.write(f'   - Banners: {banners}')
        self.stdout.write(f'   - Spotlights: {spotlights}')
        
        self.stdout.write(f'📦 Orders & Customer Data:')
        self.stdout.write(f'   - Orders: {orders} with {order_items} items')
        self.stdout.write(f'   - Addresses: {addresses}')
        self.stdout.write(f'   - Wishlists: {wishlists}')
        self.stdout.write(f'   - Contact Messages: {contact_messages}')
        
        # Login credentials
        self.stdout.write('\n🔑 LOGIN CREDENTIALS:')
        self.stdout.write(f'   Superadmin: {options["admin_email"]} / {options["admin_password"]}')
        self.stdout.write('   Admin: manager@groovystreetz.com / manager123')
        self.stdout.write('   Customer: customer1@test.com / test123')
        self.stdout.write('   Customer: customer2@test.com / test123')
        self.stdout.write('   Customer: customer3@test.com / test123')
        self.stdout.write('   Customer: customer4@test.com / test123')
        self.stdout.write('   Customer: customer5@test.com / test123')
        
        # Available features
        self.stdout.write('\n✨ AVAILABLE FEATURES:')
        self.stdout.write('   ✅ Product variants (sizes, colors, SKUs)')
        self.stdout.write('   ✅ Multiple product images')
        self.stdout.write('   ✅ Customer reviews and ratings')
        self.stdout.write('   ✅ Customer testimonials')
        self.stdout.write('   ✅ Coupon system (percentage, fixed, free shipping)')
        self.stdout.write('   ✅ Homepage banners and spotlights')
        self.stdout.write('   ✅ Customer addresses and wishlists')
        self.stdout.write('   ✅ Reward points system')
        self.stdout.write('   ✅ Sample orders with order items')
        self.stdout.write('   ✅ Contact message system')
        self.stdout.write('   ✅ Role-based permissions')
        
        # Testing info
        self.stdout.write('\n🧪 TESTING:')
        self.stdout.write('   Run: python simple_api_test.py')
        self.stdout.write('   All endpoints should now work with comprehensive data')
        self.stdout.write('   Test product variants, reviews, coupons, and more!')
        
        self.stdout.write('\n' + '='*60)