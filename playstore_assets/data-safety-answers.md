# Play Store Data Safety — Fill Answers for Line Free India

Use this when filling Play Console → Policy → Data Safety

## 1. Does your app collect or share any user data? YES

## 2. Data collected:

- **Location** (Approximate + Precise)
  - Purpose: App functionality — show nearby salons/clinics
  - Collected: Yes, optional (user grants permission)
  - Shared: No (only Firebase)
  - Encrypted in transit: Yes
  - User can delete/request deletion: Yes

- **Photos / Camera**
  - Purpose: App functionality — profile photo, business gallery
  - Collected: Yes
  - Uploaded to: Cloudinary / Firebase Storage (if configured)
  - Encrypted: Yes

- **Name, Email, Phone**
  - Purpose: Account, authentication (Firebase Auth), booking
  - Collected: Yes (Google Sign-In)
  - Encrypted: Yes

- **App interactions / Queue data**
  - Purpose: App functionality, analytics
  - Stored in: Firestore

## 3. Permissions declared in Manifest:
- ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION → nearby
- CAMERA → profile/gallery
- POST_NOTIFICATIONS → token updates
- INTERNET, VIBRATE → core

## 4. Is data encrypted in transit? YES (Firebase HTTPS)

## 5. Can users request deletion? YES
 - In-app: Delete Account (`/delete-account`) clears all data
 - Email: support@linefreeindia.com

## 6. Do you use AD_ID? NO
 - We removed AD_ID permission: <uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove" />

## 7. SDKs:
 - Firebase Auth, Firestore, Storage, Messaging
 - Google Sign-In
 - Leaflet / OSM for maps (no tracking)

## 8. Privacy Policy URL:
 - Host your PrivacyPolicy page: https://linefreeindia.com/privacy-policy
 - Also terms: /terms, refund: /refund-policy, delete: /delete-account

Copy these answers into Play Console form.
