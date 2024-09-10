import React, { useState } from 'react'
import { Button, Input } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from 'react-router-dom';

const Signup = () => {

    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div className=" h-screen bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">


      <div className=" h-[480px] w-[400px] max-sm:h-[490px] max-sm:w-[330px] bg-black opacity-85 shadow-[0px_0px_21px_13px_#4a5568]">


        <div className="h-full w-full flex flex-col justify-center items-center relative ">
          
          <div className=" text-2xl italic pb-4">Login</div>
          <form className=" w-3/4">

            <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
              <Input type="email" label="Email" name="e-mail" isRequired />
            </div>

            <br />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ">
              <Input
                label="Password"
                isRequired
                endContent={
                  <button
                    className="focus:outline-none "
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-xs"
              />
            </div>

            <br />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ">
              <Input
                label="Confirm Password"
                isRequired
                endContent={
                  <button
                    className="focus:outline-none "
                    type="button"
                    onClick={toggleVisibility}
                    aria-label="toggle password visibility"
                  >
                    {isVisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                }
                type={isVisible ? "text" : "password"}
                className="max-w-xs"
              />
            </div>
            <br/>
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Button type="submit" color="primary" variant="ghost">
                Login
              </Button>
            </div>
            <div className=" w-full flex justify-center flex-col items-center">
              <p className='pt-2'>Or</p>
              <p>Already have an account?<Link to="/UserLogin"><b className=' text-yellow-600'> Login</b></Link></p>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup
