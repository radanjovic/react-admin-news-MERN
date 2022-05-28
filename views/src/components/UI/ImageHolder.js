import RemoveImage from "../icons/RemoveImage"
import './ImageHolder.css';

const ImageHolder = ({src, onRemove, id}) => {
    return (
        <div id='addImagesCointainer'>
            <img src={src} alt='uploaded image' />
            <RemoveImage id={id} onRemove={() => onRemove(id)} />
        </div>
    )
}

export default ImageHolder;