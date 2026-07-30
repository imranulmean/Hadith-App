import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import HeaderLibrary from "../components/HeaderLibrary";
import { openDatabase } from "../database/db";
import { checkIfTrialEnd, createHadithAppActivation, subjectivesContent } from "../database/hadithRepository";
import SubjectiveBanner from "../components/SubjectiveBanner";

export default function SubjectiveContents(){

    const [subjectiveHadiths, setSubjectiveHadiths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activated, setActivated] = useState(false);    
    const {bookId, chapterId, titleId} =  useParams();
    const [bookDetails, setBookDetails] = useState([]);
    const [totalHadith, setTotalHadith] = useState(0);

    useEffect(()=>{
        window.scrollTo(0,0)
        getSubjectiveHadiths();
    },[])

    const getSubjectiveHadiths=async()=>{
        setLoading(true)
        try{

            await createHadithAppActivation();
            const isActivated= await checkIfTrialEnd();
            if(!isActivated) {
                setActivated(false);
                return;
            }
            else{
                setActivated(true);
            } 
    
            const data = await subjectivesContent(bookId, chapterId, titleId);
            setSubjectiveHadiths(data.message);
            setBookDetails(data.bookDetails)
            setTotalHadith(data.total)
        }catch(err){
            alert(err.message);
        }
        finally{    
            setLoading(false);    
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
            {loading && (
                <div className="flex justify-center items-start p-10 bg-[#0C171A] text-gray-200 h-screen">
                    <p className="text-lg">Fetching Hadiths...</p>
                </div>
            )}
            {
                !loading && 
                <>
                    <SubjectiveBanner  bookName={bookDetails[0][0]} chapterTitle={bookDetails[0][1]} chapterTitleIndexName={`${bookDetails[0][2]}, মোট হাদীস - ${totalHadith}`} />

                    <div className="flex flex-col justify-center items-center bg-[#0C171A] text-gray-200">
                        <div className="flex gap-2 flex-wrap justify-center p-4">                    
                        {subjectiveHadiths.map((item, index) => (
                                <div key={index} id={`hadith-${index+1}`}
                                    className="flex flex-col bg-neutral-primary-soft p-2 border border-default rounded-base shadow-xs"
                                >                                


                                    <div className="flex flex-col md:flex-row md:gap-2">
                                        {/* /////////////////////// */}
                                        {/* arabic text */}
                                        {item.arabicText?.length > 0 && (
                                            <div className="mb-3 border-t border-gray-200 text-right md:max-w-md">
                                                {item.arabicText.map((text, i) => (
                                                    <p key={i} style={{'font-size':'30px', 'line-height':'4rem'}}
                                                    className="leading-loose font-QuranFont" dir="rtl" lang="ar">
                                                        {text}
                                                    </p>
                                                ))}
                                            </div>
                                        )}

                                        {/* bangla text */}
                                        {
                                            
                                            item.banglaText?.length > 0 && (
                                                <div className="text-sm text-body leading-relaxed md:max-w-md">
                                                    {item.banglaText.map((text, i) => (
                                                        <p key={i} className="mb-2 text-xl">{text}</p>
                                                    ))}
                                                </div>
                                            )
                                            
                                        }
                                        {/* ////////////////////// */}
                                    </div>

                                </div>
                                
                            ))}
                        </div>                    
                    </div>
                </>

                

            }

        </>
    )
}