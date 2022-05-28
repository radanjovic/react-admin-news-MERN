import {Outlet, NavLink} from 'react-router-dom';
import './ProfileLayout.css';

import {BsPerson} from 'react-icons/bs';
import {BiLock, BiInfoCircle, BiLinkAlt} from 'react-icons/bi';

const ProfileLayout = () => {
  return (
    <section id='profileSection'>
      <div className='profileSidebar'>
        <h2>Account Settings</h2>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeProfileLink' : undefined} to='/profile/general'><BsPerson className='profileIcons'/> General</NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeProfileLink' : undefined} to='/profile/password'><BiLock className='profileIcons' /> Change Password</NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeProfileLink' : undefined} to='/profile/information'><BiInfoCircle className='profileIcons' /> Information</NavLink>
        <NavLink className={({ isActive }) =>
              isActive ? 'activeProfileLink' : undefined} to='/profile/social'><BiLinkAlt className='profileIcons' /> Social</NavLink>
      </div>

      <div className='profileSectionContent'>
        <Outlet />
      </div>
    </section>
  )
}

export default ProfileLayout