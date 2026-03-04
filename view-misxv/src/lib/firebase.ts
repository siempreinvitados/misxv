import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get } from 'firebase/database';

const firebaseConfig = {
	apiKey: "AIzaSyC6Xrc9EqMyXKH_gNFaOGuAX-ItudzZAVs",
	authDomain: "bautizo-sofia.firebaseapp.com",
	databaseURL: "https://bautizo-sofia-default-rtdb.firebaseio.com",
	projectId: "bautizo-sofia",
	storageBucket: "bautizo-sofia.firebasestorage.app",
	messagingSenderId: "981839514602",
	appId: "1:981839514602:web:981d3b9a4dcde418c84093",
	measurementId: "G-TVQSGB0FWT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { app, database, ref, set, get };
