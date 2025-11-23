# HACHEF SCHÉMA ÉLECTRIQUE AI PRO - Android APK Setup

## Capacitor Configuration

This app is configured to build as an Android APK using Capacitor.

### Initial Setup

1. **Export to GitHub** and git pull the project to your local machine

2. **Install dependencies:**
```bash
npm install
```

3. **Initialize Capacitor:**
```bash
npx cap init
```
This has already been configured in `capacitor.config.ts`

4. **Add Android platform:**
```bash
npx cap add android
```

5. **Update native dependencies:**
```bash
npx cap update android
```

6. **Build the web app:**
```bash
npm run build
```

7. **Sync to Android:**
```bash
npx cap sync android
```

### Development

For development with hot-reload from Lovable sandbox:
- The app is configured to load from: `https://10a3da64-3600-4fc5-a006-0deb007f9ba3.lovableproject.com`
- This allows you to see changes in real-time on your device/emulator

### Building APK

**Requirements:**
- Android Studio installed
- Java Development Kit (JDK) 11 or higher

**Steps:**

1. **Open Android project:**
```bash
npx cap open android
```

2. **In Android Studio:**
   - Wait for Gradle sync to complete
   - Go to Build → Build Bundle(s) / APK(s) → Build APK(s)
   - Or use: Build → Generate Signed Bundle / APK for production

3. **Run on device/emulator:**
```bash
npx cap run android
```

### App Details

- **App ID:** `app.lovable.10a3da6436004fc5a0060deb007f9ba3`
- **App Name:** HACHEF SCHÉMA ÉLECTRIQUE AI PRO
- **Developer:** HACHEF OUSSAMA

### Features Requiring Native Permissions

- Camera access for live capture
- File system access for image/PDF uploads
- Internet for AI analysis

### Important Notes

1. After making changes in Lovable, pull the latest code
2. Run `npx cap sync android` to update native code
3. For production, update the server URL in `capacitor.config.ts` to your deployed URL
4. Configure proper icons and splash screens in Android Studio

### Troubleshooting

If you encounter issues:
1. Clear Gradle cache: `./gradlew clean` (in android folder)
2. Re-sync: `npx cap sync android`
3. Check Android Studio for specific errors
4. Ensure all permissions are correctly configured in AndroidManifest.xml

For more information, visit: [Capacitor Documentation](https://capacitorjs.com/docs)
