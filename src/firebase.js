// Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/storage'
import 'firebase/compat/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBRBmIQWprveS9xw8lQTbjzjFrL1UDNZeg",
    authDomain: "reels-aeb48.firebaseapp.com",
    projectId: "reels-aeb48",
    storageBucket: "reels-aeb48.appspot.com",
    messagingSenderId: "76631553886",
    appId: "1:76631553886:web:b606aa8c0d4d2d6aa501cf"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
const firestore = firebase.firestore();
export const database = {
    users: firestore.collection('users'),
    posts:firestore.collection('posts'),
    comments:firestore.collection('comments'),
    getTimeStamp:firebase.firestore.FieldValue.serverTimestamp
}
export const storage = firebase.storage();