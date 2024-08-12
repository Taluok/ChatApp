import './Login.css';
import assets from '../../assets/assets.js';
import { useState } from 'react';

const Login = () => {

    const [currState,setCurrState,] = useState("Sign Up");

    return (
        <div className='login'>
            <img src={assets.logo_big} alt="" className='logo'/>
            <form action="" className='login-form'>
                <h2>{currState}</h2>
                {currState === "Sign Up"? <input type="text" placeholder='username' className="form-input" required/>:null}
                <input type="email" placeholder='Email address' className="form-input" />
                <input type="password" placeholder='password' className="form-input" />
                <button type='submit'>{currState === "Sign Up"?"Create Account":"Login now"}</button>
                <div className="login-term">
                    <input type="checkbox" />
                    <p>Agree to the terms of use & privacy policy.</p>
                </div>
                <div className="login-forgot">
                    {
                        currState === "Sign up"
                        ? <p className="login-toggle">Already have an account <span onClick={()=>setCurrState("Login")}>click here</span></p>
                        : <p className="login-toggle">Create an account <span onClick={()=>setCurrState("Sign Up")}>Click here</span></p>
                    }
                </div>
            </form>
        </div>
    )
}

export default Login