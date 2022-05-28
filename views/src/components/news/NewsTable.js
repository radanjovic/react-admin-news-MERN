import EditButton from '../icons/EditButton';
import DeleteButton from '../icons/DeleteButton';
import './NewsList.css';

import { useNavigate } from 'react-router-dom';

const NewsTable = ({post, id, onDelete}) => {
  const navigate = useNavigate();
  return (
    <tr>
    <td className='tableNO tableContentBold'>{post.no}</td>
    <td className='tableTitle tableContentBold'>{post.title}</td>
    <td className='tableDate tableContentReg'>{post.date}</td>
    <td className='tableTime tableContentReg'>{post.time}</td>
    <td className='tableAction'>
    {id === post.owner && <>
      <span>
        <span onClick={() => navigate(`/edit/${post._id}`)}><EditButton  /></span>
        <span onClick={() => onDelete(post.owner, post._id)}><DeleteButton  /></span>
      </span>
      </>}
    </td>
  </tr>
  )
}

export default NewsTable