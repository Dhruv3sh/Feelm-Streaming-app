import React from 'react'

const Loader = () => {
  return (
    <div className="flex justify-center items-center pt-3">
      <div className="animate-spinner-linear-spin rounded-full h-10 w-10 border-t-3 border-blue-500 border-solid"></div>
    </div>
  );
}

export default Loader
