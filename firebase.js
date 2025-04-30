import { initializeApp, getApps, getApp } from "firebase/app";
import { getDatabase, ref, get, set, update, push, child,  onValue, } from "firebase/database";
import { getAuth, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCFXaeQ2L8zq0ZYTsydGek2K5pEZ_-BqPw",
  authDomain: "bancoestoquecozinha.firebaseapp.com",
  databaseURL: "https://bancoestoquecozinha-default-rtdb.firebaseio.com",
  projectId: "bancoestoquecozinha",
  storageBucket: "bancoestoquecozinha.appspot.com",
  messagingSenderId: "71775149511",
  appId: "1:71775149511:web:bb2ce1a1872c65d1668de2",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const dbRealtime = getDatabase(app);
const dbFirestore = getFirestore(app);
const auth = getAuth(app);  

export { dbRealtime, dbFirestore, auth,  ref, set, get, child, update, onValue, push, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword };
export const db = dbRealtime;
