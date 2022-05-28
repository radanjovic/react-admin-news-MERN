import {BsPlus} from 'react-icons/bs';

import './CategoryNotSelected.css';

const CategoryNotSelected = ({text, onAdd}) => {
  return (
        <span className='categoryNotSelected'>
            <span className='categoryNotSelectedButton' onClick={() => onAdd(text)}><BsPlus /></span>
            <span className='categoryNotSelectedText'>{text}</span>
        </span>
  )
}

export default CategoryNotSelected