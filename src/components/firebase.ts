import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDlFILx_Sl7xcyj0Bnek0_O2BbwrMTLLUQ",
  authDomain: "feedme-moderator.firebaseapp.com",
  databaseURL: "https://feedme-moderator.firebaseio.com",
  projectId: "feedme-moderator",
  storageBucket: "",
  messagingSenderId: "744556306037",
  appId: "1:744556306037:web:dee92db0d05be10e6f623c"
};

firebase.initializeApp(firebaseConfig);

export default firebase;

export const database = firebase.database();
export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();