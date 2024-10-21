import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Chart from "react-apexcharts";
import ConnectionLessServiceList from './ConnectionLessServiceList';

function ConnectionLessServiceListWithEmsAndVendor({ isInterVendor, isInterEms, serviceType }) {
const [connectionLessServiceList, setConnectionLessServiceList] = useState([]);
const [loading, setLoading] = useState(true);
const [showServiceList, setShowServiceList] = useState(true);
const [error, setError] = useState(null);
const [chartType, setChartType] = useState("bar");

useEffect(() => {
const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
    let url;
    if (isInterVendor && isInterEms && serviceType) {
        url = "/connectionLessService/serviceType/interVendorAndInterEms";
    } else if (isInterVendor && isInterEms) {
        url = "/connectionLessService/interEmsAndInterVendor";
    } else if (isInterVendor && serviceType) {
        url = "/connectionLessService/serviceType/interVendor";
    } else if (isInterEms && serviceType) {
        url = "/connectionLessService/serviceType/interEms";
    } else if (isInterVendor) {
        url = "/connectionLessService/clsInterVendor";
    } else if (isInterEms) {
        url = "/connectionLessService/interEms";
    } else if (serviceType) {
        url = "/connectionLessService/serviceType";
    } else {
        setShowServiceList(false);
        return;
    }
    const params = serviceType ? { serviceType } : {};
    const response = await axios.get(url, { params });
    setConnectionLessServiceList(response.data);
    setShowServiceList(true);
    } catch (error) {
    console.error("Error fetching ConnectionLessService data:", error);
    setError("Failed to fetch service data. Please try again.");
    } finally {
    setLoading(false);
    }
};
fetchData();
}, [isInterVendor, isInterEms, serviceType]);

if (!showServiceList) {
return <ConnectionLessServiceList />;
}

const chartOptions = {
chart: {
    type: chartType,
},
labels: connectionLessServiceList.map(item => item.label),
series: chartType === "bar"
    ? [{ data: connectionLessServiceList.map(item => item.serviceType) }]
    : connectionLessServiceList.map(item => item.serviceType),
};

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
    ) : error ? (
    <div className="text-danger text-center">{error}</div>
    ) : (
    <>
        <div className="d-flex justify-content-center mb-4">
        <button onClick={() => setChartType("bar")} className="btn btn-primary me-2">Bar Chart</button>
        <button onClick={() => setChartType("donut")} className="btn btn-primary">Donut Chart</button>
        </div>
        <Chart options={chartOptions} series={chartOptions.series} type={chartType} height={350} />
        <div className="row">
        {connectionLessServiceList.map(renderService)}
        </div>
    </>
    )}
</div>
);
}

export default ConnectionLessServiceListWithEmsAndVendor;