/* Config de Firebase del proyecto "bautizo-sofia" (el viejo, con datos
   históricos reales de gali/sofi). Usado por gali/, sofi/ y la conexión
   principal de admin/app.js. Ver README.md — a diferencia de
   shared/firebase-config.js (proyecto nuevo), este SÍ se commitea en texto
   plano: son valores de config de cliente, ya públicos hoy mismo dentro del
   propio código de gali/sofi, no un secreto que este archivo esté
   introduciendo de nuevo. */
window.firebaseConfigLegacy = {
    apiKey: "AIzaSyC6Xrc9EqMyXKH_gNFaOGuAX-ItudzZAVs",
    authDomain: "bautizo-sofia.firebaseapp.com",
    databaseURL: "https://bautizo-sofia-default-rtdb.firebaseio.com",
    projectId: "bautizo-sofia",
    storageBucket: "bautizo-sofia.firebasestorage.app",
    messagingSenderId: "981839514602",
    appId: "1:981839514602:web:981d3b9a4dcde418c84093",
    measurementId: "G-TVQSGB0FWT",
};
