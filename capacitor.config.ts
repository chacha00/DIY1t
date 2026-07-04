import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.diy1t.app",
  appName: "DIY1T",
  webDir: "out",
  server: {
    url: "https://www.diy1t.com",
    cleartext: false,
  },
  ios: {
    contentInset: "automatic",
    backgroundColor: "#ffffff",
  },
  android: {
    backgroundColor: "#ffffff",
    allowMixedContent: false,
  },
};

export default config;
