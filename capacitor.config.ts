import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.10a3da6436004fc5a0060deb007f9ba3',
  appName: 'HACHEF SCHÉMA ÉLECTRIQUE AI PRO',
  webDir: 'dist',
  server: {
    url: 'https://10a3da64-3600-4fc5-a006-0deb007f9ba3.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#000000",
      showSpinner: false,
    }
  }
};

export default config;
