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
import AvatarEditor from "react-avatar-editor";
import { RxCross2 } from "react-icons/rx";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, profileData } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [editorRef, setEditorRef] = useState(null);
  const [isEditorVisible, setIsEditorVisible] = useState(false);

  // Upload new image to Firebase Storage
  const handleFileUpload = async () => {
    if (file && editorRef) {
      try {
        // Get image data from the editor (cropped area)
        const canvas = editorRef.getImageScaledToCanvas();
        const croppedImage = canvas.toDataURL(); // Convert cropped image to data URL

        // Upload cropped image to Firebase Storage
        const fileRef = ref(storage, `profileImages/${user.uid}`);
        const response = await fetch(croppedImage);
        const blob = await response.blob();

        await uploadBytes(fileRef, blob);
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

        setIsEditorVisible(false); // Hide editor after uploading
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
      setImagePreview(URL.createObjectURL(selectedFile)); // Preview the selected image
      setIsEditorVisible(true); // Show the editor once an image is selected
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
    <div className=" h-[696px] md:h-screen bg-[url('../images/hero.jpg')] bg-cover bg-center flex items-center justify-center max-sm:flex-col gap-x-1 max-sm:gap-y-1 pt-10 max-sm:pt-16">
      <div className="h-[540px] w-80 max-sm:h-[450px] max-sm:w-[330px] bg-black opacity-85 relative">
        <div className="flex justify-center flex-col">
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
              accept="image/jpeg, image/jpg, image/png, image/webp"
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
      {/* Overlay when the editor is visible */}
        {isEditorVisible && (
          <>
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></div>
            <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-20">
              <div className="w-full h-full flex justify-center items-center">
                <div className=" w-[400px] flex flex-col justify-center bg-zinc-900 p-4 rounded-xl shadow-lg relative">
                  <div className="w-full pl-10">
                  <AvatarEditor
                    ref={(ref) => setEditorRef(ref)}
                    image={imagePreview}
                    width={250}
                    height={250}
                    border={20}
                    borderRadius={125}
                    scale={1.2}
                    rotate={0}
                  />
                  </div>       
                  <div className="flex justify-center gap-4 mt-4">
                    <button
                      onClick={handleFileUpload}
                      className="btn btn-primary bg-white text-black px-6 py-2 rounded-full"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setIsEditorVisible(false)}
                      className="btn btn-primary text-white p-2 rounded-lg absolute top-0 right-0"
                    >
                      <RxCross2/>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
    </div>
  );
};

export default ProfilePage;
