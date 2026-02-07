import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.palette.app',
  appName: 'PALETTE',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    // No URL - use local files
    cleartext: true
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff"
    }
  }
};

export default config;
