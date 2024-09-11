import React from 'react'
import { mobileNavigation } from '../contants/Navigation'
import { NavLink } from 'react-router-dom'

const MobileNavigation = () => {
    return (
        <section className='lg:hidden h-14 bg-black bg-opacity-70 backdrop-blur-2xl fixed bottom-0 w-full z-10'>
            <div className='flex items-center justify-between h-full p-1 text-neutral-400 mx-2'>
                {
                    mobileNavigation.map((nav, index) => (
                        <NavLink key={nav.label + 'mobileNavigation'} to={nav.href} className={({ isActive }) => `px-3 flex h-full items-center flex-col justify-center ${isActive && 'text-neutral-100'}`}>
                            <div className='text-2xl'>
                                {nav.icon}
                            </div>
                            <p className='text-sm'>{nav.label}</p>
                        </NavLink>
                    ))
                }
            </div>
        </section>
    )
}

export default MobileNavigation
