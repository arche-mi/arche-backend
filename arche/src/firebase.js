// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { GoogleAuthProvider, getAuth, signInWithPopup, sendPasswordResetEmail, signOut, } from "firebase/auth";
import { getFirestore, query, getDocs, collection, where, addDoc, doc, setDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { onSnapshot } from "firebase/firestore"; 
import { enableIndexedDbPersistence } from "firebase/firestore"; 
import { disableNetwork } from "firebase/firestore"; 
import { enableNetwork } from "firebase/firestore"; 


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgdtfoY06kNC78khTFpvRzyFTW3nzJxO4",
  authDomain: "arch-39e60.firebaseapp.com",
  databaseURL: "https://arch-39e60-default-rtdb.firebaseio.com",
  projectId: "arch-39e60",
  storageBucket: "arch-39e60.appspot.com",
  messagingSenderId: "36281085157",
  appId: "1:36281085157:web:380cd51b6a5525a98b380c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const msg = "Bienvenue sur l'arche";
const feedback = [];
const documents = [];
const university = 'Ufhb';
const filiere = "Math Info";
const level = 'Niveau';
const sexe = 'Sexe';

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
        badges: [`Bienvenue&${user.metadata.creationTime}`],
        docs: documents,
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
  }
};


// Firebase storage reference
const storage = getStorage(app);
export default storage;

// Local Storage
enableIndexedDbPersistence(db)
  .catch((err) => {
      if (err.code === 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code === 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });
// Subsequent queries will use persistence, if it was enabled successfully
const q = query(collection(db, "users"), where("uid", "==", "userid"));
onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    snapshot.docChanges().forEach((change) => {
        console.log("change");

        const source = snapshot.metadata.fromCache ? "local cache" : "server";
        console.log("Data came from " + source);
    });
});


// disable user connexion to firebase
const stopNetworkAcces = async () => {
		await disableNetwork(db);
		console.log("Network disabled!");
}

// enable user connexion to firebase
const activeNetworkAcces = async () => {
    await enableNetwork(db);  
    console.log("Network enable");
    // Do online actions
    // ...
}


// Logout
const logout = () => {
  signOut(auth);
};


export { auth, db, signInWithGoogle, logout, activeNetworkAcces, stopNetworkAcces };