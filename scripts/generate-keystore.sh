#!/bin/bash
# generate-keystore.sh - One-time keystore generation for Play Store
# Run: bash scripts/generate-keystore.sh
# Or: npm run playstore:keystore

set -e

KEYSTORE_PATH="android/linefree-release.keystore"
PROPERTIES_PATH="android/keystore.properties"

if [ -f "$KEYSTORE_PATH" ]; then
  echo "⚠️  Keystore already exists at $KEYSTORE_PATH"
  echo "   Delete it manually if you want to regenerate (NOT RECOMMENDED after Play Store upload!)"
  exit 1
fi

echo "🔐 Line Free India - Play Store Keystore Generator"
echo "=================================================="
echo ""
echo "This keystore is your UPLOAD KEY. Keep it SAFE + BACKUP!"
echo "If you lose it after Play Store upload, you cannot update the app."
echo ""

read -p "Keystore password (min 6 chars): " STORE_PASS
read -p "Key password (press enter to use same as store password): " KEY_PASS
if [ -z "$KEY_PASS" ]; then KEY_PASS=$STORE_PASS; fi
read -p "Key alias (default: linefree): " KEY_ALIAS
if [ -z "$KEY_ALIAS" ]; then KEY_ALIAS="linefree"; fi

# Defaults for dname
DNAME="CN=Line Free India, OU=Mobile, O=Line Free India, L=India, S=Delhi, C=IN"

echo ""
echo "Generating keystore..."

keytool -genkey -v \
  -keystore "$KEYSTORE_PATH" \
  -alias "$KEY_ALIAS" \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -storepass "$STORE_PASS" -keypass "$KEY_PASS" \
  -dname "$DNAME"

echo ""
echo "✅ Keystore generated at $KEYSTORE_PATH"

cat > "$PROPERTIES_PATH" <<EOF
storeFile=linefree-release.keystore
storePassword=$STORE_PASS
keyAlias=$KEY_ALIAS
keyPassword=$KEY_PASS
EOF

echo "✅ Created $PROPERTIES_PATH"
echo ""
echo "⚠️  IMPORTANT:"
echo "   1. BACKUP $KEYSTORE_PATH to Google Drive / 1Password / safe place"
echo "   2. NEVER commit keystore to git (already in .gitignore)"
echo "   3. You need this file for every future release"
echo ""
echo "Next: npm run android:release   → generates AAB at android/app/build/outputs/bundle/release/"
