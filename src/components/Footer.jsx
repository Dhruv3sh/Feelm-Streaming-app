import React from 'react'
import { PiCopyright } from "react-icons/pi";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className='flex items-center justify-center gap-1 pb-2 max-sm:text-sm h-[38px]'>
            <hr className=' text-white' />
            <a className='pr-1 hover:scale-110 transition-all' href="https://github.com/Dhruv3sh" target="_blank" rel="noopener noreferrer">
                <FaGithub size={22} className=' max-sm:size-[17px]' />
            </a>
            <div>
                <PiCopyright />
            </div>
            <h4>2024 Dhruv Sharma</h4>
            <p>, Inc. All Rights Reserved.</p>
            <a className='pl-1 hover:scale-110 transition-all' href="https://www.linkedin.com/in/dhruv-sharma-9b1151202/" target="_blank" rel="noopener noreferrer">
                <FaLinkedin size={22} className=' max-sm:size-[17px]' />
            </a>
        </footer>
    )
}

export default Footer
