import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

function ConnectionLessServiceListForVendor({value, isInterVendor, isInterEms, serviceType}) {
    const vendorName = value;
    const [connectionLessServiceList, setConnectionLessServiceList] = useState([]);
    const [loading, setLoading] = useState(true);

    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                let url;

                if(isInterVendor && isInterEms && serviceType) {
                    url = "/connectionLessService/vendor/interVendorAndInterEms/serviceType"
                } else if(isInterVendor && isInterEms) {
                    url = "/connectionLessService/vendor/interEmsAndInterVendor"
                } else if(isInterVendor && serviceType) {
                    url = "/connectionLessService/vendor/interVendor/serviceType"
                } else if(isInterEms && serviceType) {
                    url = "/connectionLessService/vendor/interEms/serviceType"
                } else if(isInterVendor){
                    url = "/connectionLessService/interVendor"
                } else if(isInterEms){
                    url = "/connectionLessService/vendor/interEms"
                } else if(serviceType && vendorName){
                    url = "/connectionLessService/vendor/serviceType"
                } else {
                    url = "/connectionLessService/vendor"
                }

                const params = serviceType ? { serviceType, vendorName } : { vendorName };

                if (url) {
                    const response = await axios.get(url, { params });
                    setConnectionLessServiceList(response.data);
                    //console.log(response.data);
                }
            } catch (error) {
                console.log("Error fetching in ConnectionLessService...", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [vendorName, isInterVendor, isInterEms, serviceType]);

    const renderService = (data) => (
        <div className="mb-4">
            <div className="card shadow-sm">
                <div className="card-header bg-primary text-white">
                    <h5 className="mb-0"><strong>Label:</strong> {data.label}</h5>
                </div>
                <div className="card-body">
                    <p className="card-text"><strong>Service Type:</strong> {data.serviceType}</p>
                    <p className="card-text"><strong>Vendor Name:</strong> {data.vendorName}</p>
                    <p className="card-text"><strong>A-End Location:</strong> {data.aEndLocation}</p>
                    <p className="card-text"><strong>Z-End Location:</strong> {data.zEndLocation}</p>
                    <p className="card-text"><strong>Inter EMS:</strong> {data.interEms}</p>
                    <p className="card-text"><strong>Inter Vendor:</strong> {data.interVendor}</p>
                    <p className="card-text"><strong>User Label:</strong> {data.userLabel}</p>
                    <p className="card-text"><strong>FDFr Type:</strong> {data.fdFrType}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">ConnectionLess Service List</h2>
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
                    {connectionLessServiceList.map((data) => renderService(data))}
                </div>
            )}
        </div>
    );
}

export default ConnectionLessServiceListForVendor;