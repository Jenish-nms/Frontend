import axios from "axios";
import React, { useState, useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';


export default function BandwidthServiceListForVendor({value, isInterVendor, isInterEms}) {
    const vendorName = value;
    //console.log(isInterVendor)
    //console.log(vendorName)
  const [bandwidthServiceList, setBandwidthServiceList] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if(isInterVendor && isInterEms) {
          url = "/bandwidth/vendor/interEmsAndInterVendor"
          } else if(isInterVendor){
          url = "/bandwidth/interVendor"
          } else if(isInterEms){
              url = "/bandwidth/vendor/interEms"
          } else {
              url = "/bandwidth/vendor"
          }

        if(url) {
          const response = await axios.get(url, {
            params: {vendorName}
          });
          setBandwidthServiceList(response.data);
          //console.log(response.data);
        }
      } catch (error) {
        console.log("Error fetching in BandwidthService...", error);
      } finally {
        setLoading(false)
      }
    };

    fetchData();
  }, [vendorName, isInterVendor, isInterEms]);

  const renderService = (data) => (
    <div className="mb-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0"><strong>Label:</strong> {data.label}</h5>
        </div>
        <div className="card-body">
          <p className="card-text"><strong>Layer Rate:</strong> {data.layerRate}</p>
          <p className="card-text"><strong>Vendor Name:</strong> {data.vendorName}</p>
          <p className="card-text"><strong>A-End Location:</strong> {data.aEndLocation}</p>
          <p className="card-text"><strong>Z-End Location:</strong> {data.zEndLocation}</p>
          <p className="card-text"><strong>Inter EMS:</strong> {data.interEms}</p>
          <p className="card-text"><strong>Inter Vendor:</strong> {data.interVendor}</p>
  
          <h6>A-End List:</h6>
          <ul className="list-group mb-2">
            {data.aEndList.map((item, idx) => (
              <li key={idx} className="list-group-item">
                <span><strong>TP Name:</strong> {item.tpName}</span><br />
                <span><strong>TP Role:</strong> {item.tpRole}</span>
              </li>
            ))}
          </ul>
  
          <h6>Z-End List:</h6>
          <ul className="list-group mb-2">
            {data.zEndList.map((item, idx) => (
              <li key={idx} className="list-group-item">
                <span><strong>TP Name:</strong> {item.tpName}</span><br />
                <span><strong>TP Role:</strong> {item.tpRole}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Bandwidth Service List</h2>
      {loading ? (
                <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100px' }}>
                     <ThreeDots
                        visible={true}
                        height="80"
                        width="80"
                        color="#4fa94d"
                        radius="9"
                        ariaLabel="three-dots-loading"
                    />
                    <p>Fetching data, please wait...</p>
                </div>
      ) : (
          <div className="row">
            {bandwidthServiceList.map((data, index) => (
              renderService(data)
            ))}
          </div>
      )}
    </div>
  );
}