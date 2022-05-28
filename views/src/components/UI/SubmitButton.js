import {BsCheckLg} from 'react-icons/bs';
import './SubmitButton.css';

const SubmitButton = () => {
  return (
    <button className='submitButton' type='submit'><BsCheckLg className='checkIcon' /> Save Changes</button>
  )
}

export default SubmitButton