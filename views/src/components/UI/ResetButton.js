import './ResetButton.css'

const ResetButton = ({onClick}) => {
  return (
    <button className='resetButton' type='button' onClick={onClick}>Reset</button>
  )
}

export default ResetButton