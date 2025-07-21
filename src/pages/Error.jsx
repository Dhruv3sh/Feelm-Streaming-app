import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const ErrorPage = () => {
    const error = useRouteError();
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 text-center">
      <img
        src="/images/popcorn.png"
        alt="Popcorn"
        className="w-20 animate-bounce"
      />
      <h1 className="text-7xl font-bold text-red-500 mb-4">{error.status}</h1>
      <h2 className="text-3xl font-semibold mb-2">Oops! Page Not Found</h2>
      <p className="text-gray-400 mb-6">
        It seems you're lost in the world of movies. The page you're looking for
        doesn't exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 transition-colors px-5 py-2 rounded-full text-white font-medium shadow-lg"
      >
        <FaArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
};

export default ErrorPage;
