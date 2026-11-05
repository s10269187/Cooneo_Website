/* ==========================================================
   COONEO 酷牛 — FIREBASE SETTINGS
   ----------------------------------------------------------
   Login, saved carts, favourites and orders use Firebase
   (a Google service, free to start). Until the values below
   are filled in, the website still works for guests — the
   cart and favourites are kept in the browser only, and the
   login / checkout pages show a "not set up yet" message.

   HOW TO SET IT UP
   1. Go to https://console.firebase.google.com → "Add project".
   2. In the project: Build → Authentication → "Get started".
      Turn on the "Email/Password" and "Google" sign-in methods.
   3. Build → Firestore Database → "Create database" (production mode).
      Then open the "Rules" tab, paste in everything from
      firestore.rules (in this folder) and click "Publish".
   4. Project settings (⚙) → "Your apps" → Web app (</>) → register.
      Copy the firebaseConfig values it shows into the object below.
   5. Authentication → Settings → Authorised domains: add the
      domain the site will live on (e.g. your-site.vercel.app).
      "localhost" is already allowed for testing.

   These values are not secret — they only identify the project.
   The security rules in firestore.rules are what protect the data.
   ========================================================== */
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // TODO
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com", // TODO
  projectId: "YOUR_PROJECT_ID", // TODO
  storageBucket: "YOUR_PROJECT_ID.appspot.com", // TODO
  messagingSenderId: "YOUR_SENDER_ID", // TODO
  appId: "YOUR_APP_ID", // TODO
};
