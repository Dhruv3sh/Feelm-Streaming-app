import React, { useState } from "react";
import { signOut } from "firebase/auth";
import { auth, storage, db } from "../components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TiEdit } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setProfileData } from "../store/authSlice";
import { doc, updateDoc } from "firebase/firestore";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profileData } = useSelector((state)=> state.auth);
  const [file, setFile] = useState(null);

  // Upload new image to Firebase Storage
  const handleFileUpload = async (selectedFile) => {
    if (selectedFile) {
      try {
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(fileRef, selectedFile);

        const downloadURL = await getDownloadURL(fileRef);

        // Update Firestore with new profile image URL
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImageUrl: downloadURL });

        dispatch(setProfileData({ ...profileData, profileImageUrl: downloadURL }));

        toast.success("Profile image updated!", {
          position: "top-center",
          autoClose: 1200,
          hideProgressBar: true,
          theme: "dark",
        });
      } catch (error) {
        toast.error("Error updating image, try a different image", {
          position: "top-center",
          autoClose: 1200,
          hideProgressBar: true,
          theme: "dark",
        });
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      handleFileUpload(selectedFile);
    }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      dispatch(setUser(null)); // Clear user data from Redux
      localStorage.setItem("redirectedFromProfile", "true");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  const profileImage = profileData?.profileImageUrl || "/images/default.png";

  return (
    <div className=" h-[696px] md:h-screen bg-[url('../public/images/hero.jpg')] bg-cover bg-center flex items-center justify-center max-sm:flex-col gap-x-1 max-sm:gap-y-1 pt-10 max-sm:pt-16">
      <div className="h-[540px] w-80 max-sm:h-[450px] max-sm:w-[330px] bg-black opacity-85">
        <div className=" flex justify-center flex-col">
          <div className="w-full flex justify-center relative pt-6">
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 max-sm:w-20 max-sm:h-20 rounded-full"
            />
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="btn btn-primary absolute bottom-0 right-24"
            >
              <TiEdit size={23} />
            </button>
          </div>
          <div className="w-full h-full flex flex-col items-center pt-2">
            {profileData ? (
              <>
                <h1>
                  <b>
                    <i>{profileData?.Name || "N/A"}</i>
                  </b>
                </h1>
                <h1>
                  <b>{profileData?.email || "N/A"}</b>
                </h1>
              </>
            ) : (
              <p>No user details available.</p>
            )}

            <button
              onClick={handleLogout}
              className="logout-button bg-gradient-to-b from-red-500 to-red-900 rounded-lg p-1 w-52 max-sm:w-[210px] mt-2"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
