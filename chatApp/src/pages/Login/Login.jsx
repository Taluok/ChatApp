import './Login.css';
import assets from '../../assets/assets.js';
import { useState } from 'react';
import { signup, login, resetPass } from '../../config/firebase.js';

const Login = () => {

    const [currState, setCurrState] = useState("Sign Up");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const onSubmitHandler = (event) => {
        event.preventDefault();
        if (currState === "Sign Up") {
            signup(userName, email, password);
        } else {
            login(email, password);
        }
    }

    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className='logo'/>
            <form onSubmit={onSubmitHandler} action="" className='login-form'>
                <h2>{currState}</h2>
                {currState === "Sign Up" && (
                    <input
                        onChange={(e) => setUserName(e.target.value)}
                        value={userName}
                        type="text"
                        placeholder='Username'
                        className="form-input"
                        required
                    />
                )}
                <input
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    type="email"
                    placeholder='Email address'
                    className="form-input"
                    required
                />
                <input
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    type="password"
                    placeholder='Password'
                    className="form-input"
                    required
                />
                <button type='submit'>
                    {currState === "Sign Up" ? "Create Account" : "Login Now"}
                </button>
                <div className="login-term">
                    <input type="checkbox" required/>
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>
                <div className="login-forgot">
                    {currState === "Sign Up" ? (
                        <p className="login-toggle">
                            Already have an account?{" "}
                            <span onClick={() => setCurrState("Login")}>Click here</span>
                        </p>
                    ) : (
                        <p className="login-toggle">
                            Create an account{" "}
                            <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                        </p>
                    )}
                    {currState === "Login" ?<p className="login-toggle"> Forgot Password ?<span onClick={() => resetPass(email)}>Reset here</span></p> :null }
                </div>
            </form>
        </div>
    );
}

export default Login;
