import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Jumbotron from "./Jumbotron";
import { Device } from "@capacitor/device";

export default function SubjectiveBanner({ title, subTitle, bookName, chapterTitle, chapterTitleIndexName}){

    const [audioSrc, setAudioSrc] = useState();
    const [showIframe, setShowIFrame]= useState(false);
    const [showAudioBtn, setShowAudioBtn]= useState(false);
    const [selectedAudio, setSelectedAudio]= useState([]);
    const [loading, setLoading] = useState(false);
    const {pathname} = useLocation();
    const { surahId } = useParams();
    const BASE_API = import.meta.env.VITE_API_BASE_URL;

    useEffect(()=>{
        if(pathname.includes('surahContent')){
            setShowAudioBtn(true);
        }
    },[]);

    const getAudio = async() =>{
        const { identifier } = await Device.getId();
        try{
            setLoading(true);
            const obj={
                deviceId: identifier
            }            
            const res = await fetch(`${BASE_API}/hadithApp/getAudio`,{
                method:"POST",
                headers:{
                'content-type' : 'application/json'
                },
                body: JSON.stringify(obj)
            });
            const data = await res.json();
            if(!data.success){
                alert(data.message)
                return;
            }
            data.message.filter((audio)=>{                
                if(audio.surahId === Number(surahId)){
                    console.log(audio);
                    setSelectedAudio(audio);
                }
            })                    
            
        }catch(err){
            alert(err.message)
        }finally{
            setLoading(false);
        }                           
    }
    const playAudio=(src)=>{
        setAudioSrc(src);
        setShowIFrame(true);
    }

    return(
        <>
            <div className="w-full">
                {/* Container with relative positioning to hold the text overlay */}
                {
                    !showIframe ?
                    <div className="flex flex-col relative z-1 h-[50vh] bg-[url('/islamic-logo.jpg')] bg-cover bg-center bg-no-repeat flex items-center justify-center">
                        
                        {/* Dark Overlay - ensures text is readable regardless of the image brightness */}
                        <div className="absolute inset-0 bg-[#00000080]"></div>
                        
                        {/* Text Content */}
                        <div className="relative z-10 text-center px-4">
                            {
                                title &&
                                <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg" 
                                    style={{'lineHeight':'3rem'}}>
                                    {title}
                                </h1>                            
                            }
                            {
                                subTitle &&
                                <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                    style={{'lineHeight':'3rem'}}>
                                    {subTitle}
                                </p>                            
                            }
                            {
                                bookName &&
                                <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg"
                                    style={{'lineHeight':'3rem'}}>
                                    {bookName}
                                </h1>                            
                            }
                            {
                                chapterTitle &&
                                <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                    style={{'lineHeight':'3rem'}}>
                                    {chapterTitle}
                                </p>                            
                            } 
                            {
                                chapterTitleIndexName &&
                                <p className="text-lg text-gray-100 font-medium max-w-2xl mx-auto"
                                    style={{'lineHeight':'2rem'}}>
                                    {chapterTitleIndexName}
                                </p>                            
                            }                                                
                            <Jumbotron setRemaining={""} trialEnd={"none"}/>
                            {
                                showAudioBtn &&
                                <div className="flex flex-col gap-2">
                                    <button onClick={getAudio} disabled={loading}
                                        className="w-auto text-gray-100 bg-neutral-secondary-medium border border-default-medium font-medium rounded-lg text-sm p-2"
                                    >
                                        { !loading ? 'Get Audio' : 'Loading ...'}
                                    </button>
                                    {
                                        (selectedAudio && selectedAudio?.links?.length> 0) &&                                         
                                        <div className="flex justify-center items-center gap-2">
                                            {
                                                selectedAudio.links.map((audio)=>(
                                                    <button onClick={()=>playAudio(audio.link)}
                                                        className="w-auto text-gray-100 bg-neutral-secondary-medium border border-default-medium font-medium rounded-lg text-sm p-2"
                                                    >
                                                        {audio.name}
                                                    </button>
                                                ))
                                            }

                                        </div>                                         
                                    }                               
                                </div>                                
                            }


                        </div>                   
                    </div>
                    :
                    <div className="w-full flex flex-col items-center gap-2">
                        <iframe className="w-full h-[50vh]"
                                src={audioSrc} 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope;" 
                                referrerpolicy="strict-origin-when-cross-origin" 
                                allowfullscreen>                            
                        </iframe>
                        <div className="w-full px-2">
                            <button onClick={()=>setShowIFrame(false)}
                                class="w-full rounded-md bg-cyan-900 px-4 py-2 text-white mb-2">
                                Close
                            </button>
                        </div>
                        

                    </div>

                }


            </div>      
        </>
    )
}