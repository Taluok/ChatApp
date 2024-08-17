import './Chat.css';
import LeftSidebar from '../../components/LeftSidebar/LeftSidebar';
import ChatBox from '../../components/ChatBox/ChatBox';
import RighSidebar from '../../components/RigthSidebar/RigthSidebar';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect, useState } from 'react';

const Chat = () => {
    const { chatData, userData } = useContext(AppContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (chatData && userData) {
            setLoading(false);
        }
    }, [chatData, userData]);

    return (
        <div className='chat'>
            {
                loading
                    ? <p className='loading'>Loading...</p>
                    : <div className="chat-container">
                        <LeftSidebar />
                        <ChatBox />
                        <RighSidebar />
                    </div>
            }
        </div>
    );
}

export default Chat;