import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../components/Banner";
import HeaderLibrary from "../components/HeaderLibrary";
import { deleteBookmark, getHadithBookmark } from "../database/hadithRepository";

export default function HadithBookmarks(){

    const [bookmarks, setBookmarks] = useState([]);

    useEffect(()=>{
        loadHadithBookmark();
    },[])

    const loadHadithBookmark =  async()=>{
        setBookmarks(await getHadithBookmark());
    }

    const removeBookmark = async (bookmarkIndex)=>{
        await deleteBookmark(bookmarkIndex);
        await loadHadithBookmark();
    }

    return(<>
            <HeaderLibrary />
            <Banner/>
            <p className="text-gray-400 text-xl text-center p-2">Hadith Bookmark List</p>               
            <div className="flex flex-col justify-start items-center bg-[#0C171A] text-gray-200">
                <div className="flex gap-2 flex-wrap justify-center p-4">   
                    {
                        bookmarks.length <1 &&
                        <p>No Bookmars Saved</p>
                    }                 
                    {
                        bookmarks.map((item, index)=>{
                            return(
                                <div class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                    <div class="flex flex-col justify-between gap-2">
                                        <p class="leading-5 text-md mb-2">{item.bookmarkName}</p>
                                        <div className="flex gap-2">
                                            <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                Read
                                                <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                            </Link>
                                            <button onClick={()=>removeBookmark(index)}
                                            class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                Delete                                            
                                            </button> 
                                        </div>                                                                                   
                                    </div>
                                </div>                            
                            )
                        })
                    }
                </div>                    
            </div>         
    </>)

}