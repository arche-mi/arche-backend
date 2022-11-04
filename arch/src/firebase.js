// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup, sendPasswordResetEmail, signOut, } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgdtfoY06kNC78khTFpvRzyFTW3nzJxO4",
  authDomain: "arch-39e60.firebaseapp.com",
  projectId: "arch-39e60",
  storageBucket: "arch-39e60.appspot.com",
  messagingSenderId: "36281085157",
  appId: "1:36281085157:web:380cd51b6a5525a98b380c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const msg = "Bienvenu";
const feedback = [];
const university = 'ufhb';
const filiere = "Math Info";
const level = 'Inconnu';
const sexe = 'Inconnu';

// Sign with Google
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await setDoc(doc(collection(db, "users"), user.displayName), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
        message: msg,
        feedback: feedback,
        creationTime: user.metadata.creationTime,
        lastSeenTime: user.metadata.lastSignInTime,
        userPhoto: user.photoURL,
        university: university,
        filiere: filiere,
        level: level,
        sexe: sexe,
      });
    }
    console.log("sign sucess");
  } catch (err) {
    console.error(err);
    // alert(err.message);
  }
};



// Forgot password
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// Logout
const logout = () => {
  signOut(auth);
};

export { auth, db, signInWithGoogle, sendPasswordReset, logout };