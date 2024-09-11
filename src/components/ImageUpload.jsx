// import React, { useRef, useState } from 'react'
// import {Button} from 'react-bootstrap';
// import {MdModeEdit} from 'react-icons/md'


// const ImageUpload = (props) => {

//     const [file, setFile] = useState();
//     const [previewUrl, setPreviewUrl] = useState();
//     const filePickerRef = useRef();

//   return (
//     <div>
//       <input
//       id={props.id}
//       ref={filePickerRef}
//       style={{display: "none"}}
//       type='file'
//       accept='.jpg,.png,.jpeg'
//       onChange={pickedHandler}
//       />
//       <div className={`image-upload ${props.center && "center"}`}>
//         <div className='image-upload_preview'>
//             {previewUrl && <img src={previewUrl} alt='preview'/>}
//             {!previewUrl && (
//                 <div className='center'>
//                     <Button className='image-upload-button' type='button' onClick={pickedImageHandler}>+</Button>
//                 </div>
//             )}
//         </div>
//         <div>
//             {previewUrl && (
//                 <div className='center'>
//                     <Button className='image-upload-button' type='button' onClick={pickedImageHandler}>
//                         <MdModeEdit className='icon'></MdModeEdit>
//                     </Button>
//                 </div>
//             )}
//         </div>
//       </div>
//     </div>
//   )
// }

// export default ImageUpload
