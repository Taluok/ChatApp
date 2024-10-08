
import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, collection, query, where, getDocs } from "firebase/firestore"; 
import { toast } from "react-toastify";

// Your web app's Firebase configuration
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

// Sign up function
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
            chatsData: []
        });

        console.log("User signed up successfully");
    } catch (err) {
        console.error(err);
        toast.error(err.code);
    }
}

// Login function
const login = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        toast.error(err.code.split('/')[1].split('-').join(""));
    }
}

// Logout function
const logout = async () => {
    try {
        await signOut(auth);
    } catch (err) {
        toast.error(err.code.split('/')[1].split('-').join(""));
    }
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db, 'users'); 
        const q = query(userRef, where("email", "==", email));
        const querySnap = await getDocs(q);
        
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset Email Sent");
        } else {
            toast.error("Email doesn't exist");
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message);
    }
};

// Export functions and variables
export { signup, login, logout, auth, db, resetPass }