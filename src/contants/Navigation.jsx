import { IoMdHome } from "react-icons/io";
import { PiTelevisionFill } from "react-icons/pi";
import { BiSolidMoviePlay } from "react-icons/bi";
// import { FaUserCircle } from "react-icons/fa";

export const navigation = [
    {
        label: 'Movies',
        href: 'movie',
        icon: <PiTelevisionFill />
    },
    {
        label: 'TV Shows',
        href: 'tv',
        icon: <BiSolidMoviePlay />
    }
]

export const mobileNavigation = [
    {
        label: 'Home',
        href: '/',
        icon: <IoMdHome />,
    },
    ...navigation,

    // {
    //     label: 'User',
    //     href: 'UserLogin',
    //     icon: <FaUserCircle />
    // },
]
