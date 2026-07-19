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
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [activated, setActivated] = useState(false);

    // ✅ get and set page from URL
    const [searchParams, setSearchParams] = useSearchParams();
    const page = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        document.title = 'Islamic Library';        
        getHadiths();
        window.scrollTo(0,0)        
    }, []);    


    // Go to users tracked hadith    
    useEffect(() => {

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
            const data = await getSurahContent(surahNameEng, page)
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

    // save bookmark
    function saveTrack(index) {        
        const path = `${pathname}?hadithIndex=${index}`;
        localStorage.setItem('lastAyat', path);
        alert("Track Saved");
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
                    <div className="flex gap-4 flex-wrap justify-center p-4">
                        {hadiths.map((item, index) => (
                            <div key={index} id={`hadith-${index+1}`}
                                className="flex flex-col bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs"
                            >
                                {/* title */}
                                <h5 className="mb-3 text-md font-semibold tracking-tight text-heading">
                                    {item.surahHeader} <br/>
                                    Reading:{index+1} 
                                </h5>
                                <div className="flex gap-2 justify-center">
                                    <button onClick={()=>saveTrack(index+1)}
                                        class="bg-green-900 px-4 py-2 text-white mb-2">
                                        Track Record
                                    </button>
                                </div>
                                
                                <div className="">
                                    {/* /////////////////////// */}
                                    {/* arabic text */}
                                        <div className="p-4 border border-gray-200 rounded-lg text-right md:max-w-md">
                                            <p className="text-3xl font-normal font-MushafFont text-right" style={{'font-size':'40px', 'line-height':'4rem'}}>
                                                {item.arabicText}
                                            </p>
                                            <p className="text-md font-MushafFont" >
                                                {item.banglaText}
                                            </p>                                            
                                        </div>
                                </div>

                            </div>
                            
                        ))}
                    </div>
                </div>
            )}
        </>
    );
}