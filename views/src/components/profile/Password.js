import Input from "../UI/Input";
import ResetButton from "../UI/ResetButton";
import SubmitButton from "../UI/SubmitButton";

import useAxiosAuth from "../../hooks/useAxiosAuth";
import useInput from "../../hooks/useInput";
import useAuth from "../../hooks/useAuth";
import {useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
  

import './Profile.css';

const Password = () => {
  const axiosAuth = useAxiosAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const {auth} = useAuth();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [scs, setScs] = useState(null);

  const {
    value: oldPw,
    hasError: oldPwError,
    isValid: oldPwIsValid,
    handleChange: oldPwChange,
    handleBlur: oldPwBlur,
    reset: oldPwReset
  } = useInput(value => value.length > 4);

  const {
    value: newPw,
    hasError: newPwError,
    isValid: newPwIsValid,
    handleChange: newPwChange,
    handleBlur: newPwBlur,
    reset: newPwReset
  } = useInput(value => value.length > 4);

  const {
    value: rptPw,
    hasError: rptPwError,
    isValid: rptPwIsValid,
    handleChange: rptPwChange,
    handleBlur: rptPwBlur,
    reset: rptPwReset
  } = useInput(value => value.length > 4);

  const handleSubmit = async(e) => {
    e.preventDefault();

    // Validation 1
    if (oldPw === '' || newPw === '' || rptPw === '' || !oldPw || !newPw || !rptPw) {
      setErr('All fields are required!');
      return;
    }
    // Validation 2
    if (oldPw.length < 5 || newPw.length < 5 || rptPw.length < 5) {
      setErr('Passwords must be at least 5 characters long!');
      return;
    }
    // Validation 3
    if (oldPw === newPw) {
      setErr('New password cannot be the same as old password');
      return;
    }
    // Validation 4
    if (newPw !== rptPw) {
      setMsg(null);
      setErr('Passwords must match!');
      return;
    }

    setMsg('Submitting...');
    setErr(null);
    setScs(null);

    let obj = {
      oldPw,
      newPw,
      rptPw
    }

    try {
      const response = await axiosAuth.post(`/profile/password/${auth?.user?.id}`, JSON.stringify(obj));
      setMsg(null);
      console.log(response.data);
      response?.data?.error && setErr(response.data.error);
      response?.data?.message && setScs(response.data.message);
      setTimeout(() => {
        setMsg(null);
        setErr(null);
        setScs(null);
        reset();
    }, 2000);
    } catch(err) {
      setErr(err.message);
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  const reset = () => {
    oldPwReset();
    newPwReset();
    rptPwReset();
    
  }

  return (
    <section className="profileSection">
      <form onSubmit={handleSubmit}>
      <h3>Change Password</h3>

        <div>
          <div>
          <Input label='Old Password' type='password' value={oldPw} placeholder='Old Password' onChange={oldPwChange} onBlur={oldPwBlur} valid={oldPwIsValid} error={oldPwError} />
          </div>
          <div>
            
          </div>
        </div>

        <div>
          <div>
          <Input label='New Password' type='password' value={newPw} placeholder='New Password' onChange={newPwChange} onBlur={newPwBlur} valid={newPwIsValid} error={newPwError} />
          </div>
          <div>
          <Input label='Retype New Password' type='password' value={rptPw} placeholder='Repeat New Password' onChange={rptPwChange} onBlur={rptPwBlur} valid={rptPwIsValid} error={rptPwError} />
          </div>
        </div>
        <span>
          <ResetButton onClick={reset} />
          <SubmitButton />
          {msg && <small className="submittingMessage">{msg}</small>}
          {err && <small className="errorMessage">{err}</small>}
          {scs && <small className="successMessage">{scs}</small>}
        </span>
      </form>
    </section>
  )
}

export default Password