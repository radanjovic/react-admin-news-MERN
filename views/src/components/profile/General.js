import Input from "../UI/Input";
import ResetButton from "../UI/ResetButton";
import SubmitButton from "../UI/SubmitButton";
import LoadingSpinner from '../UI/LoadingSpinner';
import UploadIcon from "../icons/UploadIcon";

import useAxiosAuth from "../../hooks/useAxiosAuth";
import useAxiosFile from '../../hooks/useAxiosFile';
import useInput from "../../hooks/useInput";
import useAuth from "../../hooks/useAuth";
import {useEffect, useState} from 'react';
import { useNavigate, useLocation } from "react-router-dom";
    
import './Profile.css';
import './General.css';


const General = () => {
  const axiosAuth = useAxiosAuth();
  const axiosFile = useAxiosFile();
  const navigate = useNavigate();
  const location = useLocation();
  const {auth, setAuth} = useAuth();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [scs, setScs] = useState(null);

  const [loading, setLoading] = useState(true);

  const [imageTemp, setImageTemp] = useState(null);
  const [image, setImage] = useState(null);

  const {
    value: username,
    setValue: setUsername,
    hasError: usernameError,
    isValid: usernameIsValid,
    handleChange: usernameChange,
    handleBlur: usernameBlur,
    reset: usernameReset
  } = useInput(value => value.length > 3);

  const {
    value: name,
    setValue: setName,
    hasError: nameError,
    isValid: nameIsValid,
    handleChange: nameChange,
    handleBlur: nameBlur,
    reset: nameReset
  } = useInput(value => value.split(' ').length >= 2);

  const {
    value: email,
    setValue: setEmail,
    hasError: emailError,
    isValid: emailIsValid,
    handleChange: emailChange,
    handleBlur: emailBlur,
    reset: emailReset
  } = useInput(value => value.includes('@') && value.includes('.'));

  const {
    value: company,
    setValue: setCompany,
    hasError: companyError,
    isValid: companyIsValid,
    handleChange: companyChange,
    handleBlur: companyBlur,
    reset: companyReset
  } = useInput(value => value);

  const reset = () => {
    setImage(null);
    setImageTemp(null);
    usernameReset();
    nameReset();
    emailReset();
    companyReset();
  }

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    const getUserInfo = async() => {
      try {
        const response = await axiosFile.get(`/profile/general/${auth?.user?.id}`);
        response?.data?.error && setErr(response.data.error);
        const user = response.data;
        setImage(user.image || null);
        setUsername(user.username || '');
        setName(user.name || '');
        setEmail(user.email || '');
        setCompany(user.company || '');
        setLoading(false);
      } catch(err) {
        setErr(err.message);
        setLoading(false);
      }
    }

    isMounted && getUserInfo();

    return () => isMounted = false;
  }, [auth?.user?.id]);

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (username === '' && name === '' && (image === '' || !image) && company === '' && email === '') {
      return;
    }

    if (username === auth?.user?.username) {
      setErr('New username must not be old username');
      return;
    }

    // Username validation
    if (username !== '' && username.length < 3) {
      setErr('Username must be at least 3 characters long!');
      return;
    };
    // Simple name validation
    if (name !== '' && (!(name.split(' ').length >= 2))) {
      setErr('Name is not in a valid form!');
      return;
    }

    if (image && image.size > 819200) {
      setErr('Image size too large!');
      return;
    }
    
    setMsg('Submitting...');
    setErr(null);
    setScs(null);
    
    let imgUrl = null;

    if (image) {
      try {
        const formData = new FormData();
        formData.append('image', image);
        const response = await axiosFile.post('file-upload/image', formData);
        response?.data?.error && setErr(response.data.error);
        imgUrl = response?.data?.url;
      } catch(err) {
        setMsg(null);
        setErr(err.message || 'Could not upload image!');
      }
      
    }

    let obj = {
      oldUsername: auth?.user?.username,
      oldName: auth?.user?.name,
      oldImage: auth?.user?.image,
    };


    username !== '' && (obj.username = username);
    name !== '' && (obj.name = name);
    imgUrl && (obj.image = imgUrl);
    email !== '' && (obj.email = email);
    company !== '' && (obj.company = company);

    try {
      const response = await axiosAuth.post(`/profile/general/${auth?.user?.id}`, JSON.stringify(obj));
      setMsg(null);
      response?.data?.error && setErr(response.data.error);
      response?.data?.message && setScs(response.data.message);
      setAuth(prev => ({
        ...prev,
        user: response?.data?.user
      }));
      setTimeout(() => {
        setMsg(null);
        setErr(null);
        setScs(null);
        // reset();
    }, 2000);
    } catch(err) {
      setErr(err.message);
      navigate('/login', { state: { from: location }, replace: true });
    }
  }

  const changeImage = (e) => {
    if (e.target.files && e.target.files[0]) {
      const img = e.target.files[0];
      setImageTemp(URL.createObjectURL(img));
      setImage(img);
    }
  }

  const resetImages = () => {
    setImage(null);
    setImageTemp(null);
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="profileSection" id='profileGeneralSection'>
      <form onSubmit={handleSubmit}>
      <h3>General Settings</h3>
        <div className="profileFormImageDiv">
          <div className="profileFormImageDivImageContainer">
            <img style={{width: '100px', height:'100px', objectFit:'cover'}} src={imageTemp ? imageTemp : auth?.user?.image} alt='profile pic' />
          </div>
          <div className="profileFormImageDivContentContainer">
            <div>
              <ResetButton onClick={resetImages} />
              <label id='uploadImageButton'> <input type='file' onChange={(e) => changeImage(e)} /> <UploadIcon/> Upload</label>
            </div>
            <p>Allowed JPG, GIF or PNG. Max size of 800kB</p>
          </div>
        </div>
        <div>
          <div>
            <Input label='Username' type='text' value={username} placeholder='johndoe' onChange={usernameChange} onBlur={usernameBlur} valid={usernameIsValid} error={usernameError}  />
          </div>
          <div>
            <Input label='Name' type='text' value={name} placeholder='John Doe' onChange={nameChange} onBlur={nameBlur} error={nameError} valid={nameIsValid}  />
          </div>
        </div>

        <div>
          <div>
            <Input label='E-mail' type='email' value={email} placeholder='johndoe5584@domain.com' onChange={emailChange} onBlur={emailBlur} valid={emailIsValid} error={emailError}  />
          </div>
          <div>
            <Input label='Company' type='text' value={company} placeholder='trendy.solutions' onChange={companyChange} onBlur={companyBlur} valid={companyIsValid} error={companyError}  />
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

export default General