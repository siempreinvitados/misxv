/* Plantilla de shared/firebase-config.js (proyecto nuevo, hoy "siempre-invitados").
   Ese archivo NO se commitea (ver .gitignore) — en producción lo genera
   .github/workflows/deploy.yml a partir de GitHub Secrets. Para correr el
   sitio en local, copia este archivo a shared/firebase-config.js y llena
   los valores reales. Si no lo creas, el sitio sigue funcionando igual
   (RSVP solo por WhatsApp, sin contador ni persistencia) gracias al
   try/catch de app.js. Ver README.md. */
window.firebaseConfig = {
    apiKey: "EDITA-ME",
    authDomain: "EDITA-ME",
    databaseURL: "EDITA-ME",
    projectId: "EDITA-ME",
    storageBucket: "EDITA-ME",
    messagingSenderId: "EDITA-ME",
    appId: "EDITA-ME",
    measurementId: "EDITA-ME",
};
