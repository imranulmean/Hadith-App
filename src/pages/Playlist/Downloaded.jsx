import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Banner from "../../components/Banner";
import HeaderLibrary from "../../components/HeaderLibrary";
import { checkIfTrialEnd, createHadithAppActivation, getQuranSuras } from "../../database/hadithRepository";
import { HiOutlineX } from "react-icons/hi";
import { Capacitor } from "@capacitor/core";
import { Device } from "@capacitor/device";
import { Directory, Filesystem } from "@capacitor/filesystem";


export default function Downloaded(){

    const [hadiths, setHadiths]= useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);
    const [playingSura, setPlayingSura] = useState('');
    const [playingFile, setPlayingFile] = useState('');
    const [showPlayer, setShowPlayer] = useState(false);
    const audioRef = useRef(null);
    const [ surahIndex ,setSurahIndex] = useState(-1);
    const [deleting, setDeleting] = useState(false);

    useEffect(()=>{
        // console.log(localStorage.getItem('lastHadith'))
         document.title = 'Islamic Library';
         loadMp3Files();
    },[])  
     
    useEffect(() => {
        try{
            if (showPlayer && audioRef.current && playingFile) {
                audioRef.current.src = playingFile;
                audioRef.current.play().catch(err => {
                    alert(err.message);
                });
            }            
        }catch(err){
            alert(err.message);
        }
    }, [showPlayer, playingFile]); 

    const loadMp3Files=async()=>{
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

            const result = await Filesystem.readdir({
                path: 'audio',
                directory: Directory.Data
            });
            setHadiths(result.files)
    
        }
        catch(err){    
            console.log(err);
            alert(err.message)
        }
        finally{    
            setLoading(false);    
        }    
    }    

    const handlePlay = async (fileName) => {

        try {
            const result = await Filesystem.getUri({
                path: `audio/${fileName}`,
                directory: Directory.Data
            });
    
            const fileUri = Capacitor.convertFileSrc(result.uri);
        
            setPlayingSura(fileName);
            setPlayingFile(fileUri);
            setShowPlayer(true);
    
        } catch (err) {
            alert(err.message);    
        }
    };

    const handleDelete= async(fileName, surahIndex2)=>{
        if(deleting){
            alert("One deleing in progress");
            return;
        }
        try {
            setDeleting(true);
            setSurahIndex(surahIndex2);
            await Filesystem.deleteFile({ 
                path: `audio/${fileName}`, 
                directory: Directory.Data 
            });              
        } catch (error) {
            alert(error.message);
        }finally{
            setDeleting(false);
            await loadMp3Files();
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
                   
                <div className="flex gap-2 flex-wrap justify-center p-4">                    
                    {
                        hadiths.map((item, index)=>{
                            return(
                                <div class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                    <div class="flex flex-col justify-between md:p-4 leading-normal">
                                        <p class="leading-8 text-xl mb-2">{item.name} </p>
                                        <p className="text-sm text-gray-400 mb-2">
                                            Size: {(item.size / 1024 / 1024).toFixed(2)} MB
                                        </p>                                        
                                        <div className="flex gap-2">
                                            <button onClick={()=>handlePlay(item.name)}
                                                class="rounded-md w-full text-center bg-cyan-900 px-4 py-2 text-white mb-2 mt-2"
                                            >Play</button> 
                                            <button onClick={()=>handleDelete(item.name, index)}
                                                class="rounded-md w-full text-center bg-cyan-900 px-4 py-2 text-white mb-2 mt-2"
                                            >Delete</button> 
                                            {
                                                (deleting && index === surahIndex) &&
                                                <div className="flex justify-between text-sm mb-1">
                                                    <span>Deleting...</span>
                                                </div>
                                            }                                                   
                                        </div>                                             
                                    </div>
                                </div>                            
                            )
                        })
                    }
                </div>                 
            </div> 
            {
                showPlayer && (
                    <div className="p-3 fixed flex flex-col items-end gap-2 bottom-0 left-0 w-full z-50 bg-[#0C171A] border-t border-gray-700">                        
                        <button className="text-gray-400 hover:text-white text-2xl leading-none"
                            onClick={() => {
                                audioRef.current?.pause();
                                audioRef.current.src = "";
                                setPlayingFile('');
                                setPlayingSura('');
                                setShowPlayer(false);                                
                            }}                            
                        >
                            <HiOutlineX />
                        </button>
                        <audio ref={audioRef} controls controlsList="nodownload"  className="w-full" />
                        <div className="text-center text-gray-200 text-sm">
                            Now Playing: <span className="font-semibold">{playingSura}</span>
                        </div>                        
                    </div>
                )
            }        
        </>
    )
}