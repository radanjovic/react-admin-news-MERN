import Input from "../UI/Input";
import ResetButton from "../UI/ResetButton";
import SubmitButton from "../UI/SubmitButton";

import useAxiosAuth from "../../hooks/useAxiosAuth";
import useInput from "../../hooks/useInput";
import useAuth from "../../hooks/useAuth";
import {useEffect, useState} from 'react';

import './Profile.css';
import './Info.css'
import LoadingSpinner from "../UI/LoadingSpinner";

const Info = () => {
  const axiosAuth = useAxiosAuth();
  const {auth} = useAuth();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [scs, setScs] = useState(null);
  const [loading, setLoading] = useState(true);

  const [country, setCountry] = useState('');

  const {
    value: bio,
    setValue: setBio,
    hasError: bioError,
    isValid: bioIsValid,
    handleChange: bioChange,
    handleBlur: bioBlur,
    reset: bioReset
  } = useInput(value => value.length > 0);

  const {
    value: dob,
    setValue: setDob,
    hasError: dobError,
    isValid: dobIsValid,
    handleChange: dobChange,
    handleBlur: dobBlur,
    reset: dobReset
  } = useInput(value => (value.length === 10) && (+(value.replaceAll('.', ''))));

  const {
    value: site,
    setValue: setSite,
    hasError: siteError,
    isValid: siteIsValid,
    handleChange: siteChange,
    handleBlur: siteBlur,
    reset: siteReset
  } = useInput(value => value.startsWith('http'));

  const {
    value: phone,
    setValue: setPhone,
    hasError: phoneError,
    isValid: phoneIsValid,
    handleChange: phoneChange,
    handleBlur: phoneBlur,
    reset: phoneReset
  } = useInput(value => (value.replace(/\s/g, '').length === 10) && (+(value.replace(/\s/g, ''))));

  useEffect(() => {
    let isMounted = true;
    const getUserInfo = async() => {
      try {
        const response = await axiosAuth.get(`/profile/info/${auth?.user?.id}`);
        response?.data?.error && setErr(response.data.error);
        const user = response?.data;
        setBio(user.bio || '');
        setDob(user.dateOfBirth || '');
        setCountry(user.country || '');
        setSite(user.website || '');
        setPhone(user.phone || '');
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

    setErr(null);
    setScs(null);

    if (bio === '' && dob === '' && site === '' && phone === '' && (country === '' || country === 'none')) {
      return;
    }

    if (dob !== '' && !((dob.length === 10) && (+(dob.replaceAll('.', ''))))) {
      setErr('Wrong format for Date of Birth!');
      return;
    }

    if (phone !== '' && !((phone.replace(/\s/g, '').length === 10) && (+(phone.replace(/\s/g, ''))))) {
      setErr('Wrong format for Phone Number');
      return;
    }

    setMsg('Submitting...');
    

    let obj = {};

    dob !== '' && (obj.dob = dob);
    bio !== '' && (obj.bio = bio);
    site !== '' && (obj.site = site);
    phone !== '' && (obj.phone = phone);
    (country !== '' && country !== 'none') && (obj.country = country);

    try {
      const response = await axiosAuth.post(`/profile/info/${auth?.user?.id}`, JSON.stringify(obj));
      setMsg(null);
      response?.data?.error && setErr(response.data.error);
      response?.data?.message && setScs(response.data.message);
      setTimeout(() => {
        setMsg(null);
        setErr(null);
        setScs(null);
        // reset();
    }, 2000);
    } catch(err) {
      setErr(err.message);
    }
  }

  const reset = () => {
    bioReset();
    dobReset();
    siteReset();
    phoneReset();
    bioReset();
    setCountry('');
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="profileSection">
      <form onSubmit={handleSubmit}>
      <h3>Information</h3>
        <div id="profileSectionBioInfo">
          <label htmlFor="bio">Bio</label>
          <textarea id='bio' placeholder="Enter Your Bio Data..." value={bio} onChange={bioChange} onBlur={bioBlur} className={`${bioIsValid && 'validInput'}  ${bioError && 'invalidInput'}`} />
        </div>

        <div>
          <div>
            <Input label='Birth date' type='text' value={dob} placeholder='DD.MM.YYYY' onChange={dobChange} onBlur={dobBlur} valid={dobIsValid} error={dobError} />
          </div>
          <div>
          <div id="profileSectionCountrySelector">
            <label htmlFor='country'>Country</label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className={`${country !== 'none' && country !== '' && 'validInput'}`} id="country" name="country">
              {/* 3 options just as demo */}
              <option value='none'>---</option>
              <option value="USA">USA</option>
              <option value="BIH">BIH</option>
              <option value="Other">Other</option>
            </select>
        </div>
          </div>
        </div>

        <div>
          <div>
            <Input label='Website' type='url' value={site} placeholder='https://trendy.solutions' onChange={siteChange} onBlur={siteBlur} valid={siteIsValid} error={siteError} />
          </div>
          <div>
            <Input label='Phone' type='tel' value={phone} placeholder='855 154 3547' onChange={phoneChange} onBlur={phoneBlur} valid={phoneIsValid} error={phoneError} />
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

export default Info