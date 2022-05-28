import {useState} from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosAuth from "../../hooks/useAxiosAuth";
import useAxiosFile from '../../hooks/useAxiosFile';
import {useNavigate} from 'react-router-dom';

import {v4 as uuid} from 'uuid';
import {useDropzone} from 'react-dropzone';

import {MdOutlineRemoveRedEye} from 'react-icons/md';
import {BsCheckLg} from 'react-icons/bs';
import {IoIosArrowDown} from 'react-icons/io';
import SwitchOn from '../icons/SwitchOn';
import SwitchOff from '../icons/SwitchOff';
import CategorySelected from '../UI/CategorySelected';
import CategoryNotSelected from '../UI/CategoryNotSelected';
import ImageHolder from '../UI/ImageHolder';

import './AddNew.css';

const allCategories = ['Magazine', 'Sport', 'Health', 'Business', 'News', 'Celebrity', 'Education', 'Culture', 'Politics']

const AddNew = () => {
  const {auth} = useAuth();
  const axiosAuth = useAxiosAuth();
  const axiosFile = useAxiosFile();
  const navigate = useNavigate();
  const now = new Date(Date.now()).toLocaleDateString('en-EN', {day: 'numeric', month: 'long', year: 'numeric'});
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState(auth?.user?.name);
  const [DATE] = useState(now);
  const [categories, setCategories] = useState(['Magazine', 'Sport']);
  const [published, setPublished] = useState(true);
  const [showAuthorName, setShowAuthorName] = useState(false);
  
  const [notSelectedCategories, setNotSelectedCategories] = useState(allCategories.filter(cat => !categories.includes(cat)));
  const [showAllCategories, setShowAllCategories] = useState(false);

  const [err, setErr] = useState(null);
  const [msg, setMsg] = useState(null);
  const [scs, setScs] = useState(null);

  const [images, setImages] = useState([]);
  const [imagesTemp, setImagesTemp] = useState([]);

  const onDrop = (files) => {
    for (let i = 0; i < files.length; i++) {
      let id = uuid();
      let newObj = {
        image: files[i],
        id
      }
      let newTmp = {
        image: URL.createObjectURL(files[i]),
        id
      }
      setImages(prev => [...prev, newObj]);
      setImagesTemp(prev => [...prev, newTmp]);
    }
  }

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop, noClick: true});

  const addCategory = (cat) => {
    setCategories(prev => [...prev, cat]);
    setNotSelectedCategories(prev => prev.filter(category => category !== cat));
  }

  const removeCategory = (cat) => {
    setCategories(prev => prev.filter(category => category !== cat));
    setNotSelectedCategories(prev => [...prev, cat]);
  }
  

  const handleSubmit = async(e) => {
    e.preventDefault();

    if (!title || title === '' || !description || description === '' || !content || content === '' || !author || author === '' || !categories || categories.length === 0) {
      setErr('All required fields must be filled!');
      return;
    }

    setMsg('Submitting...');
    setErr(null);
    setScs(null);

    let imgUrls = null;

    if (images.length > 0) {
      try {
        const formData = new FormData();
        images.forEach(image => {
          let name = uuid();
          formData.append(name, image.image);
        });
        const response = await axiosFile.post('file-upload/images', formData);
        response?.data?.error && setErr(response.data.error || 'Could not upload images');
        imgUrls = response.data.urls;
      } catch(err) {
        setMsg(null);
        setErr(err.message || 'Could not upload images');
      }
    }

    console.log(imgUrls);

    const dateNow = new Date(Date.now());
    const date = dateNow.toLocaleDateString();
    const time = dateNow.toLocaleTimeString();
    
    const obj = {
      owner: auth?.user.id,
      title,
      description,
      content,
      author,
      date,
      time,
      categories,
      published,
      showAuthorName,
      dateTime: dateNow
    }

    imgUrls && (obj.images = imgUrls);

    try {
      const response = await axiosAuth.post('/news/add', JSON.stringify(obj));
      setMsg(null);
      response?.data?.error && setErr(response.data.error);
      response?.data?.message && setScs(response.data.message);
      setTimeout(() => {
        setMsg(null);
        setErr(null);
        setScs(null);
        navigate('/');
    }, 2000);
    } catch(err) {
      setErr(err);
    }

  }

  const removeImage = (id) => {
    setImages(prev => prev.filter(img => img.id !== id));
    setImagesTemp(prev => prev.filter(img => img.id !== id));
  }

  return (  
    <section className='addNewNewsSection' >
    {err && <p style={{color: 'red'}} className='errorMessage'>{err}</p>}
    {msg && <p style={{color: '#5561B3'}} className='submittingMessage'>{msg}</p>}
    {scs && <p style={{color: '#4FAC68'}} className='successMessage'>{scs}</p>}
    <form onSubmit={handleSubmit}>
      <div className='addNewMainSection'>
        <h2>Add New Post</h2>
        <input required type='text' placeholder='Title' value={title} onChange={e => setTitle(e.target.value)} />
        <h3>Content</h3>
        <h4>Short Description</h4>
        <textarea required value={description} onChange={e => setDescription(e.target.value)} placeholder='Short content of the editor...' />
        <h4>Main Content</h4>
        <textarea id='biggerTextarea' required value={content} onChange={e => setContent(e.target.value)} placeholder='Content of the editor...' />
        <h3>Images</h3>
        <div className={`addNewsImageContainer ${isDragActive && 'isDragActive'}`} {...getRootProps()}>
          {isDragActive ? <div>Drop Here</div> :
            <>
            <div id='imagesHolder'>
            {imagesTemp.map(image => <ImageHolder key={image.id} onRemove={removeImage} src={image.image} id={image.id} />)}
          </div>
          <div>
            {/* <input {...getInputProps()} /> */}
            <label><span id='uploadBold'>+ Upload a file<input {...getInputProps()} /></span> or drag and drop</label>
          </div>
            </>
          }
          
        </div>
      </div>

      <div className='addNewSidebar'> 
        <div className='addNewButtonContainer'>
          <button type='button'><MdOutlineRemoveRedEye className='addNewEyeIcon' /> Preview</button>
          <button type='submit' id='saveButton'><BsCheckLg /> Save</button>
        </div>
        <div className='addNewAdditionalContentSection'>
          <div>
            <label htmlFor='author'>Written By</label>
            <select id='author' required value={author} onChange={(e) => setAuthor(e.target.value)}>
              <option value={auth?.user?.name} >{auth?.user?.name}</option>
              <option value='John Travolta'>John Travolta</option>
              <option value='Other'>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor='date'>Post Date</label>
            <input id='date' required type='text' value={DATE} disabled />
          </div>
          <div>
            <span>Categories</span>
              <div className='categoriesHolder'>{categories.map(category => <CategorySelected key={category} text={category} onRemove={(cat) => removeCategory(cat)} />)}</div>
              <div id='showAllCategoriesArrowDiv' onClick={() => setShowAllCategories(prev => !prev)}><IoIosArrowDown id='showAllCategoriesArrow' /></div>
              {showAllCategories && <div className='categoriesHolder'>
                {notSelectedCategories.map(category => <CategoryNotSelected key={category} text={category} onAdd={(cat) => addCategory(cat)} />)}
              </div>}
          </div>
          <div>
            <span>Published</span>
            <span style={{cursor: 'pointer'}} onClick={() => setPublished(prev => !prev)}>
              {published ? <SwitchOn /> : <SwitchOff />}
            </span>
          </div>
          <div>
          <span>Show Author Name</span>
          <span style={{cursor: 'pointer'}} onClick={() => setShowAuthorName(prev => !prev)}>
            {showAuthorName ? <SwitchOn /> : <SwitchOff />}
          </span>
          </div>
        </div>
      </div>
      </form>
    </section>
  )
}

export default AddNew