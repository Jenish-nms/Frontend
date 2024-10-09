import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';

function ConnectionLessServiceList() {
    const [connectionLessServiceList, setConnectionLessServiceList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('/connectionLessService/getAllData');
                setConnectionLessServiceList(response.data);
                //console.log(response.data);
            } catch (error) {
                console.log("Error fetching in ConnectionLessService...", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

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

                    <h6>ConnectionLess ServiceEnd List:</h6>
                    <ul className="list-group mb-2">
                        {Object.values(data.connectionLessServiceEndList).flat().map((item, idx) => (
                            <li key={`service-end-${idx}`} className="list-group-item">
                                <span><strong>TP Name:</strong> {item.tpName}</span><br />
                            </li>
                        ))}
                    </ul>

                    <h6>ConnectionLess FdFr List:</h6>
                    <ul className="list-group mb-2">
                        {Object.values(data.connectionLessFdFrList).flat().map((item, idx) => (
                            <li key={`fdfr-${idx}`} className="list-group-item">
                                <span><strong>FDFr Name:</strong> {item.fdFrName}</span><br />
                            </li>
                        ))}
                    </ul>

                    <p className="card-text"><strong>User Label:</strong> {data.userLabel}</p>
                    <p className="card-text"><strong>FDFr Type:</strong> {data.fdFrType}</p>

                    <h6>FdFrEnd List:</h6>
                    <ul className="list-group mb-2">
                        {Object.values(data.fdFrEndList).flat().map((item, idx) => (
                            <li key={`fdfr-end-${idx}`} className="list-group-item">
                                <span><strong>TP Name:</strong> {item.tpName}</span><br />
                                <span><strong>TP Endtype:</strong> {item.tpEndType}</span><br />
                            </li>
                        ))}
                    </ul>
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

export default ConnectionLessServiceList;