import React, { useState, useEffect, useContext } from "react";
import { AppState } from "../App";
import { ethers } from "ethers";
import axios from "axios";

const Request = () => {
  const App = useContext(AppState);
  const [Data, setData] = useState([]);
  const [num, setnum] = useState(0);
  const [donationAmount, setDonationAmount] = useState(0);

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
  const Donate = async (id, amount) => {
    try {
      const amountInWei = ethers.utils.parseEther(amount);
      console.log(id);
      const tx = await App.Charitycontract.donate(id, { value: amountInWei });
      await tx.wait();
      alert("Donated Successfully!");
      setnum(num + 1);
    } catch (error) {
      console.error("Error donating:", error);
      alert("Error donating: " + error.message);
    }
  };

  useEffect(() => {
    const getProposals = async () => {
      try {
        const Count = await App.Charitycontract.numRequests();
        let proposals = [];
        for (let i = 0; i < Count; i++) {
          const Proposal = await App.Charitycontract.requests(i);
          console.log(Proposal.completed);
          console.log(Proposal);
          proposals.push(Proposal);
        }
        setData(proposals);
      } catch (error) {
        console.log(error);
      }
    };
    getProposals();
  }, [num]);

  return (
    <div className="container px-5 py-5 mx-auto">
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {Data && Data?.length !== 0 ? (
          Data.map((e, id) => (
            <div key={id} className="p-4">
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
                    <input
                      type="number"
                      className="rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 py-3 px-2 w-3/4"
                      placeholder="Enter amount to donate"
                      onChange={(e) => setDonationAmount(e.target.value)}
                    />
                    <div className="flex gap-x-8">
                      <button
                        onClick={() => Donate(id, donationAmount)}
                        className="mt-4 text-white bg-yellow-400 border-0 py-2 px-8 focus:outline-none hover:bg-yellow-600 rounded"
                      >
                        Donate
                      </button>
                      {localStorage.getItem("Address") ===
                        "0xca4ca72400622883ddf52d05b05a4f20d1fe0ef5" && (
                        <button
                          onClick={() =>
                            Fulfilled(
                              id,
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
                  <div className="text-green-400 pt-5">
                    <p>This Donation has reached its target amount.</p>
                    <p>Thank you for donating :)</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-1/2">
            <div className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">
              No Proposals found.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Request;
