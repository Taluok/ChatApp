import './LeftSidebar.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { collection, query, where, getDocs, doc, setDoc, arrayUnion, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { toast } from 'react-toastify';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { userData, chatData, setChatUser, setMessagesId, setChatVisible } = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value;
            if (input.length < 3) return; 
            setIsLoading(true);
            const userRef = collection(db, 'users');
            const q = query(userRef, where("username", "==", input.toLowerCase()));
            const querySnap = await getDocs(q);
            setIsLoading(false);

            if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                const userExists = chatData.some(chatUser => chatUser.rId === querySnap.docs[0].data().id);

                if (!userExists) {
                    setUser(querySnap.docs[0].data());
                    setShowSearch(true); // Show search results when a user is found
                }
            } else {
                setShowSearch(false);
            }
        } catch (err) {
            setIsLoading(false);
            console.error("Error fetching user data:", err);
            // Show error message to the user
            toast.error("Error fetching user data");
        }
    };

    const handleUserSelect = async () => {
        await addChat(); // Call addChat when a user is selected
        setShowSearch(false); // Optionally hide search results after selection
        // Add visual effect to indicate user selection
    };

    const addChat = async () => {
        const messagesRef = collection(db, "messages");
        try {
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef, {
                createAt: arrayUnion({
                    messageId: newMessageRef.id,
                    lastMessage: "",
                    rId: userData.id,
                    updatedAt: Date.now(),
                    messageSeen: true
                })
            });

            await setDoc(doc(db, "chats", userData.id), {
                lastChat: newMessageRef.id,
                updatedAt: Date.now(),
            });
        } catch (err) {
            console.error("Error adding chat:", err);
            toast.error("Error adding chat");
        }
    };

    const setChat = async (item) => {
        try {
            setMessagesId(item.messagesId);
            setChatUser(item);
            const userChatRef = doc(db, 'chats', userData.id);
            const userChatSnapshot = await getDoc(userChatRef);
            
            if (userChatSnapshot.exists()) {
                const userChatData = userChatSnapshot.data();
                const chatIndex = userChatData.chatsData.findIndex((c) => c.messagesId === item.messagesId);
                
                if (chatIndex !== -1) {
                    userChatData.chatsData[chatIndex].messageSeen = true;
                    await updateDoc(userChatRef, {
                        chatsData: userChatData.chatsData
                    });
                    setChatVisible(true);
                }
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        return () => {
            // Clean up subscription to onSnapshot when the component unmounts
        }
    }, []);

    return (
        <div className='ls'>
            <div className="ls-top">
                <div className="ls-nav">
                    <img src={assets.logo} className="logo" alt="Logo" />
                    <div className="menu">
                        <img src={assets.menu_icon} alt="Menu Icon" />
                        <div className="sub-menu">
                            <p onClick={() => navigate('/profile')}>Edit Profile</p>
                            <hr />
                            <p>Logout</p>
                        </div>
                    </div>
                </div>
                <div className="ls-search">
                    <img src={assets.search_icon} alt="Search Icon" />
                    <input type="text" placeholder='Search here' onChange={inputHandler} />
                    {isLoading && <div className="loading-indicator">Loading...</div>}
                </div>
            </div>
            <div className="ls-list">
                {showSearch && user ? (
                    <div className='friends add-user' onClick={handleUserSelect}>
                        <img src={user.avatar} alt="User Avatar" />
                        <p>{user.name}</p>
                    </div>
                ) : (
                    chatData.map((item, index) => (
                        <div onClick={() => setChat(item)} key={index} className="friends">
                            <img src={item.userData.avatar} alt="Profile" />
                            <div>
                                <p>{item.userData.name}</p>
                                <span>{item.lastMessage}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default LeftSidebar;