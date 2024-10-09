import { useState, useEffect } from 'react';
import axios from "axios";
import BandwidthServiceListForVendor from './components/BandwidthServiceListforVendor';
import Select from 'react-select';
import ConnectionLessServiceListForVendor from './components/ConnectionLessServiceListForVendor';
import ConnectionLessServiceListWithEmsAndVendor from './components/ConnectionLessServiceListWithEmsAndVendor';
import BandwidthServiceListWithEmsAndVendor from './components/BandwidthServiceListWithEmsAndVendor';

const serviceOptions = [
  { value: 'bws', label: 'Bws' },
  { value: 'cls', label: 'Cls' },
  { value: 'all', label: 'All' }
];

const serviceTypeOptions = [
  { value: 'POINT_TO_POINT', label: 'POINT_TO_POINT' },
  { value: 'POINT_TO_MULTIPOINT', label: 'POINT_TO_MULTIPOINT' },
  { value: 'MULTIPOINT', label: 'MULTIPOINT' }
];

function App() {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showList, setShowList] = useState(false);
  const [vendorNames, setVendorNames] = useState([]);
  const [uniqueVendorNames, setUniqueVendorNames] = useState([]);
  const [isInterVendor, setIsInterVendor] = useState(false);
  const [isInterEms, setIsInterEms] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedService) return;

      setError(null);

      try {
        const url = selectedService.value === 'bws' 
          ? "/bandwidth/getAllVendorNames" 
          : "/connectionLessService/getAllVendorNames";

        const response = await axios.get(url);
        setVendorNames(response.data);
      } catch (error) {
        setError("Error fetching vendor names.");
      }
    };

    fetchData();
  }, [selectedService]);

  useEffect(() => {
    const extractUniqueNames = () => {
      const allNames = selectedService.value === 'bws'
        ? vendorNames.join(', ').split(', ')
        : vendorNames.join(', ').split(',');

      const uniqueNames = [...new Set(allNames.map(name => name.trim()))];
      const options = uniqueNames.map(name => ({ value: name, label: name }));
      setUniqueVendorNames(options);
    };

    if (vendorNames.length) {
      extractUniqueNames();
    }
  }, [vendorNames, selectedService?.value]);

  const handleServiceChange = option => {
    setSelectedService(option);
    //console.log(option)
    setShowList(true);
    setSelectedVendor(null);
  };

  const handleVendorChange = option => {
    setSelectedVendor(option);
    setServiceType(null)
    setShowList(true);
  };

  const handleInterVendorChange = e => setIsInterVendor(e.target.checked);

  const handleInterEmsChange = e => setIsInterEms(e.target.checked);

  const handleServiceTypeChange = option => {
    setServiceType(option.value);
    //console.log(option)
    setShowList(true);
  };

  const renderServiceList = () => {
    const commonProps = { isInterVendor, isInterEms };
    if (selectedService.value === 'bws') {
      return selectedVendor?.value ? (
        <BandwidthServiceListForVendor key={selectedVendor.value} value={selectedVendor.value} {...commonProps} />
      ) : (
        <BandwidthServiceListWithEmsAndVendor {...commonProps} />
      );
    }

    if (selectedService.value === 'cls') {
      return selectedVendor?.value ? (
        <ConnectionLessServiceListForVendor key={selectedVendor.value} value={selectedVendor.value} serviceType={serviceType} {...commonProps}  />
      ) : (
        <ConnectionLessServiceListWithEmsAndVendor serviceType={serviceType} {...commonProps} />
      );
    }
  };

  return (
    <div className="container mt-5">
      <header className="mb-4">
        <h2 className="text-center">MIPL Services</h2>
      </header>
      <div className="row mb-4">
        <div className="col-md-4 form-floating">
          <Select 
            id="service-dropdown" 
            value={selectedService} 
            onChange={handleServiceChange} 
            options={serviceOptions} 
            placeholder="Select a Service" 
          />
        </div>
        <div className="col-md-4 form-floating">
          <Select 
            id="vendor-dropdown" 
            value={selectedVendor} 
            onChange={handleVendorChange} 
            options={uniqueVendorNames} 
            placeholder="Select a Vendor" 
          />
        </div>
        <div className="col-md-2">
          <div className="form-check">
            <input 
              className="form-check-input"
              type="checkbox" 
              id="inter-vendor-checkbox" 
              checked={isInterVendor} 
              onChange={handleInterVendorChange}
            />
            <label className="form-check-label" htmlFor="inter-vendor-checkbox">Inter Vendor</label>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-check">
            <input 
              className="form-check-input"
              type="checkbox" 
              id="inter-ems-checkbox" 
              checked={isInterEms} 
              onChange={handleInterEmsChange}
            />
            <label className="form-check-label" htmlFor="inter-ems-checkbox">Inter EMS</label>
          </div>
        </div>
      </div>
      {selectedService?.value === "cls" && (
        <div className='row mb-4'>
          <div className="col-md-4 form-floating">
            <Select 
              id="serviceType-dropdown" 
              value={serviceType} 
              onChange={handleServiceTypeChange} 
              options={serviceTypeOptions} 
              placeholder="Select a Service Type" 
            />
          </div>
        </div>
      )}
      {error && <div className="text-danger text-center">{error}</div>}
      {showList && renderServiceList()}
    </div>
  );
}

export default App;