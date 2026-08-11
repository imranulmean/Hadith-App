import { useEffect, useState } from "react";
import { Card, TextInput, Label, Button } from "flowbite-react";
import { useParams } from "react-router-dom";
import HeaderLibrary from "../../components/HeaderLibrary";
import CheckActivationCompo from "../../components/CheckActivationCompo";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";

<style>
    {
        `
            .ql-editor{
                font-size:16px !important;
            }        
        `        
    }
</style>

export default function UpdateHadithBlog() {


    const [hadithBlog, setHadithBlog] = useState({}); 
    const BASE_API=import.meta.env.VITE_API_BASE_URL;
    const [loading, setLoading] = useState(false);
    const {id} = useParams();

    useEffect(()=>{
        getSingleHadithBlog();
    },[])

    const getSingleHadithBlog=async()=>{
        setLoading(true)
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getSingleHadithBlog/${id}`,{
                method:"GET",
            });

            const data= await res.json();            
            setHadithBlog(data.message);
        }
        catch(e){
            alert(e);
        }finally{
            setLoading(false);
        }
    }    

    if(loading){
        return(
            <>
                <HeaderLibrary />
                <div className="flex justify-center items-start p-10 text-gray-200">
                    <p className="text-lg">Fetching ...</p>
                </div> 
            </>
        )
    }    
    
  return (
    <>
        <style>{`
            .ql-editor {
                font-size: 16px !important;
                color: white !important;
            }
        `}</style>    
        <HeaderLibrary />
        <CheckActivationCompo>            
            <div className="p-2 flex flex-col gap-2 items-center">
                <p className="text-white text-lg text-center font-bold">{hadithBlog.title}</p>
                <p className="text-white text-sm text-center">{hadithBlog.shortDesc}</p>
                {/* <div className="border border-default p-2 rounded-md text-sm bg-white text-gray-900">
                    <div className="prose prose-invert max-w-none" style={{'wordBreak':'break-word'}}
                        dangerouslySetInnerHTML={{
                            __html: hadithBlog.details
                    }}/>
                </div> */}
                <div className="text-white text-lg">
                    <ReactQuill
                        theme="snow"
                        readOnly={true}
                        modules={{ toolbar: false }}
                        value={hadithBlog.details}
                    />
                </div>
                
            </div>

        </CheckActivationCompo>
    
    </>


  );
}