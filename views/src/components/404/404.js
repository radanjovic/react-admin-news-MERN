import './404.css';
import {Link} from 'react-router-dom'

const Page404 = () => {
  return (
    <div className='notFoundPage'>
      <div>
        <p>404: Page Not Found!</p>
       <p>Go back <Link to='/'>home</Link></p>
      </div>
      
    </div>
  )
}

export default Page404