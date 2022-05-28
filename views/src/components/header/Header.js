import { useState } from 'react';
import {useNavigate} from 'react-router-dom'

import './Header.css';

import useAuth from '../../hooks/useAuth';
import useLogout from '../../hooks/useLogout';

// import photo from '../../assets/pic.jpg';

import MenuIcon from '../icons/MenuIcon';
import HeadsetIcon from '../icons/HeadsetIcon';
import BellIcon from '../icons/BellIcon';
import SeparatorIcon from '../icons/SeparatorIcon';
import OnlineIcon from '../icons/OnlineIcon';
import {BsThreeDotsVertical} from 'react-icons/bs';

const Header = () => {
    const {auth} = useAuth();
    const logout = useLogout();
    const navigate = useNavigate();
    const [showSignOut, setShowSignOut] = useState(false);

    const toggleSignOut = () => {
        setShowSignOut(prev => !prev);
    }

    const signOut = async() => {
        await logout();
        navigate('/login');
    }

  return (<div style={{position: 'relative', marginBottom: '50px'}}>
    <div id='header'>
        <div className='menuIconDiv'>
            <MenuIcon />
        </div>

        <div className='headerContent'>
            <input id='searchInput' type='text' placeholder='Search something...' />
            <div className='headerContentDiv'>
                <HeadsetIcon />
                <BellIcon />
            </div>
            <SeparatorIcon />
            <div className='headerContentDiv'>
                <p className='headerName'>{auth?.user?.name}</p>
                <div className='headerImage'>
                    <img src={auth?.user?.image} alt='profile pic' />
                    <OnlineIcon />
                </div>
                    <BsThreeDotsVertical className='headerDots' onClick={toggleSignOut} />
            </div>
        </div>
    </div>
    {showSignOut && <div onClick={signOut} className='signOutDiv'>Sign Out</div>}
    </div>
  )
}

export default Header