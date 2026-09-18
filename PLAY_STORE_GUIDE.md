# 📱 Line Free India — Play Store pe Deploy Guide (Hinglish)

> Bro, tera web app pura Play Store ready hai! Bas neeche ke steps follow kar, 15-20 min me live hoga.

---

## ✅ Kya Ready Hai?

- ✅ **Capacitor Android** project (`android/` folder) — version **1.0.1 (code 2)**
- ✅ **Package:** `com.linefreeindia.app` (unique, Play Store compatible)
- ✅ **Google Services** (`google-services.json`) linked
- ✅ **Permissions** sahi — Internet, Location, Camera, Notifications, Vibrate
- ✅ **Icons** naye branded LF icons (512, 384, 192) + adaptive mipmap
- ✅ **Splash screens** branded dark gradient (all densities)
- ✅ **Back button** handling, StatusBar, Push, Google Auth native
- ✅ **Signed AAB** build system ready (`bundleRelease` → Play Store)

---

## 🚀 Fastest Way — Local Build (Recommended)

### 1. Requirement (ek baar)
- **Node.js 20+** + npm
- **Android Studio** (includes SDK + JDK 17)
- Ek baar Android Studio kholo → SDK Manager → Android SDK installed verify karo

### 2. Build Steps

```bash
# 1. Clone & install
git clone <your-repo>
cd Line-Free-India-V2
npm install --legacy-peer-deps

# 2. Web build + sync to native
npm run build
npx cap sync android

# 3. Keystore generate (FIRST TIME ONLY - Play Store upload key)
# Ye file sabse important hai — backup karke rakhna!
bash scripts/generate-keystore.sh
# → poochega password, alias → android/linefree-release.keystore + android/keystore.properties banega

# 4. Version bump (har release se pehle)
node scripts/playstore-prepare.mjs
# → versionCode 2 → 3, versionName 1.0.1 → 1.0.2 auto bump

# 5. AAB build (Play Store ke liye)
npm run android:release
# OR manually:
# cd android && ./gradlew bundleRelease

# 6. Output yahan milega:
# android/app/build/outputs/bundle/release/app-release.aab  ← yehi upload karna hai!
```

### 3. APK for Testing (manual install)
```bash
npm run android:apk
# → android/app/build/outputs/apk/release/app-release.apk
# ya debug:
npm run android:debug
# → android/app/build/outputs/apk/debug/app-debug.apk
```

> **Debug APK** seedha phone me install karke test kar sakta hai. Release AAB sirf Play Console pe upload hota hai.

---

## 🔑 Keystore Ka Dhyaan

- `android/linefree-release.keystore` + `android/keystore.properties` — **kabhi git pe mat daal** (already `.gitignore` me hai)
- Backup: Google Drive + 1Password + pen drive — 3 jagah rakh
- Ek baar Play Store pe upload kar diya, **same keystore se hi update hoga**. Naya banaya toh Play Store reject kar dega.

Agar CI (GitHub Actions) use karna hai toh:

```bash
base64 -w 0 android/linefree-release.keystore > /tmp/k.b64
base64 -w 0 android/keystore.properties > /tmp/p.b64
# Inko GitHub repo → Settings → Secrets and variables → Actions me daal:
# KEYSTORE_BASE64 = content of /tmp/k.b64
# KEYSTORE_PROPERTIES = content of /tmp/p.b64
```

Phir har `git push` pe auto AAB banega → Actions tab me download kar sakta hai.

---

## 🏪 Play Console pe Upload

1. **https://play.google.com/console** → Create App
   - App name: `Line Free India`
   - Default language: English (India) + Hindi
   - App type: App, Category: Beauty / Lifestyle
   - Declaration: dena padega (privacy, data safety)

2. **App content** fill kar:
   - **Privacy Policy URL** — `https://linefreeindia.com/privacy-policy` ya Firebase hosting pe daal. Tera code me `/privacy-policy` route already hai — usko deploy kar.
   - **Data Safety** form:
     - Location (coarse/fine) → Yes, for nearby salons
     - Camera → Yes, for profile photo / gallery
     - Notifications → Yes
     - No ads, no AD_ID (humne remove kiya hai)
     - Encryption in transit: Yes (Firebase HTTPS)
     - Data deletion: Yes (Delete Account feature hai)
   - **Target audience**: 13+ ya 18+ (beauty)
   - **Content rating**: Questionnaire bhar

3. **Store Listing** (yahan assets chahiye)
   - **App icon** 512x512 → `playstore_assets/icon-1024.png` (resize 512)
   - **Feature graphic** 1024x500 → `playstore_assets/feature-graphic-1024x500.png`
   - **Screenshots** (min 2 phone): 1080x1920 portrait
     - Daal de: Customer Home, Salon Detail, Token Tracking, Business Dashboard
     - Tip: `npm run dev` → Chrome → Device Toolbar (Pixel 7) → screenshot le
   - **Short description** (80 chars): `Skip the queue. Book salons, spas & clinics near you.`
   - **Full description** template `playstore_assets/description.txt` dekh
   - **Contact**: email + phone

4. **Production → Create new release**:
   - Upload `app-release.aab` (not APK!)
   - Release notes: `Initial release — Book beauty & wellness services, live token queue, loyalty rewards.`
   - Review → Rollout

5. **Review time**: 1-3 din (usually 24h). Pehle closed testing kar sakta hai agar jaldi chahiye.

---

## 🔧 Version Update Kaise Kare?

Har naye update pe:

```bash
# code changes kar
node scripts/playstore-prepare.mjs   # auto bump 1.0.1 → 1.0.2, code 2 → 3
npm run build
npx cap sync android
npm run android:release
# naya AAB upload to Play Console → new release
```

> **Note**: `versionCode` hamesha badhna chahiye, warna Play Console reject. `playstore-prepare.mjs` auto karta hai.

---

## 🧪 Local Test Bina Keystore Ke

Agar abhi keystore nahi banaya, bhi debug build kar sakta hai:

```bash
npm run android:debug
# ya Android Studio → Open android/ → Run (green play)
```

Phone ko USB debugging on karke connect kar, ya emulator pe test.

---

## ⚠️ Common Play Store Rejections & Fix

| Issue | Fix |
|-------|-----|
| Privacy Policy missing | `/privacy-policy` ko live URL pe host kar, Play Console me daal. Hamare paas `PrivacyPolicy.tsx` ready hai. |
| Data Safety mismatch | Location/Camera ka declaration Data Safety form me sahi bhar. |
| App crashes on launch | Release se pehle debug APK phone pe test kar. `npx cap sync` bhula toh assets missing. |
| Icon/screenshot blurry | 512 icon + 1024 feature graphic use kar, screenshot 1080+ width. |
| Target API level | Already 35 (latest), Capacitor 8 — pass. |
| Permissions without use | Camera/Location runtime permission tab maangta hai jab feature use ho — code me handling hai. |

---

## 📂 Important Files

```
capacitor.config.ts          → appId, plugins, splash
android/app/build.gradle     → versionCode/versionName, signing
android/keystore.properties  → signing passwords (gitignore)
android/app/src/main/AndroidManifest.xml → permissions
public/icon-*.png             → PWA icons
android/app/src/main/res/mipmap-* → native icons
scripts/generate-keystore.sh  → one-time key generation
scripts/playstore-prepare.mjs → version bump + checks
.github/workflows/android-build.yml → CI auto AAB
```

---

## 🆘 Help

- `npx cap doctor` — sab sahi hai ya nahi check karega
- `npx cap open android` — Android Studio me kholega
- Build error? `cd android && ./gradlew clean && ./gradlew bundleRelease --stacktrace`

**All the best bro! 🚀 Play Store pe Line Free India jaldi live hoga. Koi doubt ho toh bol!**

