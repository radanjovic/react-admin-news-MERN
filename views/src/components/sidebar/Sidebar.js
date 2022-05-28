import {useState} from 'react';
import {NavLink, useLocation} from 'react-router-dom';

import NewsIcon from '../icons/NewsIcon';
import ProfileIcon from '../icons/ProfileIcon';
import {IoIosArrowDown} from 'react-icons/io';

import './Sidebar.css';

const Sidebar = () => {
    const [showNews, setShowNews] = useState(true);
    const [showProfile, setShowProfile] = useState(true);
    const location = useLocation();
    const path = location.pathname;

    const toggleNews = () => {
        setShowNews(prev => !prev);
    }
    const toggleProfile = () => {
        setShowProfile(prev => !prev);
    }

  return (
    <div className='sidebarDiv'>
        <h1>DEMO<span>admin</span></h1>
        <div className={`sidebarDivContainer ${!showNews && 'newsPadding'}`} onClick={toggleNews} >
            <div className='sidebarIconTitleGroup'>
                <NewsIcon fill={path === '/' || path === '/new' ? '#5561B3' : '#6d7587'} />
                <h2>News</h2>
            </div>
            <IoIosArrowDown className='sidebarArrowDown' />
        </div>
        {showNews && <ul>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/'>News List</NavLink></li>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/new'>Add News</NavLink></li>
        </ul>}
        <div className='sidebarDivContainer' onClick={toggleProfile}>
            <div className='sidebarIconTitleGroup'>
                <ProfileIcon fill={path.includes('/profile') ? '#5561B3' : '#6d7587'} />
                <h2>Profile</h2>
            </div>
            <IoIosArrowDown className='sidebarArrowDown' />
        </div>
        {showProfile && <ul>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/profile/general'>General Settings</NavLink></li>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/profile/password'>Change Password</NavLink></li>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/profile/information'>Information</NavLink></li>
            <li><NavLink style={({isActive}) => isActive ? {color: '#5561B3'} : undefined} to='/profile/social'>Social</NavLink></li>
        </ul>}
    </div>
  )
}

export default Sidebar