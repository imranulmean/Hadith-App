export default function PaginationButtons({page, totalPages, changePage, setLang, source}){

    return(
        <>                
            <div className="flex gap-2 items-center pt-2">
                {
                    source!=='blogs' &&
                    <>
                        <button onClick={()=>setLang('bn')}
                            class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none">
                            Bangla
                        </button> 
                        <button onClick={()=>setLang('en')}
                            class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-lg text-sm px-4 py-2.5 focus:outline-none">
                            English
                        </button>                     
                    </>                        
                }
               
                <button
                    onClick={() => changePage(1)}
                    className={`px-2 py-2 text-sm text-white border rounded-lg transition-all
                        ${page === 1
                            ? 'bg-cyan-900'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    First
                </button>
                <button
                    key={totalPages}
                    onClick={() => changePage(totalPages)}
                    className={`px-2 py-2 text-sm text-white border rounded-lg transition-all
                        ${page === totalPages
                            ? 'bg-cyan-900'
                            : 'border-default hover:bg-neutral-secondary-medium'
                        }`}
                >
                    Last
                </button>                        
            </div>                


            <div className="flex flex-wrap gap-2 justify-center items-center p-2">
                <button
                    onClick={() => changePage(Math.max(page - 1, 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm text-white border border-default rounded-lg disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                >
                    {'<'}
                </button>

                 {/* ///////////////////////// */}
                    {/* Page numbers */}
                    {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {

                        let startPage = Math.max(1, page - 1);

                        // Make sure we show 3 pages when possible
                        if (startPage + 2 > totalPages) {
                            startPage = Math.max(1, totalPages - 2);
                        }

                        const pageNum = startPage + i;

                        if (pageNum > totalPages) {
                            return null;
                        }

                        return (
                            <button
                                key={pageNum}
                                onClick={() => changePage(pageNum)}
                                className={`px-2 py-2 text-sm text-white border rounded-md transition-all 
                                    ${
                                        page === pageNum
                                            ? 'bg-cyan-900 border-blue-500'
                                            : 'border-default hover:bg-neutral-secondary-medium'
                                    }`}
                            >
                                {pageNum}
                            </button>
                        );
                    })}

                    {/* Dots */}
                    {totalPages > 3 && page < totalPages - 2 && (
                        <span className="px-2 text-sm text-gray-400">
                            .
                        </span>
                    )}

                    {/* Last page */}
                    {totalPages > 3 && page < totalPages - 1 && (
                        <button
                            onClick={() => changePage(totalPages)}
                            className={`px-2 py-2 text-sm border text-white rounded-md transition-all
                                ${
                                    page === totalPages
                                        ? 'bg-cyan-900 border-blue-500'
                                        : 'border-default hover:bg-neutral-secondary-medium'
                                }`}
                        >
                            {totalPages}
                        </button>
                    )}                
                 {/* ////////////////////////        */}

                {/* Next */}

                <button
                    onClick={() => changePage(Math.min(page + 1, totalPages))}
                    disabled={page === totalPages}
                    className="px-4 py-2 text-sm text-white border border-default rounded-lg disabled:opacity-40 hover:bg-neutral-secondary-medium transition-all"
                >
                    {'>'}
                </button>
            </div>         
        </>
    )
}