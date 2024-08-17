import { useContext, useEffect, useState } from 'react';
import assets from '../../assets/assets';
import './ProfileUpdate.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { AppContext } from '../../context/AppContext';  // Importación añadida
import upload from '../../lib/upload';

// Aquí se inicializan los estados del componente
const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImage, setPrevImage] = useState("");
    const { setUserData } = useContext(AppContext); // Añadido el contexto para actualizar datos de usuario

    // Función que gestiona la actualización del perfil de usuario
    const profileUpdate = async (event) => {
        event.preventDefault(); // Prevenir que el formulario se envíe de manera estándar
        try {
            if (!prevImage && !image) {
                toast.error("Upload profile picture failed");
                return;
            }

            const docRef = doc(db, 'users', uid);
            if (image) {
                const imgUrl = await upload(image);
                setPrevImage(imgUrl);
                await updateDoc(docRef, {
                    avatar: imgUrl,
                    bio: bio,
                    name: name
                });
            } else {
                await updateDoc(docRef, {
                    bio: bio,
                    name: name
                });
            }
            const snap = await getDoc(docRef);
            setUserData(snap.data());
            navigate('/chat');
        } catch (err) {
            toast.error("Failed to update profile");
            console.error(err); // Manejo de error mejorado
        }
    };

    // Carga de datos del usuario
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => { // Detectar si el usuario está autenticado
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) { // Si el usuario está autenticado, se cargan los datos de su perfil desde Firestore y se llenan los campos correspondientes
                    const data = docSnap.data();
                    setName(data.name || "");
                    setBio(data.bio || "");
                    setPrevImage(data.avatar || "");
                }
            } else {
                navigate('/'); // Si no hay un usuario autenticado, se redirige a la página de inicio
            }
        });
    }, [navigate]);

    // Renderizado del Componente
    return (
        <div className="profile">
            <div className="profile-container">
                <form onSubmit={profileUpdate}>
                    <h3>Profile Details</h3>
                    <label htmlFor="avatar">
                        <input
                            onChange={(e) => setImage(e.target.files[0])}
                            type="file"
                            id="avatar"
                            accept=".png, .jpg, .jpeg"
                            hidden
                        />
                        <img
                            src={image ? URL.createObjectURL(image) : prevImage || assets.avatar_icon}
                            alt="Avatar"
                        />
                        Upload profile image
                    </label>
                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder="Your name"
                        required
                    />
                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        placeholder="Write profile bio"
                        required
                    ></textarea>
                    <button type="submit">Save</button>
                </form>
                <img className='profile-pic' src={image?URL.createObjectURL(image) : prevImage ? prevImage : assets.logo_icon} alt="" />
            </div>
        </div>
    );
};

export default ProfileUpdate;



