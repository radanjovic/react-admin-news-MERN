import {Outlet} from 'react-router-dom';
import './MainLayout.css';

import Sidebar from '../sidebar/Sidebar';
import Header from '../header/Header';

const MainLayout = () => {
  return (
    <article className='mainLayout'>
        <section id='sidebar'>
            <Sidebar />
        </section>
        <section id='content'>
          <Header />
          <div>
            <Outlet />
          </div>
        </section>
    </article>
  )
}

export default MainLayout