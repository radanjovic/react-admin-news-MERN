import React from 'react';
import CloseIcon from '../icons/CloseIcon';

import './CategorySelected.css';

const CategorySelected = ({text, onRemove}) => {
  return (
    <span className='categorySelected'>
        <span className='categorySelectedText'>{text}</span>
        <span className='categorySelectedButton' onClick={() => onRemove(text)}><CloseIcon /></span>
    </span>
  )
}

export default CategorySelected