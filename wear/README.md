# Sanctum Wear OS Companion

Minimal watch companion for the Sanctum PWA.

## Features

- **Timer**: Start/stop meditation timer, syncs to Firestore
- **Today's Practices**: View and check off daily practices

## Setup

### Prerequisites

1. Install [Android Studio](https://developer.android.com/studio) (download the latest stable)
2. During install, ensure "Android SDK" and "Android Virtual Device" are selected

### First Time Setup

1. Open Android Studio
2. Select "Open" and navigate to `sanctum-pwa/wear`
3. Wait for Gradle sync to complete (may take a few minutes first time)
4. Android Studio will prompt to install any missing SDK components - accept all

### Add Firebase Config

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project (sanctum-user-support)
3. Go to Project Settings > General
4. Under "Your apps", click "Add app" > Android
5. Package name: `com.sanctum.wear`
6. Download `google-services.json`
7. Place it in `wear/app/google-services.json`

### Run on Watch

#### Via USB:
1. On your Pixel Watch: Settings > Developer options > ADB debugging ON
2. Connect watch to computer via USB
3. In Android Studio, select your watch from device dropdown
4. Click Run (green play button)

#### Via WiFi:
1. On watch: Settings > Developer options > Debug over WiFi
2. Note the IP address shown
3. In Android Studio terminal: `adb connect <ip>:5555`
4. Select watch from device dropdown and Run

### Build Release APK

1. Build > Generate Signed Bundle/APK
2. Select APK
3. Create or use existing keystore
4. Build release APK
5. Find it in `wear/app/build/outputs/apk/release/`

## Structure

```
wear/
├── app/
│   ├── src/main/
│   │   ├── kotlin/com/sanctum/wear/
│   │   │   ├── presentation/
│   │   │   │   ├── MainActivity.kt      # Entry point
│   │   │   │   ├── screens/
│   │   │   │   │   ├── HomeScreen.kt    # Main menu
│   │   │   │   │   ├── TimerScreen.kt   # Meditation timer
│   │   │   │   │   └── PracticesScreen.kt # Daily checklist
│   │   │   │   └── theme/
│   │   │   │       └── Theme.kt         # Sanctum colors
│   │   │   └── data/
│   │   │       └── FirestoreRepository.kt # Firebase sync
│   │   ├── res/
│   │   └── AndroidManifest.xml
│   └── build.gradle.kts
├── build.gradle.kts
└── settings.gradle.kts
```

## Syncs With PWA

The watch app reads/writes to the same Firestore collections:
- `users/{uid}/sessions` - Meditation sessions
- `users/{uid}/practices` - Practice definitions
- `users/{uid}/dailyLogs` - Daily completion status

Changes made on watch appear in PWA and vice versa.
