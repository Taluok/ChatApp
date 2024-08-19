import './RightSidebar.css';
import assets from '../../assets/assets';
import { logout } from '../../config/firebase';
import { AppContext } from '../../context/AppContext';
import { useContext, useEffect } from 'react';

const RightSidebar = () => {
    const { chatUser, messages } = useContext(AppContext);

    useEffect(() => {
        let tempVar = [];
        messages.forEach((msg) => {
            if (msg.image) {
                tempVar.push(msg.image);
            }
        });
        // Aquí podrías hacer algo con tempVar si es necesario
    }, [messages]);

    return chatUser ? (
        <div className="rs">
            <div className="rs-profile">
                <img src={assets.profile_img} alt="Profile" />
                <h3>{Date.now() - chatUser.userData.lastSeen <= 70000 ? <img src={assets.green_dot} className='dot' alt="Online"/> : null}{chatUser.userData.name}</h3>
                <p>{chatUser.userData.bio}</p>
            </div>
            <hr />
            <div className="rs-media">
                <p>Media</p>
                <div>
                    {messages.map((msg, index) => msg.image && (
                        <img key={index} src={msg.image} alt={`Media ${index}`} />
                    ))}
                </div>
            </div>
            <button onClick={logout}>Logout</button>
        </div>
    ) : null; // Retorna null si no hay chatUser
};

export default RightSidebar;
