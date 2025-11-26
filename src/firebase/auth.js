// src/firebase/auth.ts
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { app } from "./firebaseConfig"; // adapte se seu firebaseConfig exportar app
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

export const auth = getAuth(app);
export const db = getFirestore(app);

// helper: sign in
export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

// helper: logout
export async function logout() {
  return signOut(auth);
}

// helper: fetch user profile doc (contains role)
export async function getUserProfile(uid: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// helper: create user profile doc (use para onboarding)
export async function createProfileIfNotExists(uid: string, name: string, email: string) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, { name, email, role: "sister" });
  }
}
