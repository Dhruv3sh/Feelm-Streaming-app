import React from "react";

const User = () => {
  return (
    <div className=" h-screen bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
      <div className=" h-[480px] w-[400px] max-sm:h-[420px] max-sm:w-[330px] bg-black opacity-85 shadow-[0px_0px_21px_13px_#4a5568]">
        <div className="h-full w-full flex flex-col justify-center items-center relative">
          <div className=" absolute top-14">
            <img
            src="./images/logo.png"
            className="h-14 w-20"
            alt="logo"
            />
          </div>
          <div className=" text-2xl italic">
            Sign in
          </div>
          <div className=" flex flex-col gap-1">
            <input placeholder="Username..." className="bg-white text-black rounded-md p-1">
            </input>
            <input placeholder="Password..." className="bg-white text-black rounded-md p-1"/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
