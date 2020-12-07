
import React, { useState } from 'react';
import "./createGroup.scss"
import { CircularProgress } from "@material-ui/core"
import { groupsRef } from "../../../firebase/config.firebase"
import { uuid } from "uuidv4"
import { resizeImage } from "../../../helpers/helpers"
const STATIC_SRC = "https://i.ibb.co/WWbGCkf/gallery.png"

const CreateGroup = ({ setState, done }) => {

   const [me, setMe] = useState({
      imageUploading: false,
      groupSrc: STATIC_SRC,
      groupName: ""
   })

   const handleInputChange = async ({ target }) => {
      if (target.name === 'image') {
         setMe({ ...me, imageUploading: true })
         let image = await resizeImage({ file: target.files[0], maxSize: 1024 })
         let { ref } = await groupsRef.child(`/${uuid()}.jpeg`).put(image)
         let url = await ref.getDownloadURL()
         setMe({ ...me, groupSrc: url, imageUploading: false })
      } else if (target.name === 'name') {
         setMe({ ...me, groupName: target.value })
      }
   }

   const createGroup = () => {
      if (me.groupName.trim() !== "") {
         done({
            name: me.groupName,
            thumbnail: me.groupSrc !== STATIC_SRC ? me.groupSrc : ""
         });
      }
   }

   return (
      <div className="overlay pos-fxd w-100 h-100">
         <div className='create-group pos-abs to-center rounded'>
            <i onClick={() => setState({ createGroup: false })} className="close fal fa-times pos-abs top-1 right-2 pointer"></i>
            <div className="pa-5 pos-rel">
               <div className="group-image pos-rel mx-auto">
                  {me.imageUploading ?
                     <div className='pos-abs to-center'><CircularProgress color="secondary" /></div> :
                     <div className="inner-overlay circle pos-abs w-100 h-100p">
                        <input name="image" onChange={handleInputChange} className='pos-abs pointer wh-100' type="file" accept="image/*" />
                        <i className="fal fa-camera fa-lg pos-abs to-center text-white" />
                     </div>
                  }
                  <img className="w-100 h-100p circle" src={me.groupSrc} />
               </div>
            </div>
            <div className="text-center px-10 pb-5 mb-8">
               <input onChange={handleInputChange} value={me.groupName} name="name" className="group-name px-8 py-4 w-100" type="text" placeholder="Enter group name" />
            </div>
            <div className="actions px-5 pb-5 mb-5">
               <button onClick={createGroup} className="done mx-auto d-block px-5 py-3 pointer">create group</button>
            </div>
            {/* <hr className="divider light" />
            <div className="text-center pa-5">
               add friend
            </div> */}
         </div>
      </div>
   );
}

export default CreateGroup;
