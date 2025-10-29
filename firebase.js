// firebase.js
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getDatabase,
  ref,
  get,
  set,
  remove,
  update,
  push,
  child,
  onValue,
} from "firebase/database";
import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore, Timestamp, addDoc, collection } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

// Inicializa Firebase se ainda não tiver sido inicializado
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Flag para saber se Firebase foi configurado
const isConfigured = !!app;

// Serviços Firebase
const dbRealtime = getDatabase(app); // Realtime Database
const db = dbRealtime; // Alias conveniente
const dbFirestore = getFirestore(app); // Firestore
const auth = getAuth(app); // Auth

// Exportações
export {
  app,
  isConfigured,
  db,          // alias para dbRealtime
  dbRealtime,  // exporta o nome original
  dbFirestore,
  auth,
  ref,
  get,
  set,
  remove,
  update,
  push,
  child,
  onValue,
  Timestamp,
  collection,
  addDoc,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
};
