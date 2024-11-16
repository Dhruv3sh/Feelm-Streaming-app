import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import { IoSearchOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import { navigation } from "../contants/Navigation";
import { Button } from "@nextui-org/react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [inputValue, setInputValue] = useState(removeSpace);
  const [navbar, setNavbar] = useState(false);
  const navigate = useNavigate();
  const { user, profileData } = useAuth();

  console.log(profileData);

  const handleButtonClick = () => {
    navigate("/search");
  };

  const handleInputValue = (e) => {
    console.log(e.target.value);
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        navigate(`/search?q=${inputValue}`);
      }
    }, 500); // Adjust debounce delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const changeBackgroundColor = () => {
    if (window.scrollY >= 40) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackgroundColor);
    return () => {
      window.removeEventListener("scroll", changeBackgroundColor);
    };
  }, []);

  return (
    <header
      className={` ${
        navbar
          ? "backdrop-blur-sm bg-black bg-opacity-60 transition-all duration-700 border-b-neutral-80 border-b-[1px]"
          : "bg-transparent"
      } fixed top-0 w-full h-16 md:w-full max-md:h-14 z-40`}
    >
      <div className="container mx-auto px-2 flex items-center h-full w-full">
        <Link to={"/"}>
          <img
            className="h-16 w-24 max-md:w-24 max-md:h-14 hover:scale-105 transition-all active:scale-90"
            src="/images/logo.png"
            alt="logo"
          />
        </Link>

        <nav className="hidden lg:flex items-center ml-4 gap-3">
          {navigation.map((nav) => (
            <div key={nav.label}>
              <NavLink
                to={nav.href}
                className={({ isActive }) =>
                  ` ml-2 px-2 hover:text-neutral-200 relative before:content-[''] before:absolute before:-bottom-2 before:left-0 before:w-0 before:h-[3px] before:rounded-full before:opacity-0 before:transition-all before:duration-500 before:bg-gradient-to-r before:from-zinc-300 before:to-zinc-200 hover:before:w-full hover:before:opacity-100 tracking-[1px] ${
                    isActive && "text-neutral-50 "
                  }`
                }
              >
                {nav.label}
              </NavLink>
            </div>
          ))}
        </nav>

        <div className="flex ml-auto gap-7">
          <form
            className="flex items-center relative pr-5"
            onSubmit={handleSubmit}
          >
            <input
              className="max-lg:hidden bg-transparent pr-4 py-1 outline-none w-44 placeholder:text-neutral-100"
              type="text"
              placeholder="Search here.."
              value={inputValue}
              onChange={handleInputValue}
            ></input>
            <button
              className="text-neutral-50 absolute right-3 max-lg:right-0"
              onClick={handleButtonClick}
            >
              <IoSearchOutline size={20} />
            </button>
          </form>

          {user ? (
            <div className="w-full h-full mr-2 pt-2 active:scale-90 transition-all hover:scale-105 duration-150">
              <Link to="/Profile">
                <button>
                  {/* Display the profile image or FaUserCircle */}
                  {profileData ? (
                    <img
                      src={profileData?.profileImageUrl}
                      className="h-8 w-8 rounded-full"
                      alt="profile"
                      loading="lazy" // Lazy load the image
                    />
                  ) : (
                    <FaUserCircle size={30} />
                  )}
                </button>
              </Link>
            </div>
          ) : (
            <div className="w-full h-full mr-1 active:scale-90 transition-all hover:scale-105 duration-150">
              <Link to="/UserLogin">
                <Button
                  radius="full"
                  size="sm"
                  className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                >
                  Sign in
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
