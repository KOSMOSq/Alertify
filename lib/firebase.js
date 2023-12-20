import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDtJ1zmPL2wwK0oA13GAD44QiGHsDlNHoc",
    authDomain: "alertify-2164a.firebaseapp.com",
    projectId: "alertify-2164a",
    storageBucket: "alertify-2164a.appspot.com",
    messagingSenderId: "239567517459",
    appId: "1:239567517459:web:c4b6f2d47edc451d7c8ce6"
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage)
});
export const FIREBASE_DB = getFirestore(FIREBASE_APP);
