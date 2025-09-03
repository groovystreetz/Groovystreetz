# Advanced Features Documentation

## Product Variants & Multiple Images System

### Overview
The platform now supports complex product variants (like different colors, sizes) with dedicated images for each variant.

### Product Variants
Each product can have multiple variants with:
- **Name**: Descriptive name (e.g., "Red - Large", "Blue - Medium")
- **SKU**: Unique stock keeping unit
- **Price Modifier**: Additional cost for this variant (can be negative for discounts)
- **Stock**: Variant-specific inventory
- **Status**: Active/inactive variants

### Multiple Images
- Products can have multiple images
- Images can be variant-specific or general product images
- Primary image designation for main product display
- Ordering system for image sequence
- Alt text for accessibility

### Example Use Case
**Product**: Cotton T-Shirt (Base Price: ₹299)
- **Variant 1**: Red - Small (Price: ₹299, Stock: 25)
  - Images: red-front.jpg, red-back.jpg, red-detail.jpg
- **Variant 2**: Blue - Large (Price: ₹329, Stock: 15) 
  - Images: blue-front.jpg, blue-back.jpg, blue-detail.jpg
- **Variant 3**: Premium Black - Medium (Price: ₹399, Stock: 10)
  - Images: black-premium-front.jpg, black-premium-back.jpg

## Review & Rating System

### Features
- **5-Star Rating System**: Users rate products 1-5 stars
- **Verified Purchases**: System automatically detects if reviewer purchased the product
- **Helpful Voting**: Other users can mark reviews as helpful
- **Admin Moderation**: Reviews can be approved/disapproved by admins
- **Review Titles**: Optional titles for reviews
- **Detailed Comments**: Full text reviews

### Review Validation
- Users can only review products they've purchased
- One review per user per product
- Admin approval workflow for quality control

### Display Logic
- Average rating calculation
- Review count display
- Sorting by helpfulness, date, rating
- Verified purchase badges

## Reward Points System

### Point Earning
- **Purchase Rewards**: 5-10 points per product purchased
- **Bonus Points**: Special promotions and bonuses
- **Activity Rewards**: Points for reviews, referrals, etc.

### Point Redemption
- **Minimum Redemption**: 1000 points required
- **Conversion Rate**: 1000 points = ₹1000 coupon
- **Auto Coupon Creation**: System automatically creates user-specific coupons
- **Coupon Restrictions**: 30-day validity, single use, user-specific

### Transaction Tracking
- Complete audit trail of all point transactions
- Transaction types: earn, redeem, expire, bonus
- Order association for purchase-based points
- Description field for transaction context

### Example Flow
1. User purchases ₹500 worth of products
2. System awards 50 points (10 points per ₹100)
3. User accumulates 1500 points over time
4. User redeems 1000 points
5. System creates coupon "REWARD123" worth ₹1000
6. User has 500 points remaining

## Testimonials System

### Customer Testimonials
- Users can submit testimonials about their experience
- Include rating (1-5 stars) and detailed feedback
- Admin approval workflow
- Featured testimonials for homepage display

### Admin Management
- Approve/disapprove testimonials
- Feature testimonials on homepage
- Edit testimonial content if needed
- Analytics on testimonial submissions

## Contact Management System

### Contact Categories
- **General Inquiry**: Basic questions
- **Order Issues**: Order-related problems
- **Product Questions**: Product information requests
- **Shipping Issues**: Delivery problems
- **Returns/Refunds**: Return policy questions
- **Technical Support**: Website/app issues
- **Other**: Miscellaneous contacts

### Admin Workflow
- View all contact messages
- Filter by resolved/unresolved status
- Assign resolution to admin users
- Mark messages as resolved with timestamp
- Track response times and resolution rates

## Homepage Content Management

### Banner System
- **Banner Types**: Hero, Promotional, Category-specific
- **Scheduling**: Start/end dates for automatic display
- **Ordering**: Display order control
- **Links**: Call-to-action buttons with custom URLs
- **Responsive Images**: Optimized for different screen sizes

### Spotlight Content
- **Content Types**: Featured products, categories, collections
- **Dynamic Display**: Automatically rotates content
- **Admin Control**: Full CRUD operations
- **Analytics**: Track click-through rates

### New Arrivals
- **Auto Detection**: Products from last 30 days
- **Manual Curation**: Admin can feature specific products
- **Filtering**: Category-specific new arrivals
- **Sorting**: Most recent first

## Multiple Address Management

### Address Features
- Users can save multiple delivery addresses
- One address marked as default for quick checkout
- Address validation and formatting
- Edit/delete operations
- Address book management

### Default Address Logic
- When user sets new default, previous default is automatically unset
- Smart default selection during checkout
- Validation prevents deletion of last remaining address

### Address Components
- **Line 1 & 2**: Street address
- **City, State, Postal Code**: Location details
- **Country**: International support
- **Default Flag**: Primary address designation

## Enhanced User Profile

### Profile Information
- **Basic Details**: Name, email, phone
- **Contact Preferences**: Communication settings
- **Address Book**: Multiple saved addresses
- **Order History**: Complete purchase history
- **Reward Points**: Current balance and history
- **Reviews**: User's product reviews
- **Wishlists**: Saved products

### Admin Support Features
- Admins can update user contact information
- Support for customer service scenarios
- Audit trail of admin changes
- Emergency contact updates

## Multi-Category Filtering

### Advanced Product Filtering
- **Multiple Categories**: Filter by comma-separated category slugs
- **Price Range**: Min/max price filtering
- **Search Terms**: Text search across product names/descriptions
- **New Arrivals**: Toggle for recent products
- **Stock Status**: In-stock/out-of-stock filtering
- **Rating Filter**: Filter by average rating
- **Sorting Options**: Price, popularity, rating, date

### Example Filters
```
/api/enhanced-products/?categories=tshirts,hoodies&min_price=100&max_price=500&search=cotton&new_arrivals=true
```

### Search Algorithm
- Full-text search across product names and descriptions
- Category-based filtering with OR logic
- Price range with inclusive bounds
- Combination filtering with AND logic between different filter types

## Analytics & Reporting

### Sales Analytics
- Revenue tracking by period
- Product performance metrics
- Customer behavior analysis
- Order fulfillment statistics

### Coupon Analytics
- Usage rates by coupon type
- Most popular coupons
- Discount impact on sales
- Customer acquisition via coupons

### User Engagement
- Review submission rates
- Testimonial participation
- Contact form usage patterns
- Reward point redemption rates

## Performance Optimizations

### Database Optimizations
- **Prefetch Related**: Optimized queries for related objects
- **Select Related**: Reduced database hits
- **Database Indexes**: Strategic indexing for common queries
- **Query Optimization**: Efficient filtering and pagination

### Caching Strategy
- **Query Caching**: Frequently accessed data
- **Image Caching**: CDN integration for product images
- **Session Caching**: User-specific data caching
- **API Response Caching**: Common endpoint responses

### Image Handling
- **Multiple Sizes**: Automatic thumbnail generation
- **Compression**: Optimized file sizes
- **Format Support**: JPEG, PNG, WebP
- **Lazy Loading**: Frontend optimization support