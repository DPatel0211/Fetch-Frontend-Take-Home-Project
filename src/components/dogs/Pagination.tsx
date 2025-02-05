interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-6 mb-4">
      {!isFirstPage && (
        <button
          onClick={() => onPageChange(currentPage - 1)}
          className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Previous
        </button>
      )}

      <div className="flex gap-1">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={page === '...'}
            className={`px-3 py-2 rounded ${
              page === currentPage 
                ? 'bg-blue-500 text-white' 
                : page === '...' 
                  ? 'cursor-default' 
                  : 'hover:bg-gray-100'
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      {!isLastPage && (
        <button
          onClick={() => onPageChange(currentPage + 1)}
          className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Next
        </button>
      )}
    </div>
  );
}
