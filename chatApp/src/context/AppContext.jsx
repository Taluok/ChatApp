import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { createContext, useEffect, useState } from "react";
import { auth, db } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import PropTypes from 'prop-types';

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [chatData, setChatData] = useState(null);

    const loadUserData = async (uid) => {
        try {
            const userRef = doc(db, 'users', uid);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                setUserData(userData);

                if (userData.avatar && userData.name) {
                    navigate('/chat');
                } else {
                    navigate('/profile');
                }

                // Update lastSeen when loading user data
                await updateDoc(userRef, {
                    lastSeen: Date.now(),
                });

                // Set up an interval to update lastSeen every minute
                const intervalId = setInterval(async () => {
                    if (auth.currentUser) {
                        await updateDoc(userRef, {
                            lastSeen: Date.now(),
                        });
                    } else {
                        clearInterval(intervalId);
                    }
                }, 60000);
            } else {
                console.error("User not found");
            }
        } catch (err) {
            console.error("Error loading user data:", err);
        }
    };

    useEffect(() => {
        if (userData) {
            const chatRef = doc(db, 'chats', userData.id);
            const unSub = onSnapshot(chatRef, async (res) => {
                const chatItems = res.data().chatsData;
                const tempData = [];
                for (const item of chatItems) {
                    const userRef = doc(db, 'users', item.rId);
                    const userSnap = await getDoc(userRef);
                    const userData = userSnap.data();
                    tempData.push({ ...item, userData });
                }
                setChatData(tempData.sort((a, b) => b.updatedAt - a.updatedAt));
            });
            return () => {
                unSub();
            };
        }
    }, [userData]);
    

    const value = {
        userData,
        setUserData,
        chatData,
        setChatData,
        loadUserData,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

// Adding PropTypes validation
AppContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AppContextProvider;

