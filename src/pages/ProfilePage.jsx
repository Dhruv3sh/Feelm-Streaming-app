import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TiEdit } from "react-icons/ti";

const ProfilePage = () => {
  const user = useAuth();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // URL for profile image

  // Fetch user data
  const fetchUserData = async () => {
    if (user) {
      try {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserDetails(userData);
          setImageUrl(userData.profileImageUrl || null); // Load profile image if available
        } else {
          console.error("No user data found");
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      }
    }
  };

  // Upload new image to Firebase Storage
  const handleFileUpload = async (selectedFile) => {
    if (selectedFile) {
      try {
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(fileRef, selectedFile); // Upload file to Firebase Storage

        const downloadURL = await getDownloadURL(fileRef); // Get the file's download URL
        setImageUrl(downloadURL);

        // Update Firestore with new profile image URL
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImageUrl: downloadURL });
        toast.success("Profile image updated!", {position: "top-center", autoClose: 1200, hideProgressBar: true, theme: "dark", });
      } catch (error) {
        toast.error("error updating image, try different image", {position: "top-center", autoClose: 1200, hideProgressBar: true,theme: "dark", });
      }
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile); // Optional: Keep track of the selected file
      handleFileUpload(selectedFile); // Automatically upload the selected file
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const redirectedFromLogin =
      localStorage.getItem("redirectedFromLogin") === "true";

    if (redirectedFromLogin && userDetails) {
      // Show toast message
      toast.success(`Welcome ${userDetails.Name}`, {
        position: "top-center",
        autoClose: 1200,
        theme: "dark",
        hideProgressBar: true,
      });

      // Clear the flag
      localStorage.removeItem("redirectedFromLogin");
    }
  }, [userDetails]);

  if (!user) {
    return (
      <div className=" text-4xl flex justify-center items-center bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center h-screen pt-12">
        Please log in to view your profile..
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/UserLogin"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
  };

  return (
    <div className="h-screen bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center max-sm:flex-col gap-x-1 max-sm:gap-y-1 pt-10 max-sm:pt-16">
      <div className=" h-[540px] w-80 max-sm:h-[450px] max-sm:w-[330px] bg-black opacity-85">
        <div className=" h-full flex justify-center flex-col">
          <div className="w-full flex justify-center relative pt-6 ">
            {/* Display user image or default icon */}
            <img
              src={imageUrl ||"/images/default.png" }
              alt="Profile"
              className="w-24 h-24 max-sm:w-20 max-sm:h-20 rounded-full"
            />
            {/* Hidden file input */}
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            {/* Button to trigger file input */}
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="btn btn-primary absolute bottom-0 right-24" 
            >
              <TiEdit size={23}/>
            </button>
          </div>
          <div className="w-full h-full flex flex-col items-center pt-2">
          {userDetails ? (
            <>
              <h1><b><i>{userDetails.Name}</i></b></h1>
              <h1><b>{userDetails.email}</b></h1>
            </>
          ) : (
            <p>No user details available.</p>
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="logout-button bg-gradient-to-b from-red-500 to-red-900 rounded-lg p-1 w-52 max-sm:w-[210px]  mt-2"
            aria-label="Logout">
            Logout
          </button>
          </div>
        </div>
      </div>
      <div className=" h-[540px] w-[710px] max-sm:h-[490px] max-sm:w-[330px] bg-black opacity-85">
        <div className=" flex gap-2 justify-center w-full h-full">
          <p>Reviews </p>
          <p>Add to list</p>
          <p>Continue watching</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
