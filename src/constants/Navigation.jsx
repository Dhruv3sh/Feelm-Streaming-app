import { IoMdHome } from "react-icons/io";
import { PiTelevisionFill } from "react-icons/pi";
import { BiSolidMoviePlay } from "react-icons/bi";

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

]
