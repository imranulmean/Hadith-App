import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import Banner from "../components/Banner";
import { checkIfTrialEnd, createHadithAppActivation, getQuranSuras } from "../database/hadithRepository";

export default function Suras(){

    const [hadiths, setHadiths]= useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);
    const [searchSura, setSearchSura] = useState(false);
    

    useEffect(()=>{
        // console.log(localStorage.getItem('lastHadith'))
         document.title = 'Islamic Library';
         loadBooks();
    },[])   

    const loadBooks=async()=>{
        setLoading(true);    
        try{
            await createHadithAppActivation();
            const data= await checkIfTrialEnd();
            if(!data) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            }            
            const books=await getQuranSuras();   
            // console.log(books) 
            setHadiths(books);
    
        }
        catch(err){    
            console.log(err);    
        }
        finally{    
            setLoading(false);    
        }    
    }    

    if(!activated){
        return(
            <>
                <HeaderLibrary />
                <Banner loading={loading}/>
                {loading && (
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
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

    const filtered= hadiths.filter((hadith)=>{
        if(!searchSura) return hadith;
        if(hadith.surahNameEng.toLowerCase().includes(searchSura.toLowerCase()) || hadith.surahNameBn.toLowerCase().includes(searchSura.toLowerCase())) 
            return hadith;
    })
    return(
        <>
            <HeaderLibrary />
            <Banner/>                
            <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">

                <input type='text' placeholder="Search Sura" onChange={(e)=>setSearchSura(e.target.value)}
                            className="text-gray-400 rounded-lg bg-[#0C171A] mt-2" />
                <div className="flex gap-2 flex-wrap justify-center p-4">                    
                    {
                        filtered.map(item=>{
                            return(
                                <div class="flex flex-col items-center bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                    <div class="flex flex-col justify-between">
                                        <p class="leading-5 text-md mb-2">{item.surahNameEng}</p>
                                        <p class="leading-5 font-MushafFont text-md mb-2">{item.surahNameBn}</p>
                                        <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                            Read more
                                            <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                        </Link>                                            
                                        {/* <h5 class="leading-5 font-MushafFont text-md">{item.banglaText}</h5> */}
                                    </div>
                                </div>                            
                            )
                        })
                    }
                </div>                    
            </div>            
        </>
    )
}