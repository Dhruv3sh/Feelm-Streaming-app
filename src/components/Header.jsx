import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link, NavLink } from "react-router-dom";
import { navigation } from "../constants/Navigation";
import { useSelector } from "react-redux";

const Header = () => {
  const location = useLocation();
  const removeSpace = location?.search?.slice(3)?.split("%20")?.join(" ");
  const [inputValue, setInputValue] = useState(removeSpace);
  const [navbar, setNavbar] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(false);
  const navigate = useNavigate();
  const { user, profileData } = useSelector((state) => state.auth);

  const handleButtonClick = () => {
    navigate("/search");
  };

  const handleInputValue = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue) {
        navigate(`/search?q=${inputValue}`);
      }
    }, 700); // Adjust debounce delay as needed

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

  useEffect(()=>{
    const handleClickOutside = (e) => {
      if(menuRef.current && !menuRef.current.contains(e.target)){
        setMenuOpen(false);
      }
    };
    if(menuOpen){
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>{
      document.removeEventListener("mousedown", handleClickOutside);
    };
  },[menuOpen])

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
      } fixed top-0 min-h-14 max-h-[5.5rem] min-w-full z-40`}
    >
      <div className=" px-2 flex items-center h-full w-full">
        <Link to={"/"}>
          <img
            className="h-16 w-24 max-md:h-14 3xl:h-24 hover:scale-105 object-contain aspect-auto transition-all active:scale-90"
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

        <div className=" absolute right-4 flex gap-7 ">
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
              aria-label="search-btn"
              className="text-neutral-50 absolute right-3 max-lg:right-0"
              onClick={handleButtonClick}
            >
              <svg
                aria-hidden="true"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
          </form>

          <div className="relative">
            <button
              type="button"
              aria-label="Open profile menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-white ring-1 ring-white/10 transition hover:bg-zinc-700"
            >
              {user ? (
                <img
                  src={profileData?.profileImageUrl || "/images/default.png"}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 21a8 8 0 0 0-16 0" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
            </button>

            {menuOpen && (
              <div ref={menuRef} className="absolute right-0 mt-2 w-36 overflow-hidden rounded-md border border-zinc-800 bg-black text-sm text-white shadow-xl">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="block px-3 py-2 hover:bg-zinc-900"
                    >
                      Profile
                    </Link>
                    <Link
                      to="/myList"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="block px-3 py-2 hover:bg-zinc-900"
                    >
                      My List
                    </Link>
                  </>
                ) : (
                  <>
                    <div ref={menuRef} className="px-3 py-2 text-xs text-neutral-400">
                      Welcome
                    </div>
                    <Link
                      to="/userLogin"
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="block px-3 py-2 font-semibold text-red-400 hover:bg-zinc-900"
                    >
                      Login / Signup
                    </Link>
                  </>
                )}
              </div>
            )}
            </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
