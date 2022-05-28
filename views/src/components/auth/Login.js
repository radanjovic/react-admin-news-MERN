// import {} from 'react';
import useAuth from "../../hooks/useAuth";
import useInput from "../../hooks/useInput";
import useInputWithLocalStorage from '../../hooks/useInputWithLocalStorage';
import useToggle from "../../hooks/useToggle";
import { useNavigate, useLocation} from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "../../axios";

import './Login.css';

const Login = () => {
    const {setAuth} = useAuth();
    const [check, toggleCheck] = useToggle('persist', true);
    const [formErrorMsg, setFormErrMsg] = useState(null);
    const {
        value: username,
        hasError: usernameError,
        isValid: usernameIsValid,
        handleChange: usernameChange,
        handleBlur: usernameBlur,
        reset: usernameReset
    } = useInputWithLocalStorage('username', '', value => value.length > 2);

    const {
        value: password,
        hasError: passwordError,
        isValid: passwordIsValid,
        handleChange: passwordChange,
        handleBlur: passwordBlur,
        reset: passwordReset
    } = useInput(value => value.length > 4);

    const navigate = useNavigate();
    const location = useLocation();
    // If user was redirected to login, remember from where he was redirected to send
    // them back there, after they log in
    const from = location.state?.from?.pathname || '/';


    const handleSubmit = async(e) => {
        e.preventDefault();
        // Try login
        try {
            const response = await axios.post('/login', JSON.stringify({username, password}), {
                headers: {"Content-Type": "application/json"},
                withCredentials: true
            });
            // Save token and user for usage in app
            const accessToken = response?.data?.accessToken;
            const user = response?.data?.user;
            setAuth({accessToken, user});
            usernameReset();
            passwordReset();
            navigate(from, {replace: true});
        } catch(err) {
            if (err.response?.status === 400) {
                setFormErrMsg('Missing Username and/or Password');
            } else if (err.response?.status === 401) {
                setFormErrMsg('Wrong Username and/or Password');
            } else {
                setFormErrMsg('Login Failed');
            }
        }
    }

    // After error message, if user starts editing fields, remove error message
    useEffect(() => {
        if (formErrorMsg) {
            setFormErrMsg(null);
        }
    }, [username, password]);


    // Validation for login button
    let formIsValid = false;
    if (usernameIsValid && passwordIsValid) {
        formIsValid = true;
    }


    return (
        <section className="loginSection">
            <form onSubmit={handleSubmit} className='loginForm'>
                <div className="loginFormContainer">
                    <h1>DEMO<span>admin</span></h1>
                    {formErrorMsg && <p className="loginFormError">{formErrorMsg}</p>}
                    <input type='text' placeholder="Username" autoComplete="off" required id='username' value={username} onChange={usernameChange} onBlur={usernameBlur} className={`${usernameIsValid && 'validInput'}  ${usernameError && 'invalidInput'}`} />
                    {/* {usernameError && <p className="inputError">Username must be at least 3 characters long!</p>} */}
                    <input type='password' placeholder="Password" required id='password' value={password} onChange={passwordChange} onBlur={passwordBlur} className={`${passwordIsValid && 'validInput'}  ${passwordError && 'invalidInput'}`} />
                    {/* {passwordError && <p className="inputError">Password must be at least 5 characters long!</p>} */}
                    <label className="loginFormCheckboxDiv">
                        <input className="checkbox" type='checkbox' id='persist' onChange={toggleCheck} checked={check} />
                        <span className="checkmark"></span><span className="checkboxText">Remember Me</span>
                    </label>
                     <button disabled={!formIsValid} type='submit'>Log In</button>
                    <div style={{visibility: !usernameError ? 'hidden' : 'visible'}} className="usernameIsInvalidDiv invalidDivs">Username must have at least 3 characters</div>
                    <div style={{visibility: !passwordError ? 'hidden' : 'visible'}} className="passwordIsInvalidDiv invalidDivs">Password must have at least 5 characters</div>
                </div>
            </form>
        </section>
    )
}

export default Login
