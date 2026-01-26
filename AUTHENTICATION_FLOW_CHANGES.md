# Authentication Flow Changes - Summary

## Changes Made

### 1. **User Model Updated** ✅
- Added `name` and `phoneNumber` fields to User schema
- Location: `server/models/User.js`

### 2. **OTP Model Updated** ✅
- Added `isSignup` and `signupData` fields to store signup information
- Location: `server/models/OTP.js`

### 3. **Backend Auth Routes Updated** ✅
- **`/api/auth/send-otp`**: 
  - Now accepts `is_signup`, `name`, `phoneNumber` parameters
  - Checks if user exists during signup and returns error if user already registered
  - Stores signup data in OTP document
- **`/api/auth/verify-otp`**:
  - Uses signup data from OTP to create user with name and phone
  - Updates existing user's name/phone if provided during signup
- Location: `server/routes/auth.js`

### 4. **Signup Component Created** ✅
- New component: `components/auth/SignupAuth.tsx`
- Collects: Name, Phone Number, Email
- Sends OTP for verification
- Creates user after OTP verification
- Shows error if user already exists: "User already registered. Please login instead."

### 5. **Auth Modal Component Created** ✅
- New component: `components/auth/AuthModal.tsx`
- Switches between Login and Signup modes
- Used in MarketingStudio and PhotoStudio

### 6. **UserLoginPage Updated** ✅
- Now supports both Login and Signup
- Switches between modes
- Shows "Sign Up" link on login page
- Location: `components/pages/UserLoginPage.tsx`

### 7. **MarketingStudio Updated** ✅
- Shows "LOG IN TO GENERATE" button when user is not authenticated
- Opens AuthModal when clicked
- Only allows generation when authenticated
- Location: `components/MarketingStudio.tsx`

### 8. **PhotoStudio Updated** ✅
- Shows "LOG IN TO GENERATE" button when user is not authenticated
- Applies to all generate buttons:
  - "Generate Photoshoot" button
  - "Confirm" button (after product identification)
  - "Continue" button (for manual product entry)
- Opens AuthModal when clicked
- Only allows generation when authenticated
- Location: `components/PhotoStudio.tsx`

### 9. **Public Routes Updated** ✅
- Removed `ProtectedRoute` from public routes:
  - `/` (Landing Page)
  - `/pricing`
  - `/workflow`
  - `/contact`
  - `/book-demo`
  - `/studio`
- Users can now view these pages without authentication
- Generation actions require authentication
- Location: `App.tsx`

## New Flow

### For Unauthenticated Users:
1. ✅ Can browse website
2. ✅ Can view pricing, workflow, contact pages
3. ✅ Can access Photo Studio and Marketing Studio
4. ✅ Can upload images and configure settings
5. ❌ **Cannot generate** - sees "LOG IN TO GENERATE" button
6. ✅ Clicks button → AuthModal opens
7. ✅ Can choose Login or Signup

### Signup Flow:
1. User clicks "Sign Up" or "LOG IN TO GENERATE"
2. Enters: Name, Phone Number, Email
3. Clicks "Send OTP"
4. Backend checks if user exists → Shows error if exists
5. Receives OTP via email
6. Enters OTP
7. User created with name, phone, email
8. JWT token generated and stored
9. User can now generate images

### Login Flow:
1. User clicks "Sign In" or "LOG IN TO GENERATE"
2. Enters Email
3. Clicks "Send OTP"
4. Receives OTP via email
5. Enters OTP
6. JWT token generated and stored
7. User can now generate images

## UI Changes

### "LOG IN TO GENERATE" Button:
- **Style**: Gradient from orange to pink
- **Icon**: User icon
- **Text**: "LOG IN TO GENERATE"
- **Location**: 
  - MarketingStudio: Below extra details field
  - PhotoStudio: 
    - In DetailsStep (main generate button)
    - After product identification (Confirm button)
    - For manual entry (Continue button)

### Auth Modal:
- Full-screen overlay
- Supports both Login and Signup
- Switches between modes
- Closes after successful authentication

## Testing Checklist

- [ ] Unauthenticated user can view website
- [ ] Unauthenticated user sees "LOG IN TO GENERATE" button
- [ ] Clicking button opens auth modal
- [ ] Signup flow works (name, phone, email, OTP)
- [ ] Login flow works (email, OTP)
- [ ] Existing user signup shows error message
- [ ] After login/signup, user can generate images
- [ ] Credits are fetched after authentication
- [ ] All generate buttons check authentication

## Files Modified

1. `server/models/User.js` - Added name, phoneNumber
2. `server/models/OTP.js` - Added isSignup, signupData
3. `server/routes/auth.js` - Updated send-otp and verify-otp
4. `components/auth/SignupAuth.tsx` - New component
5. `components/auth/AuthModal.tsx` - New component
6. `components/auth/EmailOTPAuth.tsx` - Updated error handling
7. `components/pages/UserLoginPage.tsx` - Added signup support
8. `components/MarketingStudio.tsx` - Added auth check and button
9. `components/PhotoStudio.tsx` - Added auth check and buttons
10. `App.tsx` - Removed ProtectedRoute from public routes

## Next Steps

1. Test the complete flow
2. Verify error messages
3. Test existing user signup error
4. Verify all generate buttons work after auth
5. Check credits are fetched correctly
