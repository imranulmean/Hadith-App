import { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';
import HeaderLibrary from "../components/HeaderLibrary";
import PaginationButtons from "../components/PaginationButtons";
import { checkIfTrialEnd, createHadithAppActivation, getHadithsContent, getSurahContent } from "../database/hadithRepository";
import ActivationCompo from "./ActivationCompo";

export default function SurahContent() {

    const {pathname} = useLocation();
    const { surahName } = useParams();
    const surahNameEng=surahName;
    // console.log(surahNameEng)
    const contentName=`surah/${surahNameEng}`

    const [hadiths, setHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [lang, setLang]=useState('bn')
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const LIMIT = 20;
    const [activated, setActivated] = useState(false);

    // ✅ get and set page from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        document.title = 'Islamic Library';        
    }, []);    

    useEffect(() => {
        getHadiths();
        window.scrollTo(0,0)
    }, [page]);

    // Go to users tracked hadith    
    useEffect(() => {
        
        // if (hadiths.length > 0 && location.hash) {
        //     const el = document.getElementById(location.hash.replace('#', ''));
        //     if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // }
        const params = new URLSearchParams(location.search);
        const hadithId = params.get('hadithIndex');
    
        if (hadiths.length > 0 && hadithId) {
            const el = document.getElementById(`hadith-${hadithId}`);
            if (el) {
                setTimeout(() => {
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }        
    }, [hadiths]);    

    const getHadiths = async () => {
        setLoading(true);  
        try {
            await createHadithAppActivation();
            const isActivated= await checkIfTrialEnd();
            if(!isActivated) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            }                      
            const data = await getSurahContent(surahNameEng, page, LIMIT)

            setHadiths(data.message);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        } catch (error) {
            alert(error);   
            console.log(error.message)         
        } finally {
            setLoading(false);
        }
    };

        // ✅ update URL when page changes
    const changePage = (newPage) => {
        setSearchParams({ page: newPage });
    };

    // save bookmark
    function saveBookmark(index) {
        
        const page = searchParams.get('page');
        const path = page && page > 1 ? `${pathname}?page=${page}&hadithIndex=${index}` : `${pathname}?hadithIndex=${index}`;
        localStorage.setItem('lastAyat', path);
        alert("Bookmarked Saved");
    }    

    function copyLink(index) {
        console.log(index)
        const page = searchParams.get('page');
        const path = page && page > 1 ? `${pathname}?page=${page}&hadithIndex=${index}` : `${pathname}?hadithIndex=${index}`;
        console.log(path);
        const fullUrl = `${window.location.origin}${path}`;

        navigator.clipboard.writeText(fullUrl).then(() => {
            alert("Hadith Link Copied!");
        });        
        
    }    

    if(!activated){
        return(
            <>
                <HeaderLibrary />
                {loading && (
                    <div className="h-screen flex justify-center items-center p-10 bg-[#0C171A] text-gray-200">
                        <p className="text-lg">Fetching Surahs...</p>
                    </div>
                )}
                {
                    !loading &&
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <Link to ='/activationCompo' class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                            Check Status
                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                        </Link>
                    </div>
                }                              
            </>
        )
    }

    return (
        <>
            <HeaderLibrary />
            {loading && (
                <div className="h-screen flex justify-center items-center p-10 bg-[#0C171A] text-gray-200">
                    <p className="text-lg">Fetching Surahs...</p>
                </div>
            )}

            {!loading && (
                <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">

                    {/* total count */}
                    <div className="w-full flex justify-around md:justify-center gap-2 mt-4 mb-4">
                        <p className="text-sm text-gray-200 ">
                            {contentName}
                        </p>
                        <p className="text-sm text-gray-200 ">
                            Showing {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total} 
                        </p>
                    </div>
                    
                    <div className="flex gap-2">

                    </div>
                    {/* pagination buttons */}
                        <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} setLang={setLang}/>
                    {/* hadith cards */}
                    <div className="flex gap-4 flex-wrap justify-center p-4">
                        {hadiths.map((item, index) => (
                            <div key={index} id={`hadith-${index+1}`}
                                className="flex flex-col bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs"
                            >
                                {/* title */}
                                <h5 className="mb-3 text-md font-semibold tracking-tight text-heading">
                                    {item.surahHeader}
                                    <br/>page no:{page}, Ayat:{index+1} 
                                </h5>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={()=>saveBookmark(index+1)}
                                        class="bg-green-900 px-4 py-2 text-white mb-2">
                                        Track Record
                                    </button>
                                </div>
                                
                                <div className="flex flex-col md:flex-row md:gap-2">
                                    {/* /////////////////////// */}
                                    {/* arabic text */}
                                        <div className="p-4 border border-gray-200 rounded-lg text-right md:max-w-md">
                                            <p className="text-md leading-5 font-MushafFont" >
                                                {item.arabicText}
                                            </p>
                                            <p className="text-md leading-5 font-MushafFont" >
                                                {item.banglaText}
                                            </p>                                            
                                        </div>
                                </div>

                            </div>
                            
                        ))}
                    </div>

                    {/* pagination buttons */}
                    <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} />

                </div>
            )}
        </>
    );
}