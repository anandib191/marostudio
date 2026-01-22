# Database Collections Structure

This document describes the MongoDB collections used in the NextGenPhoto application.

## Collections Overview

### 1. **users** (User Model)
**Purpose**: Stores user accounts, authentication, credits, and subscription information.

**Schema**:
```javascript
{
  email: String (required, unique, lowercase, trimmed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  isVerified: Boolean (default: false),
  photoshootCredits: Number (default: 3, min: 0),
  marketingPosterCredits: Number (default: 5, min: 0),
  subscriptionPlan: String (default: null), // 'Silver', 'Gold', 'Platinum', or null
  subscriptionExpiresAt: Date (default: null),
  createdAt: Date (auto),
  updatedAt: Date (auto),
  lastLogin: Date
}
```

**Indexes**:
- `email` (unique index, automatically created)

**Credit Defaults**:
- Free users: 3 photoshoot credits, 5 marketing poster credits
- Silver plan: 5 photoshoot credits, 10 marketing poster credits
- Gold plan: 10 photoshoot credits, 20 marketing poster credits
- Platinum plan: 20 photoshoot credits, 50 marketing poster credits

**Important Notes**:
- Plan names should be capitalized (e.g., "Silver", not "silver")
- Credits are set when a plan is purchased, not added
- Expired subscriptions should be reset to free tier credits

---

### 2. **otps** (OTP Model)
**Purpose**: Stores one-time passwords for email authentication.

**Schema**:
```javascript
{
  email: String (required, lowercase, trimmed),
  otp: String (required),
  isAdmin: Boolean (default: false),
  expiresAt: Date (required),
  createdAt: Date (auto)
}
```

**Indexes**:
- `email` (for quick lookup)
- `expiresAt` (TTL index for automatic cleanup)

**Lifecycle**:
- OTPs expire after a set time (typically 10 minutes)
- OTPs are deleted after successful verification
- TTL index automatically removes expired OTPs

---

### 3. **priceplans** (PricePlan Model)
**Purpose**: Stores pricing plan configurations.

**Schema**:
```javascript
{
  name: String (required), // 'Silver', 'Gold', 'Platinum'
  price: String (required), // Monthly price
  yearlyPrice: String (required), // Yearly price
  description: String (default: ''),
  features: [String], // Array of feature strings
  isPopular: Boolean (default: false),
  photoshootCredits: Number (default: 0, min: 0),
  marketingPosterCredits: Number (default: 0, min: 0),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

**Constraints**:
- Only one plan can have `isPopular: true` at a time (enforced by pre-save hook)
- Plan names should be capitalized consistently

**Default Plans**:
- **Silver**: $49/month, $40/year - 5 photoshoot, 10 marketing credits
- **Gold**: $59/month, $47/year - 10 photoshoot, 20 marketing credits
- **Platinum**: $68/month, $54/year - 20 photoshoot, 50 marketing credits

---

### 4. **stats** (Stats Model)
**Purpose**: Stores application-wide statistics.

**Schema**:
```javascript
{
  totalGenerations: Number (default: 0),
  totalUsers: Number (default: 0),
  totalRevenue: Number (default: 0),
  updatedAt: Date (auto)
}
```

**Usage**:
- Single document collection (only one stats document exists)
- Updated by admin dashboard or automated processes

---

### 5. **priceplanconfigs** (PricePlanConfig Model - Legacy)
**Purpose**: Legacy model for storing plans as an array in a single document.

**Status**: Deprecated - Use `priceplans` collection instead.

**Migration**: Use `migrate-price-plans.js` script to migrate data.

---

## Database Management Scripts

### Available Scripts

1. **`create-admin.js`**
   - Creates admin users in the database
   - Usage: `npm run create-admin`

2. **`sync-user-credits.js`**
   - Syncs user credits based on their subscription plans
   - Fixes credits for users with active subscriptions
   - Resets expired subscriptions to free tier
   - Usage: `npm run sync-credits`

3. **`migrate-price-plans.js`**
   - Migrates plans from old PricePlanConfig to new PricePlan collection
   - Usage: `npm run migrate-price-plans`

### Admin API Endpoints

- **POST `/api/admin/sync-credits`** (Admin only)
  - Manually trigger credit sync for all users
  - Returns statistics about updated/skipped users

---

## Best Practices

1. **Plan Name Consistency**: Always use capitalized plan names ("Silver", "Gold", "Platinum")

2. **Credit Management**:
   - Credits are SET (not added) when a plan is purchased
   - Always sync credits after plan changes
   - Expired subscriptions should reset to free tier

3. **Case Sensitivity**: 
   - Plan names in database should match exactly
   - Use case-insensitive lookup when querying plans

4. **Data Integrity**:
   - Run `sync-credits` script after plan updates
   - Verify credits match plans after payment processing
   - Monitor for expired subscriptions

5. **Indexes**:
   - Email indexes are automatically created
   - Consider adding indexes for `subscriptionPlan` and `subscriptionExpiresAt` for faster queries

---

## Common Issues & Solutions

### Issue: Credits not updating after purchase
**Solution**: 
1. Check if plan name matches exactly (case-sensitive)
2. Run `npm run sync-credits` to fix existing users
3. Verify plan has credits set in `priceplans` collection

### Issue: Credits reset to free tier on login
**Solution**: Fixed in auth route - only sets free credits if user has no subscription plan

### Issue: Plan name case mismatch
**Solution**: Payment route now normalizes plan names to capitalized format

---

## Future Improvements

1. Add indexes for `subscriptionPlan` and `subscriptionExpiresAt`
2. Create automated job to reset expired subscriptions
3. Add subscription renewal logic
4. Create audit log for credit changes
5. Add subscription history collection
