import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useEffect, useState } from "react";
import { HiPencilAlt, HiCheck } from "react-icons/hi";
import { FaAlignJustify } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SideMenuCompo(){

    const [isOpen, setIsOpen] = useState(false);
    const handleClose = () => setIsOpen(false);
    const {pathname} = useLocation();
    

    return (
      <>
        <div className="flex items-center justify-center">
          <button onClick={() => setIsOpen(true)} className='bg-cyan-900 px-2 py-1 rounded-sm absolute right-3'>
            <FaAlignJustify className="text-white"/>
          </button>
        </div>
        <Drawer open={isOpen} onClose={handleClose} className="bg-cyan-900">
          <Drawer.Header title={<span className="text-white">MENU</span>} 
                        className="border-b border-default" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example"
                      className="[&>div]:bg-transparent [&>div]:p-0 w-full"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>
                      <Link to="/ayats/ayat_e_shifa" className="block">
                          <Sidebar.Item
                              icon={HiPencilAlt}
                              className="text-white [&>svg]:text-white border-b border-default rounded-none hover:bg-cyan-900 text-white"
                          >
                              রোগ মুক্তির আয়াত {pathname.includes('ayat_e_shifa') ? <HiCheck className="inline ml-1" /> : '' }
                          </Sidebar.Item>
                      </Link>

                      <Link to="/ayats/rizqDua" className="block">
                          <Sidebar.Item
                              icon={HiPencilAlt}
                              className="text-white [&>svg]:text-white border-b border-default rounded-none hover:bg-cyan-900 text-white"
                          >
                              রিজিকের দোয়া {pathname.includes('rizqDua') ? <HiCheck className="inline ml-1" /> : '' }
                          </Sidebar.Item>
                      </Link>

                      <Link to="/ayats/rabbana_duas" className="block">
                          <Sidebar.Item
                              icon={HiPencilAlt}
                              className="text-white [&>svg]:text-white border-b border-default rounded-none hover:bg-cyan-900 text-white"
                          >
                              রব্বানা দোয়া (৪০টি দোয়া) {pathname.includes('rabbana_duas') ? <HiCheck className="inline ml-1" /> : '' }
                          </Sidebar.Item>
                      </Link>

                      <Link to="/ayats/importance_of_namaz" className="block">
                          <Sidebar.Item
                              icon={HiPencilAlt}
                              className="text-white [&>svg]:text-white border-b border-default rounded-none hover:bg-cyan-900 text-white"
                          >
                              নামাজের গুরুত্ব ও ফজিলত {pathname.includes('importance_of_namaz') ? <HiCheck className="inline ml-1" /> : '' }
                          </Sidebar.Item>
                      </Link>

                      <Link to="/ayats/getHadithBlogs" className="block">
                          <Sidebar.Item
                              icon={HiPencilAlt}
                              className="text-white [&>svg]:text-white border-b border-default rounded-none hover:bg-cyan-900 text-white"
                          >
                              ইসলামিক ব্লগ { ( pathname.includes('getHadithBlogs') || pathname.includes('updateHadithBlog') ) ? <HiCheck className="inline ml-1" /> : '' }
                          </Sidebar.Item>
                      </Link>
                    </Sidebar.ItemGroup>
                  </Sidebar.Items>
                </div>
              </div>
            </Sidebar>
          </Drawer.Items>
        </Drawer>
      </>
    );
}