import './LeftSidebar.css'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const LeftSidebar = () => {

    const navigate = useNavigate();
    const {userData} = useContext(AppContext)
    const [user, setUser] = useState(null);
    const [showSearch, setShowSearch] = useState(false);

    const inputHandler = async (e) => {
        try {
            const input = e.target.value; //obtiene el valor del campo de entrada y lo convierte en minuscula
            const userRef = collection(db, 'users'); //Hace una consulta a la colección "users" en la base de datos db utilizando el valor del campo de entrada como filtro para buscar un usuario con el mismo nombre de usuario.
            const q = query(userRef, where("username", "==", input.toLowerCase()));
            const querySnap = await getDocs(q);
            
            if (!querySnap.empty && querySnap.docs[0].data().id !== userData.id) {
                let userExist = chatData.some(user => user.rId === querySnap.docs[0].data().id);
                
                if (!userExist) {
                    setUser(querySnap.docs[0].data());
                }
            } else {
                setShowSearch(false);
            }
        } catch (err) {
            console.error("Error fetching user data:", err); 
        }
    };

    const addChat = async () => {
        const messageRef = collection(db,"messages");
        const chatsRef = collection(db,"chats");
        try{
            const newMessageRef = doc(messagesRef);
            await setDoc(newMessageRef,{
                createAt: arrayUnion({
                    messageId:newMessageRef.id,
                    lastMessage:"",
                    rId:userData.id,
                    updatedAt:Date.now(),
                    messageSeen: true
                })
            })
        }catch (err){

        }
    }

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
                    <input type="text" placeholder='Search here' />
                </div>
            </div>
            <div className="ls-list">
                {showSearch && user ? (
                    <div className='friends add-user'>
                        <img src={user.avatar} alt="User Avatar" />
                        <p>{user.name}</p>
                    </div>
                ) : (
                    Array(12).fill("").map((item, index) => (
                        <div key={index} className="friends">
                            <img src={assets.profile_img} alt="Profile" />
                            <div>
                                <p>Martin Stanford</p>
                                <span>Hi!, How are you?</span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );

export default LeftSidebar
