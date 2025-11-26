import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB6ZYHxQls1ONQ8ZOUGVbLbd67SM5foPnw",
  authDomain: "justificativas-pia.firebaseapp.com",
  projectId: "justificativas-pia",
  storageBucket: "justificativas-pia.firebasestorage.app",
  messagingSenderId: "236723731998",
  appId: "1:236723731998:web:a420a9e99f000c45b5380f"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
