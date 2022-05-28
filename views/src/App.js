import { Routes, Route} from 'react-router-dom';
import Layout from './components/layout/Layout';
import RequireAuth from './components/auth/RequireAuth';
import PersistLogin from './components/auth/PersistLogin';
import MainLayout from './components/layout/MainLayout';
import NewsLayout from './components/layout/NewsLayout';
import ProfileLayout from './components/layout/ProfileLayout';

import Login from './components/auth/Login';

import NewsList from './components/news/NewsList';
import AddNew from './components/news/AddNew';
import EditNews from './components/news/EditNews';

import General from './components/profile/General';
import Password from './components/profile/Password';
import Info from './components/profile/Info';
import Social from './components/profile/Social';

import Page404 from './components/404/404';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        {/* Public */}
        <Route path='login' element={<Login />} />

        {/* Protected */}
        <Route element={<PersistLogin />}>
          <Route element={<RequireAuth />}>
            <Route element={<MainLayout />}>
              {/* News/posts */}
              <Route path='/' element={<NewsLayout />}>
                <Route path='/' element={<NewsList />} />
                <Route path='/new' element={<AddNew />} />
                <Route path='/edit/:newsId' element={<EditNews />} />
              </Route>
              {/* Profile settings */}
              <Route path='/profile' element={<ProfileLayout />}>
                <Route path='/profile/general' element={<General />} />
                <Route path='/profile/password' element={<Password />} />
                <Route path='/profile/information' element={<Info />} />
                <Route path='/profile/social' element={<Social />} />
              </Route>
            </Route>
          </Route>
        </Route>
        
        {/* Catch all */}
        <Route path='*' element={<Page404 />} />
      </Route>
    </Routes>
  );
}

export default App;
