import { useEffect, useState } from "react";
import moment from 'moment';
import { Link, useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import HeaderLibrary from "../../components/HeaderLibrary";
import PaginationButtons from "../../components/PaginationButtons";
import CheckActivationCompo from "../../components/CheckActivationCompo";

export default function GetHadithBlogs(){

    const BASE_API=import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [hadithBlogs, setHadithBlogs]= useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate= useNavigate();
    const [selectedTag, setSelectedTag] = useState("");
    const [existingTags, setExistingTags] = useState([]);

    const [limit, setLimit] = useState(6);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);

    const q = searchParams.get("q") || "all";
    const page = parseInt(searchParams.get('page')) || 1;    

    useEffect(() => {

        window.scrollTo(0,0)
        setSelectedTag(q);
        
        getHadithBlogs();

    }, [searchParams]);      

    const  getUniqueHadithBlogTags= async()=>{
        setLoading(true);
        try {
            const res= await fetch(`${BASE_API}/hadithApp/getUniqueHadithBlogTags`,{
                method:"GET",
                headers: { 
                "Content-Type": "application/json"
                }
            })
            const data= await res.json();
            if(data.success){
                setExistingTags(data.message);
            }
            
        } catch (error) {
            alert(error)
        }
        finally{
            setLoading(false);
        }     
    }    

    const getHadithBlogs=async()=>{
        setHadithBlogs([]);
        setLoading(true)
        try {

            await getUniqueHadithBlogTags();
            const res= await fetch(`${BASE_API}/hadithApp/getHadithBlogs?q=${q}&page=${page}&limit=${limit}`,{
              method:"GET",
              headers: {
                "Content-Type": "application/json"
                },
            });

            const data= await res.json();
           
            setHadithBlogs(data.message);
            setTotalPages(data.totalPages);
            setTotal(data.total);
        }
        catch(e){
            console.log(e);
            
        }finally{
          setLoading(false);
        }
    }

    const changePage = (newPage) => {
        setSearchParams({ q:q, page: newPage });
    };    

    const handleChange= (selectedValue)=>{
        setSelectedTag(selectedValue);
        setSearchParams({ q:selectedValue });
    }

    if(loading){
        return(
            <>
                <HeaderLibrary/>
                <div className="flex justify-center items-start p-10 text-gray-200">
                    <p className="text-lg">Fetching ...</p>
                </div>                
            </>
        )
    }
    return(
        <>  
            <HeaderLibrary/>
            <CheckActivationCompo>
                <div className="flex flex-col items-center">
                    {/* total count */}

                    <div className="flex flex-col gap-2 mt-4 px-4 ">
                        <select value={selectedTag} onChange={(e)=>handleChange(e.target.value)}
                                className="bg-transparent text-white max-w-sm w-full  border rounded-lg px-3 py-2"
                        >
                            <option  value="all" className="bg-[#0c171a] text-white">All</option>

                            {existingTags.map(tag => (
                                <option  key={tag} value={tag}
                                        className="bg-[#0c171a] text-white"> {tag}</option>
                            ))}
                        </select>
                        <p className="text-sm text-gray-200 ">
                            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} 
                        </p>                            
                    </div>                        

                    <div className="w-full flex flex-wrap px-4 py-2 gap-2 justify-center">
                        {
                            hadithBlogs.map((e,index)=>{
                                return(
                                    <>
                                        <div  className="w-full  text-white max-w-md flex flex-col border-b border-gray-400 p-2">
                                            <p className="text-lg text-center font-bold">{e.title}</p>
                                            <p className="text-md text-center font-normal">{e.shortDesc}</p>
                                            <p className="text-sm flex flex-wrap gap-2 justify-center">
                                                Tags:
                                                {
                                                    e.tags.map((tag)=>{
                                                        return <Link to={`/ayats/getHadithBlogs/?q=${tag}`} 
                                                                    className="border-b border-gray-400 text-sm break-all"
                                                                >{tag}</Link>
                                                    })
                                                }
                                            </p>
                                            <div className="flex justify-center gap-2">
                                                <Link to={`/ayats/updateHadithBlog/${e._id}`} disabled={loading}
                                                    className="border border-default px-2 py-1 rounded-md text-gray-200 mt-2 text-center">
                                                        Read {'>>'}
                                                </Link>
                                            </div>

                                        </div>                                    
                                    </>
                                )
                            })
                        }                         
                    </div>
                    <PaginationButtons page={page} totalPages={totalPages} changePage={changePage} source={'blogs'}/>                   
                </div>                
            </CheckActivationCompo>
        </>
    )
}