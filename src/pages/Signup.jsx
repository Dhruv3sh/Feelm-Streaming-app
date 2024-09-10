import React, { useMemo, useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../components/Firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-toastify";

const Signup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const toggleVisibility = () => setIsVisible(!isVisible);

  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const isInvalid = useMemo(() => {
    if (email === "") return false;

    return validateEmail(email) ? false : true;
  }, [email]);

  const validatePassword = (password) =>
    password.match(/^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,16}$/);
  const isPasswordInvalid = useMemo(() => {
    if (password === "") return false;

    return validatePassword(password) ? false : true;
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      console.log(user);

      if (user){
        await setDoc(doc(db, "users", user.uid),{
          email: user.email,
          Name: name,
        })
      }
      console.log("User Regitered");
      toast.success("User Registered Successfully!!",{
        position: "top-center",
      })
      
    } catch (error) {
      console.log(error.message);
      toast.error(error.message,{
        position: "top-center",
      })
    }
  };

  return (
    <div className=" h-screen bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center">
      <div className=" h-[480px] w-[400px] max-sm:h-[490px] max-sm:w-[330px] bg-black opacity-85 shadow-[0px_0px_21px_13px_#4a5568]">
        <div className="h-full w-full flex flex-col justify-center items-center relative ">
          <div className=" text-2xl italic pb-4">Sign up</div>
          <form className=" w-3/4" onSubmit={handleRegister}>

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
              <Input type="text" value={name} onValueChange={setName} label="Name" variant="bordered" isRequired required />
            </div>

            <br/>

            <div className="flex w-full flex-wrap md:flex-nowrap gap-2">
              <Input
                value={email}
                type="email"
                label="Email"
                variant="bordered"
                isRequired
                isInvalid={isInvalid}
                errorMessage="Please enter a valid email"
                onValueChange={setEmail}
                className="max-w-xs"
              />
            </div>

            <br />

            <div className="flex w-full flex-wrap md:flex-nowrap gap-4 ">
              <Input
                value={password}
                label="Password"
                isRequired
                required
                variant="bordered"
                isInvalid={isPasswordInvalid}
                errorMessage="minimum 8 letter with one smallercase one uppercase and one digit"
                onValueChange={setPassword}
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
            <div className="flex flex-wrap gap-4 items-center justify-center">
              <Button type="submit" color="primary" variant="ghost">
                Signup
              </Button>
            </div>
            <div className=" w-full flex justify-center flex-col items-center">
              <p className="pt-2">Or</p>
              <p>
                Already have an account?
                <Link to="/UserLogin">
                  <b className=" text-yellow-600"> Login</b>
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
