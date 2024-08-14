import React, { useRef } from 'react'
import Card from './Card'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const CardRow = ({ data = [], heading, trending, media_type }) => {

    const containerRef = useRef()

    const handleNext = () => {
        containerRef.current.scrollLeft += 1100
    }
    const handlePrevious = () => {
        containerRef.current.scrollLeft -= 1100
    }
    return (
        <div className=" container mx-auto px-3 my-10 ">
            <h2 className=" text-white text-2xl max-md:text-xl font-bold mb-3">{heading}</h2>

            <div className="relative">

                <div ref={containerRef} className="grid grid-cols-[repeat(auto-fit,200px)] max-[426px]:grid-cols-[repeat(auto-fit,180px)] max-[376px]:grid-cols-[repeat(auto-fit,170px)] grid-flow-col gap-4 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth transition-all scrollbar-none ">
                    {
                        data.map((data, index) => (
                            <Card
                                key={data.id + 'heading' + index}
                                data={data}
                                index={index + 1}
                                trending={trending}
                                media_type={media_type}
                            />
                        ))}
                </div>
                <div className=' top-0 w-full h-full hidden lg:flex items-center justify-between absolute '>
                    <button onClick={handlePrevious} className=' bg-white text-black rounded-full p-1 -ml-1 z-10' >
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleNext} className=' bg-white text-black rounded-full p-1 -ml-1 z-10'>
                        <FaAngleRight />
                    </button>
                </div>
            </div>

        </div>
    )
}

export default CardRow
