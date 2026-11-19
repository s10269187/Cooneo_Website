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
  apiKey: "AIzaSyAYVDtGgp0t8RDovvPzc9aNijVkLjug-wM",
  authDomain: "cooneo-website.firebaseapp.com",
  projectId: "cooneo-website",
  storageBucket: "cooneo-website.firebasestorage.app",
  messagingSenderId: "253229631827",
  appId: "1:253229631827:web:6e9823e178ebc8ca6df9a6",
  measurementId: "G-NQ40FV0T7V", // Google Analytics (visitor stats)
};
