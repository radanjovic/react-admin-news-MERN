import Input from "../UI/Input";
import ResetButton from "../UI/ResetButton";
import SubmitButton from "../UI/SubmitButton";

import useAxiosAuth from "../../hooks/useAxiosAuth";
import useInput from "../../hooks/useInput";
import useAuth from "../../hooks/useAuth";
import {useEffect, useState} from 'react';

import './Profile.css';
import LoadingSpinner from "../UI/LoadingSpinner";

const Social = () => {
  const axiosAuth = useAxiosAuth();
  const {auth} = useAuth();
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [scs, setScs] = useState(null);
  const [loading, setLoading] = useState(true);

  const {
    value: fb,
    setValue: setFb,
    hasError: fbError,
    isValid: fbIsValid,
    handleChange: fbChange,
    handleBlur: fbBlur,
    reset: fbReset
  } = useInput(value => value.includes('facebook.com'));

  const {
    value: insta,
    setValue: setInsta,
    hasError: instaError,
    isValid: instaIsValid,
    handleChange: instaChange,
    handleBlur: instaBlur,
    reset: instaReset
  } = useInput(value => value.includes('instagram.com'));

  const {
    value: twt,
    setValue: setTwt,
    hasError: twtError,
    isValid: twtIsValid,
    handleChange: twtChange,
    handleBlur: twtBlur,
    reset: twtReset
  } = useInput(value => value.includes('twitter.com'));

  const {
    value: lin,
    setValue: setLin,
    hasError: linError,
    isValid: linIsValid,
    handleChange: linChange,
    handleBlur: linBlur,
    reset: linReset
  } = useInput(value => value.includes('linkedin.com'));

  useEffect(() => {
    let isMounted = true;
    const getUserInfo = async() => {
      try {
        const response = await axiosAuth.get(`/profile/social/${auth?.user?.id}`);
        response?.data?.error && setErr(response.data.error);
        const user = response.data;
        setFb(user.facebook || '');
        setInsta(user.instagram || '');
        setLin(user.linkedin || '');
        setTwt(user.twitter || '');
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

    if (fb === '' && insta === '' && twt === '' && lin === '') {
      return;
    }

    setMsg('Submitting...');
    setErr(null);
    setScs(null);

    let obj = {};

    fb !== '' && (obj.fb = fb);
    insta !== '' && (obj.insta = insta);
    twt !== '' && (obj.twt = twt);
    lin !== '' && (obj.lin = lin);

    try {
      const response = await axiosAuth.post(`/profile/social/${auth?.user?.id}`, JSON.stringify(obj));
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
    fbReset();
    instaReset();
    twtReset();
    linReset();
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <section className="profileSection">
      <form onSubmit={handleSubmit}>
      <h3>Social</h3>
        <div>
          <div>
            <Input label='Facebook' type='url' value={fb} placeholder='Add Link' onChange={fbChange} onBlur={fbBlur} valid={fbIsValid} error={fbError} />
          </div>
          <div>
            <Input label='Instagram' type='url' value={insta} placeholder='Add Link' onChange={instaChange} onBlur={instaBlur} valid={instaIsValid} error={instaError} />
          </div>
        </div>

        <div>
          <div>
            <Input label='Twitter' type='url' value={twt} placeholder='Add Link' onChange={twtChange} onBlur={twtBlur} valid={twtIsValid} error={twtError} />
          </div>
          <div>
            <Input label='LinkedIn' type='url' value={lin} placeholder='Add Link' onChange={linChange} onBlur={linBlur} valid={linIsValid} error={linError} />
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

export default Social