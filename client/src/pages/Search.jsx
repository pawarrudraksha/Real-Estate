import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingItem from '../components/ListingItem'

export default function Search() {
  const navigate=useNavigate()  
  const [loading,setLoading]=useState(false)
  const [listing,setListing]=useState(false)
  const [showMore,setShowMore]=useState(false)
  const [sidebardata,setSidebardata]=useState({
    searchTerm:'',
    type:'all',
    parking:false,
    furnished:false,
    offer:false,
    sort:'created_at',
    order:'desc'
  })
  useEffect(()=>{
    const urlParams=new URLSearchParams(location.search)
    const searchTermFromUrl=urlParams.get('searchTerm')
    const typeFromUrl=urlParams.get('type')
    const offerFromUrl=urlParams.get('offer')
    const parkingFromUrl=urlParams.get('parking')
    const furnishedFromUrl=urlParams.get('furnished')
    const sortFromUrl=urlParams.get('sort')
    const orderFromUrl=urlParams.get('order')
    if(
         searchTermFromUrl ||
         typeFromUrl ||
         offerFromUrl ||
         parkingFromUrl ||
         furnishedFromUrl ||
         sortFromUrl ||
         orderFromUrl
    ){
        setSidebardata({
            searchTerm:searchTermFromUrl || '',
            type:typeFromUrl || "all",
            offer:offerFromUrl  ==='true'?true:false,
            parking: parkingFromUrl ==='true'?true:false,
            furnished:furnishedFromUrl  ==='true'?true:false,
            sort:sortFromUrl || 'created_at',
            order:orderFromUrl || 'desc'
        })
    }
    const fetchListings=async()=>{
        setLoading(true)
        setShowMore(false)
        const searchQuery=urlParams.toString()
        const res=await fetch(`/api/listing/get?${searchQuery}`)
        const data=await res.json()
        if(data.length>8){
            setShowMore(true)
        }else{
            setShowMore(false)
        }
        setListing(data)
        setLoading(false)
    }
    fetchListings()
  },[location.search])
  const handleChange=(e)=>{
    if(e.target.id==='all' || e.target.id==='rent' || e.target.id==='sale'){
        setSidebardata({...sidebardata,type:e.target.id})
    }
    console.log(e.target.value);
    if(e.target.id==='searchTerm'){
        setSidebardata({...sidebardata,searchTerm:e.target.value})
    }
    if(e.target.id==='parking' || e.target.id==='furnished' || e.target.id==='offer'){
        setSidebardata({...sidebardata,[e.target.id]:e.target.checked || e.target.checked==='true'?true:false})
    }
    if(e.target.id==='sort_order'){
        const sort=e.target.value.split('_')[0] || 'created_at'
        const order=e.target.value.split('_')[1] ||  'desc'
        setSidebardata({...sidebardata,sort,order})
    }
  }

  const handleSubmit=async(e)=>{
    e.preventDefault()
    const urlParams=new URLSearchParams()
    urlParams.set('searchTerm',sidebardata.searchTerm)
    urlParams.set('type',  sidebardata.type)
    urlParams.set('parking',  sidebardata.parking)
    urlParams.set('furnished',  sidebardata.furnished)
    urlParams.set('offer',  sidebardata.offer)
    urlParams.set('sort',  sidebardata.sort)
    urlParams.set('order',  sidebardata.order)
    const searchQuery=urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }
  const onShowMoreClick=async()=>{
    const numberOfListings=listing.length
    const startIndex=numberOfListings
    const urlParams=new URLSearchParams(location.search)
    urlParams.set('startIndex',startIndex)
    const searchQuery=urlParams.toString()
    const res=await fetch(`/api/listing/get?${searchQuery}`)
    const data=await res.json()
    if(data.length<9){
        setShowMore(false)
    }
    setListing([...listing,...data])
  }
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className="flex items-center gap-2">
                     <label className='whitespace-nowrap font-semibold'>Search Term</label>
                     <input type="text" value={sidebardata.searchTerm} onChange={handleChange}  id="searchTerm" placeholder='Search...' className='border rounded-lg p-3 w-full' />
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label  className='font-semibold'>Type:</label>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="all" checked={sidebardata.type==='all'} onChange={handleChange}/>
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="rent" checked={sidebardata.type==='rent'} onChange={handleChange} />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="sale" checked={sidebardata.type==='sale'} onChange={handleChange} />
                        <span>Sale</span>
                    </div>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="offer" checked={sidebardata.offer} onChange={handleChange} />
                        <span>Offer</span>
                    </div>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                    <label className='font-semibold' >Amenities:</label>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="parking" checked={sidebardata.parking} onChange={handleChange}/>
                        <span>Parking</span>
                    </div>
                    <div className='flex gap-2' >
                        <input type="checkbox" className='w-5'  id="furnished" checked={sidebardata.furnished} onChange={handleChange} />
                        <span>Furnished</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <label  className='font-semibold'>Sort:</label>
                    <select id="sort_order" className='border rounded-lg p-3' onChange={handleChange} defaultValue={'created_at_desc'} >
                        <option value='regularPrice_desc' >Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value="createdAt_desc">Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>
                </div>
                <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>
                    Search
                </button>
            </form>
        </div>
        <div className="flex-1">
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {
                    !loading && listing.length === 0 && (
                        <p className='text-xl text-slate-700'>No listing found</p>
                    )
                }
                {
                    loading && (
                        <p className='text-xl text-slate-700 text-center w-full'>Loading...</p>
                    )
                }
                {
                    !loading && listing && listing.map((listing)=>(
                        <ListingItem key={listing._id} listing={listing}/>
                    ))
                }
                {
                    showMore && (
                        <button onClick={onShowMoreClick} className='text-green-700 hover:underline p-7 text-center w-full'>
                            Show more
                        </button>
                    )
                }
            </div>
        </div>
    </div>
  )
}
