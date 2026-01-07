# 🇪🇺 Schengen Visa Calculator (90/180 Rule)

A smart, privacy-focused Progressive Web App (PWA) that helps non-EU travelers track their stay in the Schengen Area and avoid overstaying their visa.

<div align="center">

### 🚀 [CLICK HERE TO USE THE APP](https://Cyberguardian2494.github.io/schengen-visa-calculator/)
*(Works instantly in your browser on Phone or Desktop — No download required)*

</div>

---

## 🧐 Why This Exists
For non-EU citizens, the **Schengen Rule** is strict: You can stay for a maximum of **90 days** within any **180-day rolling period**.

Calculating this manually is incredibly difficult because the 180-day window "moves" forward every single day. A trip you took 6 months ago might stop counting tomorrow, suddenly giving you extra days.

**This app solves that math instantly.** It tells you exactly:
1.  How many days you have used.
2.  **"Safe Until":** The exact date you must leave to remain legal.
3.  **"Re-entry Date":** When you are allowed to come back if you've used all your days.

## ✨ Key Features

* **🔒 100% Private:** No servers. No accounts. All your travel data is stored locally on your device (Local Storage). Nothing is ever sent to the cloud.
* **✈️ Smart Tracking:** Log past and future trips. Handles multi-country itineraries (e.g., "France -> Italy -> Spain").
* **📱 Offline Capable (PWA):** Install it on your phone like a native app. Works perfectly without WiFi or Data—essential for travel.
* **🗺️ Visual Map:** An interactive "Conquest Map" that highlights every country you've visited.
* **⚠️ Compliance Engine:** Automatically alerts you if a future trip will cause an overstay.

## 🛠️ How It Was Built
This project was built using a **"Vibe Coding"** methodology—rapid, iterative development focusing on high utility, clean aesthetics, and immediate user value.

### Tech Stack
* **Core:** [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
* **Styling:** [Tailwind CSS](https://tailwindcss.com/)
* **Logic:** `date-fns` for complex temporal math.
* **Visualization:** `react-simple-maps` + `d3-scale` for the interactive map.
* **Deployment:** GitHub Pages (Automated CI/CD).

## 🛡️ Privacy Promise
This calculator is designed with a "Privacy First" architecture.
* **Your Data stays on Your Device.**
* If you share the link with a friend, they get a fresh, blank calculator. They cannot see your trips, and you cannot see theirs.
* Clearing your browser cache will reset the app.

## 💻 Local Development (For Developers)
If you want to clone this repo and run it on your own machine:

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/Cyberguardian2494/schengen-visa-calculator.git](https://github.com/Cyberguardian2494/schengen-visa-calculator.git)
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Start the local server**
    ```bash
    npm run dev
    ```
4.  **Build for production**
    ```bash
    npm run build
    ```

---
*Built with ❤️ for travelers.*
