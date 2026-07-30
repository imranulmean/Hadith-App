import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import SubjectiveBanner from "../components/SubjectiveBanner";
import { openDatabase } from "../database/db";
import { checkIfTrialEnd, createHadithAppActivation } from "../database/hadithRepository";
import { useSearchParams } from "react-router-dom";
import { Capacitor } from '@capacitor/core';

export default function Search(){

    const [subjectiveHadiths, setSubjectiveHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(true);    
    const {bookId, chapterId} =  useParams();   
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchHadith, setSearchHadith] = useState(""); 

    useEffect(() => {
        window.scrollTo(0,0)
        const q = searchParams.get("q") || "";
        setSearchHadith(q);
    
        if (q) {
            getSubjectiveHadiths(q);
        }
    }, [searchParams]);    

    const getSubjectiveHadiths=async(searchHadith)=>{
        setSubjectiveHadiths([]);
        if(!searchHadith){
            alert("please Enter search ")
        }
        setLoading(true)
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
    
            const db = await openDatabase();
    
            if (Capacitor.isNativePlatform()) {
        
                const result = await db.query(`SELECT bookId, bookName, chapterId, chapterTitle, titleId, chapterTitleIndexName FROM subjectives
                                             WHERE chapterTitleIndexName LIKE ?`, [`%${searchHadith}%`]);                                    
        
                const books2= result.values.map(row => ({
                    bookId: row.bookId,
                    bookName: row.bookName,
                    chapterId: row.chapterId,
                    chapterTitle: row.chapterTitle,
                    titleId:row.titleId,
                    chapterTitleIndexName: row.chapterTitleIndexName,
                    link: `/subjective/book/${row.bookId}/chapter/${row.chapterId}/title/${row.titleId}/contents`
                }));
    
                setSubjectiveHadiths(books2);
            }    
            else{                
                const result = db.exec(`SELECT bookId, bookName, chapterId, chapterTitle, titleId, chapterTitleIndexName  FROM subjectives
                                                WHERE chapterTitleIndexName LIKE '%${searchHadith}%' `);
                
                if(result.length>0){
                    const books = result[0]?.values.map(row=>({
                        bookId: row[0],
                        bookName: row[1],
                        chapterId: row[2],
                        chapterTitle: row[3],
                        titleId:row[4],
                        chapterTitleIndexName: row[5],
                        link: `/subjective/book/${row[0]}/chapter/${row[2]}/title/${row[4]}/contents`
                    }));
            
                    setSubjectiveHadiths(books);
                }

            }
        }catch(err){
            alert(err.message);
        }
        finally{    
            setLoading(false);   
            // setSearchHadith(""); 
        } 
    }

    if(!activated){
        return(
            <>
                <HeaderLibrary />
                {loading && (
                    <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                        <p className="text-lg">Fetching Hadiths...</p>
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

            <form onSubmit={(e)=>{
                                e.preventDefault(); 
                                setSearchParams({ q: searchHadith });
                            }} 
                className="flex flex-col text-gray-200 p-4">
                <label><Link to='/activationCompo'>বিষয় দিয়ে খুঁজুন:</Link> (যেমন: ঈমান, নামায, রোযা, যাকাত, হজ্জ, উযূ, ওজু, গোসল, তায়াম্মুম, বিয়ে, তালাক, হায়েয, হালাল, হারাম, মাকরূহ, সুদ ...)  </label>
                <input type='text' value={searchHadith}  required
                        onChange={(e)=>{
                            setSearchHadith(e.target.value.trim())   
                        }} 
                        className="text-gray-400 rounded-lg bg-[#0C171A] mt-2" />
                <button type="submit" 
                    class="bg-green-900 px-4 py-2 text-white mt-2 mb-2">Search</button>                 
            </form>                              
                                         
            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}
            {
                !loading && 
                <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">
                    <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {
                            ( subjectiveHadiths && subjectiveHadiths.length > 0 ) && 
                            subjectiveHadiths.map(item=>{
                                return(
                                    <Link to ={item.link} class="w-full flex flex-col items-start bg-neutral-primary-soft p-6 border-t border-default rounded-base shadow-xs md:flex-row md:max-w-sm md:flex-row md:max-w-sm">
                                        <div class="flex flex-col justify-between md:p-4 leading-normal">
                                            <h5 class="mb-2 text-2xl font-semibold tracking-tight text-heading">{item.chapterTitleIndexName}</h5>
                                            {/* <p class="mb-2 text-sm text-gray-400 font-semibold tracking-tight text-heading">মোট হাদীস - {item.total}</p> */}
                                            <div>
                                                <Link to ={item.link} class="inline-flex items-center w-auto text-body bg-neutral-secondary-medium box-border border border-default-medium hover:bg-neutral-tertiary-medium hover:text-heading focus:ring-4 focus:ring-neutral-tertiary shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none">
                                                    Read more
                                                    <svg class="w-4 h-4 ms-1.5 rtl:rotate-180 -me-0.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 12H5m14 0-4 4m4-4-4-4"/></svg>
                                                </Link>
                                            </div>
                                        </div>
                                    </Link>                            
                                )
                            })
                        }
                    </div>                    
                </div>
                

            }

        </>
    )
}