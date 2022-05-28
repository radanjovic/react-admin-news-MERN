// Code By: Shubham Khatri


import classnames from 'classnames';
import { usePagination, DOTS } from '../../hooks/usePagination';
import './Pagination.css';


const Pagination = ({onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className, len}) => {

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <div className='paginationSection'>
    <ul
      className={classnames('pagination-container', { [className]: className })}
    >
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === 1
        })}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber, i) => {
        if (pageNumber === DOTS) {
          return <li key={i} className="pagination-item dots">&#8230;</li>;
        }

        return (
          <li key={i}
            className={classnames('pagination-item', {
              selected: pageNumber === currentPage
            })}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
          </li>
        );
      })}
      <li
        className={classnames('pagination-item', {
          disabled: currentPage === lastPage
        })}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
    <span>
        Showing <span style={{color: '#5561B3'}}>{len}</span> of <span style={{color: '#5561B3'}}>{totalCount}</span> entries
    </span>
    </div>
  );
};

export default Pagination;

