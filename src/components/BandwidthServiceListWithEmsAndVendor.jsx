import axios from "axios";
import React, { useState, useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';
import BandwidthServiceList from "./BandwidthServiceList";
import Chart from "react-apexcharts";

export default function BandwidthServiceListWithEmsAndVendor({ isInterVendor, isInterEms }) {
  const [bandwidthServiceList, setBandwidthServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showServiceList, setShowServiceList] = useState(true);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url;
        if (isInterVendor && isInterEms) {
          url = "/bandwidth/interEmsAndInterVendor";
        } else if (isInterVendor) {
          url = "/bandwidth/bwsInterVendor";
        } else if (isInterEms) {
          url = "/bandwidth/interEms";
        } else {
          setShowServiceList(false);
          return;
        }
        if (url) {
          const response = await axios.get(url);
          setBandwidthServiceList(response.data);
          setShowServiceList(true);
        }
      } catch (error) {
        console.log("Error fetching in BandwidthService...", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isInterVendor, isInterEms]);

  if (!showServiceList) {
    return <BandwidthServiceList />;
  }

  const chartOptions = {
    chart: {
      type: chartType,
    },
    labels: bandwidthServiceList.map(item => item.label),
    series: chartType === "bar"
      ? [{ data: bandwidthServiceList.map(item => item.layerRate) }]
      : bandwidthServiceList.map(item => item.layerRate),
  };

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
        <>
          <div className="d-flex justify-content-center mb-4">
            <button onClick={() => setChartType("bar")} className="btn btn-primary me-2">Bar Chart</button>
            <button onClick={() => setChartType("donut")} className="btn btn-primary">Donut Chart</button>
          </div>
          <Chart options={chartOptions} series={chartOptions.series} type={chartType} height={350} />
          <div className="row">
            {bandwidthServiceList.map((data, index) => (
              renderService(data)
            ))}
          </div>
        </>
      )}
    </div>
  );
}