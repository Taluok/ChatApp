// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify"

const firebaseConfig = {
    apiKey: "AIzaSyDzx0I7101mdG17IjVfBmgspPWoHteSgjI",
    authDomain: "chatapp-gs-463f2.firebaseapp.com",
    projectId: "chatapp-gs-463f2",
    storageBucket: "chatapp-gs-463f2.appspot.com",
    messagingSenderId: "172622690550",
    appId: "1:172622690550:web:25374bf1547b90d548d4d7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const signup = async (username, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;

        await setDoc(doc(db, "users", user.uid), {
            id: user.uid,
            username: username.toLowerCase(),
            email: email.toLowerCase(),
            name: "",
            avatar: "",
            bio: "Hey, there! I am using the chat app",
            lastSeen: Date.now(),
        });

        await setDoc(doc(db, "chats", user.uid), {
            chatData: []
        });

        console.log("User signed up successfully");
    } catch (err) {
        console.error(err);
        toast.error(err.code);
    }
}

export { signup };
