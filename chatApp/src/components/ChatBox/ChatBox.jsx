import './ChatBox.css';
import assets from '../../assets/assets.js';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { doc, updateDoc, arrayUnion, getDoc, onSnapshot } from 'firebase/firestore'; 
import { toast } from 'react-toastify'; 
import { db } from '../../firebase'; 

const ChatBox = () => {
    const { userData, messagesId, chatUser, messages, setMessages } = useContext(AppContext);
    const [input, setInput] = useState("");

    const sendMessage = async () => {
        try {
            if (input && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        text: input,
                        createAt: new Date()
                    })
                });

                const userIDs = [chatUser.rId, userData.id];

                userIDs.forEach(async (id) => {
                    const userChatsRef = doc(db, 'chats', id);
                    const userChatSnapshot = await getDoc(userChatsRef);

                    if (userChatSnapshot.exists()) {
                        const userChatData = userChatSnapshot.data();
                        const chatIndex = userChatData.chatsData.findIndex((c) => c.messagId === messagesId);
                        userChatData.chatsData[chatIndex].lastMessage = input.slice(0, 30);
                        userChatData.chatsData[chatIndex].UpdateAt = Date.now();
                        
                        if (userChatData.chatsData[chatIndex].rId === userData.id) {
                            userChatData.chatsData[chatIndex].messageSeen = false;
                        }
                        
                        await updateDoc(userChatsRef, {
                            chatsData: userChatData.chatsData
                        });
                    }
                });
                setInput(""); 
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        if (messagesId) {
            const unSub = onSnapshot(doc(db, 'messages', messagesId), (res) => {
                setMessages(res.data().messages.reverse());
            });
            return () => {
                unSub();
            };
        }
    }, [messagesId, setMessages]); 

    return chatUser ? (
        <div className="chat-box">
            <div className="chat-user">
                <img src={chatUser.userData.avatar} alt={chatUser.userData.name} />
                <p>{chatUser.userData.name} <img className='dot' src={assets.green_dot} alt="Online" /></p>
                <img src={assets.help_icon} className='help' alt="Help" />
            </div>

            <div className="chat-msg">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sId === userData.id ? "r-msg" : "s-msg"}>
                        <p className="msg">{msg.text}</p>
                        <div>
                            <img src={assets.profile_img} alt={userData.name} />
                            <p>{new Date(msg.createAt).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="chat-input">
                <input 
                    onChange={(e) => setInput(e.target.value)} 
                    value={input} 
                    type="text" 
                    className="text" 
                    placeholder='Send a message' 
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()} 
                />
                <input type="file" id='image' accept='image/png, image/jpeg' hidden />
                <img 
                    src={assets.send_button} 
                    alt="Send" 
                    onClick={sendMessage} 
                />
            </div>
        </div>
    ) : (
        <div className='chat-welcome'>
            <img src={assets.logo_icon} alt='Chat Logo' />
            <p>Chat anytime, anywhere</p>
        </div>
    );
}

export default ChatBox;

