import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../../components/Banner";
import HeaderLibrary from "../../components/HeaderLibrary";
import { checkIfTrialEnd, createHadithAppActivation, getQuranSuras } from "../../database/hadithRepository";
import { HiOutlineX } from "react-icons/hi";


export default function OnlineMp3(){

    const [hadiths, setHadiths]= useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);
    const [searchSura, setSearchSura] = useState(false);
    const [selectedAudio, setSelectedAudio]= useState('');
    const [selectedSura, setSelectedSura] = useState('');
    const [showPlayer, setShowPlayer] = useState(false);
    const audioRef = useRef(null);

    const onlineSuras=[
        { 
            surahId: 1, 
            links: [
                { name: 'Mishary', link: `https://server8.mp3quran.net/afs/001.mp3` }
            ] 
        },
        { 
            surahId: 2, 
            links: [
                { name: 'Mishary', link: `https://server8.mp3quran.net/afs/002.mp3` }
            ] 
        }        
    ]    

    useEffect(()=>{
        // console.log(localStorage.getItem('lastHadith'))
         document.title = 'Islamic Library';
         loadBooks();
    },[])  
     
    useEffect(() => {
        if (showPlayer && selectedAudio && audioRef.current) {
            audioRef.current.src = selectedAudio;
            audioRef.current.play();
        }
    }, [showPlayer, selectedAudio]);    

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
            books.map((surah,index)=>{
                if(surah.surahId === onlineSuras[index]?.surahId){
                    surah['playList']=onlineSuras[index];
                }
            });
            console.log(books) 
            setHadiths(books);
    
        }
        catch(err){    
            console.log(err);    
        }
        finally{    
            setLoading(false);    
        }    
    }    


    const handleChange= (selectedValue, selectedSura2)=>{
        console.log(selectedValue, selectedSura2)
        setSelectedAudio(selectedValue);
        setSelectedSura(selectedSura2.surahHeader)
    }    

    const handlePlay = () => {
        if (!selectedAudio) {
            return;
        }
        setShowPlayer(true);    
    };

    const filtered= hadiths.filter((hadith)=>{
        if(!searchSura) return hadith;
        if( hadith.surahHeader.toLowerCase().includes(searchSura.toLowerCase()) || hadith.surahNameEng.toLowerCase().includes(searchSura.toLowerCase()) || hadith.surahNameBn.toLowerCase().includes(searchSura.toLowerCase())) 
            return hadith;
    })

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

    return(
        <>
            <HeaderLibrary />
            <Banner/>
            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200">
                    <p className="text-lg">Fetching Surahs...</p>
                </div>
            )}                            
            <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">

                <input type='text' placeholder="Search Sura" onChange={(e)=>setSearchSura(e.target.value)}
                            className="text-gray-400 rounded-lg bg-[#0C171A] mt-2" />                       
                <div className="flex gap-2 flex-wrap justify-center p-4">                    
                    {
                        filtered.map(item=>{
                            return(
                                <div class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                    <div class="flex flex-col justify-between md:p-4 leading-normal">
                                        {/* <p class="leading-5 text-md mb-2">{item.surahNameEng} | {item.surahNameBn}</p> */}
                                        <p class="leading-8 text-xl mb-2">{item.surahHeader} </p>
                                        {
                                            item.playList?.links?.length > 0 &&
                                            <div className="flex flex-col gap-2">
                                                <select onChange={(e)=>handleChange(e.target.value, item)}
                                                        className="bg-transparent text-white max-w-sm w-full  border rounded-lg px-3 py-2"
                                                >
                                                    <option value='' className="bg-[#0c171a] text-white">Select Mp3</option>

                                                    {item.playList.links.map(audio => (
                                                        <option  key={audio} value={audio.link}
                                                                className="bg-[#0c171a] text-white"> {audio.name}</option>
                                                    ))}
                                                </select>
                                                <div className="flex gap-2">
                                                    <button onClick={handlePlay}
                                                        class="rounded-md w-full text-center bg-cyan-900 px-4 py-2 text-white mb-2 mt-2"
                                                    >Play</button> 
                                                    <button onClick={handlePlay}
                                                        class="rounded-md w-full text-center bg-cyan-900 px-4 py-2 text-white mb-2 mt-2"
                                                    >Download</button>                                                    
                                                </div>
                                           
                                            </div>                                            
                                        }
                                            
                                    </div>
                                </div>                            
                            )
                        })
                    }
                </div>                 
            </div> 
            {
                showPlayer && (
                    <div className="fixed bottom-0 left-0 w-full z-50 bg-[#0C171A] border-t border-gray-700 p-3">                        
                        <button
                            onClick={() => {
                                audioRef.current?.pause();
                                audioRef.current.src = "";
                                setShowPlayer(false);
                            }}
                            className="absolute right-3 top-1 text-gray-400 hover:text-white text-2xl leading-none"
                        >
                            <HiOutlineX />
                        </button>
                        <audio ref={audioRef} controls controlsList="nodownload"  className="w-full pr-8" />
                    </div>
                )
            }        
        </>
    )
}