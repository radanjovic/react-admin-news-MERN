import { useEffect, useState, useMemo } from 'react';
import useAuth from '../../hooks/useAuth';
import useAxiosAuth from '../../hooks/useAxiosAuth';

import NewsTable from './NewsTable';
import LoadingSpinner from '../UI/LoadingSpinner';
import FilterIcon from '../icons/FilterIcon';

import './NewsList.css';
import Pagination from '../pagination/Pagination';


const NewsList = () => {
  const {auth} = useAuth();
  const axiosAuth = useAxiosAuth();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [scs, setScs] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    setErr(null);
    setMsg(null);
    setScs(null);
    setLoading(true);
    const getPosts = async() => {
      try {
        const response = await axiosAuth.get('/news/list');
        const data = response.data.map((post, index) => ({...post, no: (index+1)}));
        setPosts(data);
        response?.data?.error && setErr(response.data.error);
        setLoading(false);
        setTimeout(() => {
          setErr(null);
      }, 2000); 
      } catch(err) {
          setLoading(false);
          setErr(err.message);
      }
    }

    getPosts();
    
  }, [axiosAuth]);

  const deletePost = async(ownerId, postId) => {
    // Just in case
    if (auth?.user?.id !== ownerId) {
      setErr('Only owner can delete their own posts!');
      return;
    }
    setMsg('Deleting post...');
    try {
      const response = await axiosAuth.delete(`/news/id/${postId}`);
      setMsg(null);
      response?.data?.error && setErr(response.data.error);
      response?.data?.message && setScs(response.data.message);
      setTimeout(() => {
        setErr(null);
        setScs(null);
        setPosts(prevArr => prevArr.filter(prevVal => prevVal._id !== postId)); // update posts without new fetch!
      }, 2000);
    } catch(err) {
      setErr(err.message || 'Could not delete post!');
    }
  }

  const handlePageSizeChange = (e) => {
    setPageSize(e.target.value);
    setCurrentPage(1);
  }

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return posts.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, posts, pageSize]);

  if (loading) {
    return <LoadingSpinner />
  }

  if (!loading && posts.length === 0) {
    return <p style={{textAlign: 'center', fontWeight: 'bolder'}}>No posts yet.</p>
  }

  return (
    <section className="newsListSection">
      <h2>News List</h2>
      {err && <p className='newsListErr'>{err}</p>}
      {msg && <p className='newsListMsg'>{msg}</p>}
      {scs && <p className='newsListScs'>{scs}</p>}
      <div className='newsListSectionFilterDiv'>
      <span>
        Showing 
          <select value={pageSize} onChange={handlePageSizeChange}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        entries
      </span>
      <span id='filterResults'><FilterIcon /> Filter results</span>
      </div>
      <table>
        <thead>
          <tr>
            <th className='tableNO'>NO.</th>
            <th className='tableTitle'>TITLE</th>
            <th className='tableDate'>DATE</th>
            <th className='tableTime'>TIME</th>
            <th className='tableAction'>ACTION</th>
          </tr>
        </thead>
        <tbody>
          {currentTableData.map(post => <NewsTable key={post._id} post={post} id={auth?.user?.id} onDelete={deletePost} />)}
        </tbody>
      </table>
      <Pagination 
        len={currentTableData.length}
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={posts.length}
        pageSize={pageSize}
        onPageChange={page => setCurrentPage(page)}
      />
    </section>
    
  )
}

export default NewsList