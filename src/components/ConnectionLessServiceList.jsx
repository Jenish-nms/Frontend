import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import Chart from "react-apexcharts";

function ConnectionLessServiceList() {
const [connectionLessServiceList, setConnectionLessServiceList] = useState([]);
const [loading, setLoading] = useState(true);
const [chartType, setChartType] = useState("bar");
const [barChartData, setBarChartData] = useState([]);
const [donutChartData, setDonutChartData] = useState([]);

useEffect(() => {
const fetchData = async () => {
    try {
    const response = await axios.get('/connectionLessService/getAllData');
    setConnectionLessServiceList(response.data);
    } catch (error) {
    console.log("Error fetching in ConnectionLessService...", error);
    } finally {
    setLoading(false);
    }
};
fetchData();
getChartData();
}, []);

const getChartData = async () => {
    try {
        const response = await axios.get('/connectionLessService/chartData');
        setBarChartData(response.data);
        setDonutChartData(response.data);
        //console.log(response.data);
    } catch (error) {
        console.log("Error fetching in chart data...", error);
    }
}

const BarData = {
    options: {
      chart: {
        id: 'basic-bar',
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 600,
          animateGradually: {
              enabled: true,
              delay: 150
          },
          dynamicAnimation: {
              enabled: true,
              speed: 350
          }
        },
      toolbar: {
        show: true,
        offsetX: 0,
        offsetY: 0,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
        }
      },
    },
    labels: Object.entries(barChartData).map(([key, value]) => key),
  },
    series:[{
      name: "count",
      data: Object.entries(barChartData).map(([key, value]) => value),
    }],
  };

const donutData = {
    options: {
      chart: {
        animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 600,
            animateGradually: {
                enabled: true,
                delay: 150
            },
            dynamicAnimation: {
                enabled: true,
                speed: 350
            }
        },
        toolbar: {
          show: true,
          offsetX: 0,
          offsetY: 0,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
          }
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          console.log(val)
          return val.toFixed(2) + "%"
        },
      },
      labels: Object.entries(donutChartData).map(([key, value]) => key),
      legend: {
        show: true,
        position: "top",
      },
    },
    series: Object.entries(donutChartData).map(([key, value]) => value),
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
    <>
        <div className="mb-3 text-center">
        <button onClick={() => setChartType("bar")} className="btn btn-primary me-2">Bar Chart</button>
        <button onClick={() => setChartType("donut")} className="btn btn-secondary">Donut Chart</button>
        </div>
        <div className="row">
            <div className="col-md-6">
                {chartType === "bar" ? (
                    <Chart
                    options={BarData.options}
                    series={BarData.series}
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
                {connectionLessServiceList.map((data) => renderService(data))}
            </div>
        </div>
    </>
    )}
</div>
);
}

export default ConnectionLessServiceList;