import {Outlet} from 'react-router-dom';

const NewsLayout = () => {
  return (
    <section id='newsSection'><Outlet /></section>
  )
}

export default NewsLayout