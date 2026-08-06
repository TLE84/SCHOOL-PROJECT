import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 my-8">
      <Link 
        href={`${basePath}?page=${Math.max(1, currentPage - 1)}`}
        className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === 1 ? 'pointer-events-none opacity-50 border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700 hover:border-green-600 hover:text-green-700 transition-colors'}`}
      >
        Previous
      </Link>
      
      <div className="hidden sm:flex gap-1">
        {pages.map(page => (
          <Link
            key={page}
            href={`${basePath}?page=${page}`}
            className={`w-10 h-10 flex items-center justify-center rounded-md text-sm font-semibold transition-colors ${page === currentPage ? 'bg-green-700 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            {page}
          </Link>
        ))}
      </div>

      <Link 
        href={`${basePath}?page=${Math.min(totalPages, currentPage + 1)}`}
        className={`px-4 py-2 border rounded-md text-sm font-medium ${currentPage === totalPages ? 'pointer-events-none opacity-50 border-slate-200 text-slate-400' : 'border-slate-300 text-slate-700 hover:border-green-600 hover:text-green-700 transition-colors'}`}
      >
        Next
      </Link>
    </div>
  );
}
