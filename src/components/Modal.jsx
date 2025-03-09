import React from "react";

const Modal = ({ children, modal, setModal,visibility }) => {
  return (
    <>
      <div
        onClick={() => setModal(false)}
        className={`bg-black/95 fixed inset-0 z-40
      ${
        modal ? `visible opacity-${visibility}` : "invisible opacity-0"
      } transition-all duration-200`}
      />
      {children}
    </>
  );
};

export default Modal;
