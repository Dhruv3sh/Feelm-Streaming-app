import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../components/Firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TiEdit } from "react-icons/ti";
import { useDispatch, useSelector } from "react-redux";
import { setUser} from '../store/authSlice';
import { setProfileData, setProfileError, setProfileLoading } from "../store/profileSlice";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // State from Redux
  const user = useSelector((state) => state.auth?.user);
  const profileData = useSelector((state) => state.profile?.profileData);
  // const profileLoading = useSelector((state) => state.profile?.profileLoading);

  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // URL for profile image

  // Fetch user data from Firestore and update Redux
  const fetchProfileData = async () => {
    if (user) {
      try {
        dispatch(setProfileLoading(true));
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          dispatch(setProfileData(userData));
          setImageUrl(userData.profileImageUrl || "/images/default.png");
        } else {
          dispatch(setProfileError("No user data found"));
        }
      } catch (error) {
        dispatch(setProfileError("Error fetching profile data: " + error.message));
      } finally {
        dispatch(setProfileLoading(false));
      }
    }
  };

  // Upload new image to Firebase Storage
  const handleFileUpload = async (selectedFile) => {
    if (selectedFile) {
      try {
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        await uploadBytes(fileRef, selectedFile);

        const downloadURL = await getDownloadURL(fileRef);
        setImageUrl(downloadURL);

        // Update Firestore with new profile image URL
        const userDocRef = doc(db, "users", user.uid);
        await updateDoc(userDocRef, { profileImageUrl: downloadURL });

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

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await signOut(auth);
      dispatch(setUser(null));
      localStorage.setItem("redirectedFromProfile","true");
      navigate("/");
    } catch (error) {
      console.error("Logout Error:", error.message);
    }
    
  };

  if (!user) {
    return (
      <div className="text-4xl flex justify-center items-center bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center h-screen pt-12">
        log in to view your profile..
      </div>
    );
  }


  return (
    <div className="h-screen bg-[url('../public/images/hero.jpg')] bg-no-repeat bg-cover bg-center flex items-center justify-center max-sm:flex-col gap-x-1 max-sm:gap-y-1 pt-10 max-sm:pt-16">
      <div className="h-[540px] w-80 max-sm:h-[450px] max-sm:w-[330px] bg-black opacity-85">
        <div className="h-full flex justify-center flex-col">
          <div className="w-full flex justify-center relative pt-6">
            <img
              src={imageUrl || "/images/default.png"}
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
                    <i>{profileData?.Name}</i>
                  </b>
                </h1>
                <h1>
                  <b>{profileData?.email}</b>
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
