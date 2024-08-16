import { useEffect, useState } from 'react';
import assets from '../../assets/assets';
import './ProfileUpdate.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import upload from '../../lib/upload';

//Aqui se inicializan los estados del componente
const ProfileUpdate = () => {
    const navigate = useNavigate();
    const [image, setImage] = useState(null);
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [uid, setUid] = useState("");
    const [prevImage, setPrevImage] = useState("");

    const profileUpdate = async (event) => {
        event.preventDefault(); //previene que el formulario se envie de manera estandar
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
            toast.success("Profile updated successfully");
        } catch {
            toast.error("Failed to update profile");
        }
    };
    //Carga de datos del usuario
    useEffect(() => {
        onAuthStateChanged(auth, async (user) => { //detecta si el usuario está autenticado.
            if (user) {
                setUid(user.uid);
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) { //Si el usuario está autenticado, se cargan los datos de su perfil desde Firestore y se llenan los campos correspondientes.
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
    //Renderizado del Componente
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
            </div>
        </div>
    );
};

export default ProfileUpdate;


