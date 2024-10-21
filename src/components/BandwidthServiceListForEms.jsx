import axios from "axios";
import React, { useState, useEffect } from "react";
import { ThreeDots } from 'react-loader-spinner';
import Chart from 'react-apexcharts';

export default function BandwidthServiceListForEms({ value }) {
  const emsName = value;
  const [bandwidthServiceList, setBandwidthServiceList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartType, setChartType] = useState("bar");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/bandwidth/ems", {
          params: { emsName }
        });
        setBandwidthServiceList(response.data);
      } catch (error) {
        console.log("Error fetching in BandwidthService...", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [emsName]);

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

  const chartData = {
    options: {
      chart: {
        id: 'basic-bar',
      },
      xaxis: {
        categories: bandwidthServiceList.map(service => service.label),
      },
    },
    series: [{
      name: 'Layer Rate',
      data: bandwidthServiceList.map(service => service.layerRate),
    }],
  };

  const donutData = {
    options: {
      labels: bandwidthServiceList.map(service => service.label),
    },
    series: bandwidthServiceList.map(service => service.layerRate),
  };

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
        <div>
          <div className="mb-3 text-center">
            <button className="btn btn-primary me-2" onClick={() => setChartType("bar")}>Bar Chart</button>
            <button className="btn btn-secondary" onClick={() => setChartType("donut")}>Donut Chart</button>
          </div>
          <div className="row">
            <div className="col-md-6">
              {chartType === "bar" ? (
                <Chart
                  options={chartData.options}
                  series={chartData.series}
                  type="bar"
                  width="500"
                />
              ) : (
                <Chart
                  options={donutData.options}
                  series={donutData.series}
                  type="donut"
                  width="500"
                />
              )}
            </div>
            <div className="col-md-6">
              {bandwidthServiceList.map((data, index) => (
                renderService(data)
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}