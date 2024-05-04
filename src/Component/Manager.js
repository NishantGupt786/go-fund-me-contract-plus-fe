import React, { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import { ethers } from "ethers";
import axios from "axios";
const Manager = () => {
  const App = useContext(AppState);
  const [Data, setData] = useState([]);
  const [request, setRequest] = useState([]);
  const [num, setnum] = useState(0);

  const Fulfilled = async (id, recipient, description, target) => {
    try {
      console.log("Request Fulfilled with id:", id);
      const tx = await App.Charitycontract.fulfillRequest(id);
      await tx.wait();
      alert("Request Completed!");
      const data = {
        walletAddress: recipient,
        description: description,
        target: target,
      };
      const res = await axios.post(
        "https://blockchain-charity-basic-backend.onrender.com/update/complete",
        data
      );
      console.log(res);
    } catch (e) {
      console.error("Error donating:", e);
      alert("Error donating: " + e.message);
    }
  };

  async function Approve(description, amountNeeded, recipient, deadline) {
    try {
      console.log({
        description: description,
        target: amountNeeded,
        walletAddress: recipient,
        deadline: deadline,
      });
      const tx = await App.Charitycontract.createRequest(
        description,
        ethers.utils.parseEther(amountNeeded),
        recipient,
        deadline
      );
      await tx.wait();
      console.log(tx);
      alert("Request created successfully!");
      const response = await axios.post(
        "https://blockchain-charity-basic-backend.onrender.com/update/approve",
        {
          walletAddress: recipient,
          description: description,
          target: amountNeeded,
        }
      );
      console.log(response);
      setData((prevData) =>
        prevData.filter(
          (item) =>
            item.walletAddress !== recipient &&
            item.description !== description &&
            item.target !== amountNeeded
        )
      );
    } catch (error) {
      console.error("Error creating request:", error);
      alert("Error creating request: " + error.message);
    }
  }

  useEffect(() => {
    const getProposals = async () => {
      try {
        const response = await axios.get(
          "https://blockchain-charity-basic-backend.onrender.com/unapproved"
        );
        const proposals = response.data.data;
        setData(proposals);
        console.log(proposals);
      } catch (error) {
        console.log(error);
      }
    };
    const getRequests = async () => {
      try {
        const Count = await App.Charitycontract.numRequests();
        let proposals = [];
        for (let i = 0; i < Count; i++) {
          const Proposal = await App.Charitycontract.requests(i);

          proposals.push(Proposal);
        }
        setRequest(proposals);
      } catch (error) {
        console.log(error);
      }
    };
    getRequests();
    getProposals();
  }, [num]);

  return (
    <div>
      <div className="container px-5 py-5 mx-auto">
        <h1 className="text-black font-bold text-2xl pl-4">
          All Pending Requests
        </h1>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {Data && Data?.length !== 0 ? (
            Data.map((e, id) => {
              return (
                <div className="p-4">
                  <div className="h-full bg-gray-100 bg-opacity-75 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                    <h2 className="tracking-widest -ml-5 text-15px title-font font-medium text-gray-900 mb-1">
                      Recipient Address
                    </h2>
                    <h2 className="tracking-widest -ml-5 text-base title-font font-medium text-gray-900 mb-1">
                      {e.walletAddress}
                    </h2>
                    <h1 className="title-font sm:text-xl text-lg font-medium text-gray-900 mb-3"></h1>
                    <p className="leading-relaxed mt-5 mb-5">{e.description}</p>
                    <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                      <span className="text-black font-bold mr-1 inline-flex items-center leading-none text-sm pr-1 py-1 border-r-2 border-gray-200">
                        Deadline
                      </span>
                      <span className="text-black font-bold  inline-flex items-center leading-none text-sm mr-4">
                        {Number(e.deadline.toString())}
                      </span>
                      <span className="text-black font-bold mr-1 inline-flex items-center leading-none text-sm pr-1 py-1 border-r-2 border-gray-200">
                        Target
                      </span>
                      <span className="text-black font-bold  inline-flex items-center leading-none text-sm">
                        {Number(e.target.toString())} ETH {}
                      </span>
                    </div>

                    <div className="flex justify-center absolute bottom-10 left-0 w-full py-4">
                      {/* <button onClick={() => Vote(Number(e.uniqueid.toString()))} class="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded">Vote</button> */}
                      <button
                        onClick={() =>
                          Approve(
                            e.description,
                            e.target,
                            e.walletAddress,
                            Number(e.deadline.toString())
                          )
                        }
                        className="flex mx-auto mt-10 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                      >
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div class="flex items-center pl-4 h-1/2">
              <div class="title-font sm:text-lg text-lg font-medium text-gray-900 mt-8">
                No Pending Requests.
              </div>
            </div>
          )}
        </div>
        <h1 className="text-black font-bold text-2xl pl-4">
          All Donation Requests
        </h1>

        <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
          {request.map((e, index) => (
            <div key={index} className="p-4">
              <div className="h-full bg-gray-100 bg-opacity-75 pt-8 pb-16 rounded-lg overflow-hidden text-center relative">
                <h2 className="tracking-widest text-15px title-font font-medium text-gray-900 mb-1">
                  Recipient Address
                </h2>
                <h2 className="tracking-widest text-base title-font font-medium text-gray-900 mb-1">
                  {e.recipient}
                </h2>
                <p className="leading-relaxed mt-5 mb-5">{e.description}</p>
                <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                  <span className="text-black font-bold mr-1 inline-flex items-center leading-none text-sm pr-1 py-1 border-r-2 border-gray-200">
                    Deadline
                  </span>
                  <span className="text-black font-bold inline-flex items-center leading-none mr-4 text-sm">
                    {Number(e.deadline.toString())}
                  </span>
                  <span className="text-black font-bold mr-1 inline-flex items-center leading-none text-sm pr-1 py-1 border-r-2 border-gray-200">
                    Target
                  </span>
                  <span className="text-black font-bold inline-flex items-center leading-none text-sm mr-4">
                    {Number(e.amountNeeded.toString()) / 10 ** 18} ETH
                  </span>
                  <span className="text-black font-bold mr-1 inline-flex items-center leading-none text-sm pr-1 py-1 border-r-2 border-gray-200">
                    Raised
                  </span>
                  <span className="text-black font-bold inline-flex items-center leading-none text-sm">
                    {Number(e.amountRaised.toString()) / 10 ** 18} ETH
                  </span>
                </div>
                {e.completed !== true ? (
                  <div className="flex flex-col justify-center items-center w-full mt-4">
                    <div className="flex gap-x-8">
                      {localStorage.getItem("Address") ===
                        "0xca4ca72400622883ddf52d05b05a4f20d1fe0ef5" && (
                        <button
                          onClick={() =>
                            Fulfilled(
                              index,
                              e.recipient,
                              e.description,
                              e.amountNeeded
                            )
                          }
                          className="mt-4 text-white bg-green-400 border-0 py-2 px-6 focus:outline-none hover:bg-green-600 rounded"
                        >
                          Complete
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-green-400">
                    This request was completed successfully
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Manager;
