import './ChatBox.css';
import assets from '../../assets/assets.js';
import { useContext, useState, useEffect } from 'react';
import { AppContext } from '../../context/AppContext';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { toast } from 'react-toastify';
import { db } from '../../config/firebase.js';
import upload from '../../lib/upload'; // Asegúrate de que esta ruta sea correcta

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
                        createdAt: new Date()
                    })
                });

                setInput("");
            }
        } catch (error) {
            toast.error(error.message);
        }
    };

    const sendImage = async (e) => {
        try {
            const fileUrl = await upload(e.target.files[0]);
            if (fileUrl && messagesId) {
                await updateDoc(doc(db, 'messages', messagesId), {
                    messages: arrayUnion({
                        sId: userData.id,
                        image: fileUrl,
                        createdAt: new Date()
                    })
                });
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

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
                        {msg.image ? (
                            <img className='msg-img' src={msg.image} alt="Sent" />
                        ) : (
                            <p className='msg'>{msg.text}</p>
                        )}
                        <div>
                            <img src={msg.sId === userData.id ? userData.avatar : chatUser.userData.avatar} alt={userData.name} />
                            <p>{new Date(msg.createdAt).toLocaleTimeString()}</p>
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
                <input type="file" id='image' accept='image/png, image/jpeg' hidden onChange={sendImage} />
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