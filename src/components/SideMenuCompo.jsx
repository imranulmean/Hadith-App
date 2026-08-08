import { Button, Drawer, Sidebar, TextInput } from "flowbite-react";
import { useState } from "react";
import {
  HiPencilAlt,
} from "react-icons/hi";
import { FaAlignJustify } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function SideMenuCompo(){
    const [isOpen, setIsOpen] = useState(false);

    const handleClose = () => setIsOpen(false);
  
    return (
      <>
        <div className="flex items-center justify-center">
          <button onClick={() => setIsOpen(true)} className='bg-cyan-900 px-2 py-1 rounded-sm absolute right-1'>
            <FaAlignJustify className="text-white"/>
          </button>
        </div>
        <Drawer open={isOpen} onClose={handleClose} className="bg-cyan-900">
          <Drawer.Header title={<span className="text-white">MENU</span>} className="border-b border-default" titleIcon={() => <></>} />
          <Drawer.Items>
            <Sidebar aria-label="Sidebar with multi-level dropdown example"
                      className="[&>div]:bg-transparent [&>div]:p-0 w-full"
            >
              <div className="flex h-full flex-col justify-between py-2">
                <div>
                  <Sidebar.Items>
                    <Sidebar.ItemGroup>

                      <Sidebar.Item icon={HiPencilAlt} className="text-white [&>svg]:text-white border-b border-default rounded-none">
                        <Link to='/ayats/ayat_e_shifa'>রোগ মুক্তির আয়াত</Link>                        
                      </Sidebar.Item>
                      <Sidebar.Item icon={HiPencilAlt} className="text-white [&>svg]:text-white border-b border-default rounded-none">
                        <Link to='/ayats/rizqDua'>রিজিকের দোয়া</Link>                        
                      </Sidebar.Item>
                      <Sidebar.Item icon={HiPencilAlt} className="text-white [&>svg]:text-white border-b border-default rounded-none">
                        <Link to='/ayats/rabbana_duas'>রব্বানা দোয়া (৪০টি দোয়া)</Link>                        
                      </Sidebar.Item>                      
                      <Sidebar.Item icon={HiPencilAlt} className="text-white [&>svg]:text-white border-b border-default rounded-none">
                        <Link to='/ayats/importance_of_namaz'>নামাজের গুরুত্ব ও ফজিলত</Link> 						
                      </Sidebar.Item>

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