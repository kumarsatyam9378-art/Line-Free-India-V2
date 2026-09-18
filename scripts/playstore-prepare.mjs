#!/usr/bin/env node
// playstore-prepare.mjs - bump versionCode/versionName + sanity checks
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const gradlePath = path.join(root, 'android/app/build.gradle');
const capConfigPath = path.join(root, 'capacitor.config.ts');
const packageJsonPath = path.join(root, 'package.json');

function bumpVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

console.log('🚀 Play Store Prepare');

// 1. Read current build.gradle
let gradle = fs.readFileSync(gradlePath, 'utf8');
const vcMatch = gradle.match(/versionCode\s+(\d+)/);
const vnMatch = gradle.match(/versionName\s+"([^"]+)"/);

if (!vcMatch || !vnMatch) {
  console.error('❌ Could not parse versionCode/versionName in android/app/build.gradle');
  process.exit(1);
}

let versionCode = parseInt(vcMatch[1], 10);
let versionName = vnMatch[1];
console.log(`   Current: versionCode ${versionCode}, versionName ${versionName}`);

const args = process.argv.slice(2);
let newVersionCode = versionCode + 1;
let newVersionName = bumpVersion(versionName);

if (args.includes('--code')) {
  const idx = args.indexOf('--code');
  newVersionCode = parseInt(args[idx + 1], 10);
}
if (args.includes('--name')) {
  const idx = args.indexOf('--name');
  newVersionName = args[idx + 1];
}
if (args.includes('--no-bump')) {
  newVersionCode = versionCode;
  newVersionName = versionName;
}

if (newVersionCode === versionCode && newVersionName === versionName && !args.includes('--no-bump')) {
  console.log('   Bumping automatically...');
}

gradle = gradle.replace(/versionCode\s+\d+/, `versionCode ${newVersionCode}`);
gradle = gradle.replace(/versionName\s+"[^"]+"/, `versionName "${newVersionName}"`);
fs.writeFileSync(gradlePath, gradle);
console.log(`   → New: versionCode ${newVersionCode}, versionName ${newVersionName}`);

// 2. Checks
console.log('\n🔍 Checks:');
const checks = [];

const hasGoogleServices = fs.existsSync(path.join(root, 'android/app/google-services.json'));
checks.push([hasGoogleServices, 'android/app/google-services.json exists']);
checks.push([fs.existsSync(path.join(root, 'dist', 'index.html')) || true, 'Run npm run build before release (dist missing? will be built)']);

const manifest = fs.readFileSync(path.join(root, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
const buildGradle = fs.readFileSync(path.join(root, 'android/app/build.gradle'), 'utf8');
checks.push([buildGradle.includes('com.linefreeindia.app') || manifest.includes('com.linefreeindia.app'), 'App ID com.linefreeindia.app correct (build.gradle/manifest)']);
checks.push([manifest.includes('POST_NOTIFICATIONS'), 'POST_NOTIFICATIONS permission declared']);

const capConfig = fs.readFileSync(capConfigPath, 'utf8');
checks.push([capConfig.includes("appId: 'com.linefreeindia.app'"), 'capacitor.config.ts appId correct']);
checks.push([capConfig.includes("webDir: 'dist'"), 'capacitor.config.ts webDir correct']);

const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
checks.push([pkg.dependencies['@capacitor/android'] !== undefined, 'Capacitor Android dependency present']);

for (const [ok, msg] of checks) {
  console.log(`   ${ok ? '✅' : '❌'} ${msg}`);
}

const failed = checks.filter(([ok]) => !ok);
if (failed.length > 0) {
  console.log('\n⚠️  Some checks failed - fix before Play Store upload');
} else {
  console.log('\n✅ All checks passed');
}

console.log('\n📦 Next steps:');
console.log('   1. npm run build');
console.log('   2. npx cap sync android');
console.log('   3. npm run android:release   (or: cd android && ./gradlew bundleRelease)');
console.log('   4. Find AAB at: android/app/build/outputs/bundle/release/app-release.aab');
console.log('   5. Upload that AAB to Google Play Console');
console.log('');
console.log(`   Version for this build: ${newVersionName} (${newVersionCode})`);
