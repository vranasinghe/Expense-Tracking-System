# 💰 Expense Tracker App

A local-first, premium **Expense & Budget Tracking Application** built with **React Native**, **Expo (SDK 54)**, and **TypeScript**. This app helps users monitor their finances, define category-wise budgets, analyze spending trends via interactive charts, attach receipts to transactions, and secure their financial data using biometric authentication.

---

## 🌟 Key Features

*   **⚡ Local-First Design**: Powered by [Zustand](https://github.com/pmndrs/zustand) and [Async Storage](https://github.com/react-native-async-storage/async-storage) for seamless offline usability and instantaneous load times.
*   **🔒 Biometric Security**: Secure your financial logs with local authentication (FaceID / Fingerprint / Passcode) via `expo-local-authentication`.
*   **📊 Rich Financial Analytics**: Visualize weekly/monthly spending patterns and category distributions with [React Native Gifted Charts](https://github.com/Abhinandan-Kushwaha/react-native-gifted-charts).
*   **🎯 Budget Boundaries**: Establish monthly/weekly category limits and receive push notification alerts when approaching or exceeding limits.
*   **🧾 Receipt Attachment & Sharing**: Attach images of receipt bills directly to transaction logs using `expo-image-picker`, store them locally on the file system, and share them on-demand via `expo-sharing`.
*   **💡 Elegant Custom Keypad**: Fast and responsive expense entry using a dedicated numeric keyboard designed for quick inputs.
*   **🎨 Custom Categories**: Personalize category registers by creating bespoke categories with custom icons and theme colors.
*   **🌓 Automatic Dark Mode Support**: Beautifully optimized dark and light mode themes built using HSL-tailored custom color systems.

---

## 🛠️ Technology Stack

*   **Framework**: [Expo SDK 54](https://expo.dev) (React Native 0.81.5)
*   **Navigation**: File-based routing with [Expo Router v6](https://docs.expo.dev/router/introduction/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand) (with `persist` middleware for disk syncing)
*   **Database / Storage**: Expo SecureStore (for credentials) & Async Storage (for logs and transactions)
*   **Charts**: React Native Gifted Charts
*   **Typography**: Poppins (via `@expo-google-fonts/poppins`)

---

## 📁 Folder Structure

```text
Expense Tracking System/
├── app/                      # Expo Router App Screens & Layouts
│   ├── (onboarding)/         # Onboarding & Auth Setup flow
│   │   ├── splash.tsx        # Splash page
│   │   ├── auth.tsx          # Local passcode & biometric authentication screen
│   │   └── balance.tsx       # Starting balance configuration
│   ├── (tabs)/               # Tab-based dashboard routing
│   │   ├── index.tsx         # Dashboard / Home Screen
│   │   ├── analytics.tsx     # Visual metrics & spending breakdowns
│   │   ├── budgets.tsx       # Budgets configuration & status chips
│   │   └── profile.tsx       # Settings, Dark Mode, Profile customization
│   ├── _layout.tsx           # Global Root Navigation Layout
│   └── index.tsx             # Main router entry / redirect logic
├── assets/                   # App icons, splash, and media assets
├── components/               # Reusable UI & Functional Screen Components
│   ├── screens/              # Modals/Drawers (AddExpenseSheet, NotificationsScreen, etc.)
│   └── ui/                   # Reusable atomic elements (AmountKeypad, BudgetCard, CategoryChip, etc.)
├── constants/                # Colors, default categories, and application themes
├── store/                    # Zustand Store configuration & TS type definitions
├── utils/                    # Common helper modules (formatting currency, date computations)
├── setup-and-run.bat         # Automation script for quick installation and launch
└── tsconfig.json             # TypeScript compiler rules
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your computer or test on a physical mobile device.

### 📋 Prerequisites

Ensure you have the following installed on your machine:
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   [Git](https://git-scm.com/)
*   **Expo Go** app installed on your physical device (available in iOS App Store / Google Play Store), or an Android/iOS emulator set up.

---

### 📥 Installation & Setup

1.  **Clone the Repository** (or navigate to your root folder):
    ```bash
    cd "Expense Tracking System"
    ```

2.  **Generate Dummy Assets** (Required if `assets/` icons do not exist yet):
    Run the utility script to generate transparent placeholder PNGs for Expo compilation:
    ```bash
    node create-dummy-assets.js
    ```

3.  **Install Dependencies**:
    ```bash
    npm install
    ```

---

### 🖥️ Running the Application

You can spin up the development environment using the automation script or NPM commands:

#### Option A: Quick Automation (Windows)
Double-click or run:
```bash
./setup-and-run.bat
```

#### Option B: Standard Expo Start Command
```bash
npm run start
```
Once the dev server starts, you will see a QR code in the terminal.

*   **iOS Device**: Scan the QR code using your phone's system camera.
*   **Android Device**: Scan the QR code using the **Expo Go** app.
*   **Simulator**: Press `a` for Android Emulator or `i` for iOS Simulator in the terminal.
*   **Web**: Press `w` to view the web dashboard.

---

## 🔐 Security & Local Storage

Your financial logs belong to you.
*   **Offline Data**: Transactions, budgets, and customization metadata are kept on-device inside standard `AsyncStorage`.
*   **Biometrics**: The app uses `expo-local-authentication` to integrate with secure iOS FaceID/TouchID or Android Fingerprint hardware.
*   **Receipt Storage**: Image files selected via the camera or gallery are saved locally to your device's persistent cache using `expo-file-system`.
