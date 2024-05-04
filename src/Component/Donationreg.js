import React, { useState, useContext,useEffect} from 'react'
import { AppState } from '../App'
import { ethers } from 'ethers';
import { stringify } from 'postcss';
import axios from 'axios';
const DonationReq = () => {
    const App = useContext(AppState);
    const [Address, setAddress] = useState();
    const [target, settarget] = useState();
    const [Description, setDescription] = useState();
    const [limit, setLimit] = useState();

    const Create = async () => {
        try {

            const data = {
                walletAddress: Address,
                description: Description,
                target: target,
                deadline: limit
            }
            const res = await axios.post('https://blockchain-charity-basic-backend.onrender.com/add-org', data)
            console.log(res)
            alert("Request successfully created!")
            setAddress('')
            settarget('')
            setDescription('')
            setLimit(null)
        } catch (error) {
            // console.log(JSON.stringify(error))
            console.log(error)
        }
    };
  return (
      <div>
          <section className="text-gray-600 body-font relative">
              <div className="container px-5 py-10 mx-auto">
                  {/* <div className="flex flex-col text-center w-full mb-12">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-0 text-gray-900">Contract Balance -: {(Balance.toString()) / 10 ** 18} ETH</h1>
                  </div> */}
                  <div className="flex flex-col text-center w-full mb-12">
                      <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-gray-900">Create Request</h1>
                      <p className="lg:w-2/3 mx-auto leading-relaxed text-base">Here you can request the owner of the contract to publish your request.</p>
                  </div>
                  <div className="lg:w-1/2 md:w-2/3 mx-auto">
                      <div className="flex flex-wrap -m-2">
                          <div className="p-2 w-1/2">
                              <div className="relative">
                                  <label htmlFor="name" className="leading-7 text-sm text-gray-600">Recipient Address</label>
                                  <input value={Address} onChange={(e) => setAddress(e.target.value)} type="text" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                              </div>
                          </div>
                          <div className="p-2 w-1/2">
                              <div className="relative">
                                  <label htmlFor="email" className="leading-7 text-sm text-gray-600">Taget in ETH</label>
                                  <input value={target} onChange={(e) => settarget(e.target.value)} type="text"  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                              </div>
                          </div>
                          <div className="p-2 w-full">
                              <div className="relative">
                                  <label htmlFor="message" className="leading-7 text-sm text-gray-600">Description</label>
                                  <textarea value={Description} onChange={(e) => setDescription(e.target.value)} id="message" name="message" className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"></textarea>
                              </div>
                          </div>
                          <div className="p-2 w-full">
                              <div className="relative">
                                  <label htmlFor="timelimit" className="leading-7 text-sm text-gray-600">Time Limit</label>
                                  <input value={limit} onChange={(e) => setLimit(e.target.value)} type="text"  className="w-full bg-gray-100 bg-opacity-50 rounded border border-gray-300 focus:border-yellow-500 focus:bg-white focus:ring-2 focus:ring-yellow-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"/>
                              </div>
                          </div>
                          <div className="p-2 w-full">
                              <button onClick={() => Create()} className="flex mx-auto text-white bg-yellow-500 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded text-lg">Submit</button>
                          </div>
                 
                      </div>
                  </div>
              </div>
          </section>
    </div>
  )
}

export default DonationReq;