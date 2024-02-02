import React, { useEffect, useRef, useState } from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import {app} from '../firebase'
import {Link} from 'react-router-dom'
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserStart, signOutUserSuccess, updateUserFailure, updateUserStart, updateUserSuccess } from '../redux/user/userSlice'

const Profile = () => {
  const dispatch=useDispatch()
  const {currentUser,loading,error}=useSelector((state)=>state.user)
  const fileRef=useRef(null)
  const [file,setFile]=useState(undefined)
  const [filePerc,setFilePerc]=useState(0)
  const [fileUploadError,setFileUploadError]=useState(false)
  const [updateSuccess,setUpdateSuccess]=useState(false)
  const [formData,setFormData]=useState({})
  useEffect(()=>{
    if(file){
      handleFileUpload(file)
    }
  },[file])
  const handleFileUpload=(file)=>{
    const storage=getStorage(app)
    const fileName=new Date().getDate() + file.name;
    const storageRef=ref(storage,fileName)
    const uploadTask=uploadBytesResumable(storageRef,file)
    uploadTask.on('state_changed',
      (snapshot)=>{
        const progress=(snapshot.bytesTransferred/snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress));
      },
    (error)=>{
      setFileUploadError(true)
    },
    ()=>{
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
        setFormData({...formData,avatar:downloadURL})
      })
      setFile(undefined)
    })
  }
  const handleChange=(e)=>{
    setFormData({
      ...formData,
      [e.target.id]:e.target.value
    })
  }
  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      const res=await fetch(`/api/user/update/${currentUser._id}`,{
        method:"POST",
        headers:{
          'Content-type':'application/json',
        },
        body:JSON.stringify(formData)
      })
      const data=await res.json();
      if(data.success===false){
        dispatch(updateUserFailure(error.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDeleteUser=async()=>{
    try {
      dispatch(deleteUserStart())
      const res=await fetch( `/api/user/delete/${currentUser._id}`,{
        method:"DELETE"
      })
      const data=await res.json();
      if(data.success===false){
        dispatch(deleteUserFailure(error.message))
        return;
      }
      dispatch(deleteUserSuccess())
     } 
      catch (error) {
      dispatch(deleteUserFailure(error.message))
    }
  }
  const handleSignOut=async()=>{
    try {
      dispatch(signOutUserStart())
      const res=await fetch("/api/auth/signout")
      const data=res.json()
      if(data.success===false){
        dispatch(signOutUserFailure(data.message))
        return;
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signOutUserFailure(data.message)) 
    }
  }
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
        <input type="file" onChange={(e)=>setFile(e.target.files[0])} ref={fileRef} hidden accept='image/*' />
        <img src={formData.avatar || currentUser.avatar} onClick={()=>fileRef.current.click()} alt="profile" className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' />
        <p className='text-sm self-center'>
          {
            fileUploadError ? <span className='text-red-700'>Error Image Upload(Image must be less than 2 mb)</span>:
            (
              filePerc > 0 && filePerc < 100 ? (
                <span className="text-slate-700">
                  {`Uploading ${filePerc}%`}
                </span>
              )
              :(
                filePerc===100 ? (
                  <span className='text-green-700'>
                    Image Successfully Uploaded
                  </span>
                ) :""
              )
            )
          }
        </p>
        <input type="text" defaultValue={currentUser.username}  placeholder='username' className='border p-3 rounded-lg' id='username' onChange={handleChange}/>
        <input type="email" defaultValue={currentUser.email}  placeholder='email' className='border p-3 rounded-lg' id='email' onChange={handleChange}/>
        <input type="password"  placeholder='password' className='border p-3 rounded-lg' id='password' onChange={handleChange}/>
        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80' disabled={loading}> {loading?"Loading":"Update"}</button>
        <Link to={"/create-listing"} className='bg-green-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95'>
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
      <p className='text-red-700 mt-5'>{error ? error :""}</p>
      <p className='text-green-700 mt-5'>{updateSuccess ? "User is updated successfully!" :""}</p>
    </div>
  )
}

export default Profile