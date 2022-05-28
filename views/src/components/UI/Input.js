import {useId} from 'react';
import './Input.css'

const Input = ({ label, type, placeholder, value, onChange, onBlur, valid, error}) => {
    const id = useId();
  return (
    <div className="customInput">
        <label htmlFor={id}>{label}</label>
        <input className={`${valid && 'validInput'}  ${error && 'invalidInput'}`} autoComplete="off" type={type} placeholder={placeholder} value={value} onChange={onChange} onBlur={onBlur} />
    </div>
  )
}

export default Input