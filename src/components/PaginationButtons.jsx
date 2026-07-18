export default function PaginationButtons({page, totalPages, changePage, setLang}){

    return(
        <>
            <div className="flex gap-2 items-center pt-2">
                <button onClick={()=>setLang('bn')}
                    class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    Bangla
                </button> 
                <button onClick={()=>setLang('en')}
                    class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                    English
                </button>                
                <button
                    key={1}
                    onClick={() => changePage(1)}
                    className={`px-2 py-2 text-sm border rounded-base transition-all
                        ${page === 1
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    First Page
                </button>
                <button
                    key={totalPages}
                    onClick={() => changePage(totalPages)}
                    className={`px-2 py-2 text-sm border rounded-base transition-all
                        ${page === totalPages
                            ? 'bg-blue-100 border-blue-500 text-blue-700'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    Last Page
                </button>                        
            </div>
            <div className="flex gap-2 items-center p-2">
                <button
                    onClick={() => changePage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                >
                    {'<'}
                </button>

                {/* page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const pageNum = Math.max(1, page - 2) + i;
                    if (pageNum > totalPages) return null;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => changePage(pageNum)}
                            className={`px-2 py-2 text-sm border rounded-base transition-all
                                ${page === pageNum
                                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                                    : 'border-default hover:bg-neutral-secondary-medium'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                {/* ... separator — only show if last page is far away */}
                {page + 3 < totalPages && (
                    <span className="px-2 text-sm text-gray-400">.</span>
                )}

                {/* last page button — only show if not already visible in the 5 buttons */}
                {page + 2 < totalPages && (
                    <button
                        onClick={() => changePage(totalPages)}
                        className={`px-1 py-2 text-sm border rounded-base transition-all
                            ${page === totalPages
                                ? 'bg-blue-100 border-blue-500 text-blue-700'
                                : 'border-default hover:bg-neutral-secondary-medium'
                            }`}
                    >
                        {totalPages}
                    </button>
                )}

                {/* Next */}

                <button
                    onClick={() => changePage(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm border border-default rounded-base disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                >
                    {'>'}
                </button>
            </div>         
        </>
    )
}