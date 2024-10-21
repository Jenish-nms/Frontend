import { useState, useEffect } from 'react';
import axios from "axios";
import BandwidthServiceListForVendor from './components/BandwidthServiceListforVendor';
import Select from 'react-select';
import ConnectionLessServiceListForVendor from './components/ConnectionLessServiceListForVendor';
import ConnectionLessServiceListWithEmsAndVendor from './components/ConnectionLessServiceListWithEmsAndVendor';
import BandwidthServiceListWithEmsAndVendor from './components/BandwidthServiceListWithEmsAndVendor';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Modal, Button } from 'react-bootstrap';

const ItemTypes = {
  SERVICE: 'service',
};

// const serviceOptions = [
//   { id: 'bws', content: 'Bandwidth' },
//   { id: 'cls', content: 'Connectionless' }
// ];

const serviceTypeOptions = [
  { value: 'POINT_TO_POINT', label: 'POINT_TO_POINT' },
  { value: 'POINT_TO_MULTIPOINT', label: 'POINT_TO_MULTIPOINT' },
  { value: 'MULTIPOINT', label: 'MULTIPOINT' }
];

const DraggableService = ({ service }) => {
  const [, ref] = useDrag({
    type: ItemTypes.SERVICE,
    item: { id: service.id },
  });

  return (
    <div ref={ref} style={{ padding: '16px', margin: '0 8px 0 0', background: 'grey', userSelect: 'none' }}>
      {service.content}
    </div>
  );
};

const DroppableArea = ({ onDrop, children }) => {
  const [{ isOver }, ref] = useDrop({
    accept: ItemTypes.SERVICE,
    drop: (item) => onDrop(item),
    collect: monitor => ({
      isOver: !!monitor.isOver(),
    }),
  });

  return (
    <div ref={ref} style={{ background: isOver ? 'lightblue' : 'lightgrey', padding: '16px', minHeight: '200px', display: 'flex', flexWrap: 'wrap' }}>
      {children}
    </div>
  );
};

function App() {
  const [services, setServices] = useState([
    { id: 'bws', content: 'Bandwidth' },
    { id: 'cls', content: 'Connectionless' },
  ]);
  const [droppedServices, setDroppedServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showList, setShowList] = useState(false);
  const [vendorNames, setVendorNames] = useState([]);
  const [uniqueVendorNames, setUniqueVendorNames] = useState([]);
  const [isInterVendor, setIsInterVendor] = useState(false);
  const [isInterEms, setIsInterEms] = useState(false);
  const [serviceType, setServiceType] = useState(null);
  const [error, setError] = useState(null);
  const [modalShow, setModalShow] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedService) return;
      setError(null);
      try {
        const url = selectedService.id === 'bws'
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
      const allNames = selectedService?.id === 'bws'
        ? vendorNames.join(', ').split(', ')
        : vendorNames.join(', ').split(',');
      const uniqueNames = [...new Set(allNames.map(name => name.trim()))];
      const options = uniqueNames.map(name => ({ value: name, label: name }));
      setUniqueVendorNames(options);
    };
    if (vendorNames.length) {
      extractUniqueNames();
    }
  }, [vendorNames, selectedService?.id]);

  const handleVendorChange = option => {
    setSelectedVendor(option);
    setServiceType(null);
    setShowList(true);
  };

  const handleInterVendorChange = e => setIsInterVendor(e.target.checked);
  const handleInterEmsChange = e => setIsInterEms(e.target.checked);

  const handleServiceTypeChange = option => {
    setServiceType(option.value);
    setShowList(true);
  };

  const handleDrop = (item) => {
    const draggedItem = services.find(service => service.id === item.id);
    if (draggedItem) {
      setDroppedServices([...droppedServices, draggedItem]);
      //console.log(draggedItem)
      setSelectedService(draggedItem);
      setShowList(true);
      setSelectedVendor(null);
    }
  };

  const renderServiceList = () => {
    const commonProps = { isInterVendor, isInterEms };
    if (selectedService?.id === 'bws') {
      return selectedVendor?.value ? (
        <BandwidthServiceListForVendor key={selectedVendor.value} value={selectedVendor.value} {...commonProps} />
      ) : (
        <BandwidthServiceListWithEmsAndVendor {...commonProps} />
      );
    }
    if (selectedService?.id === 'cls') {
      return selectedVendor?.value ? (
        <ConnectionLessServiceListForVendor key={selectedVendor.value} value={selectedVendor.value} serviceType={serviceType} {...commonProps} />
      ) : (
        <ConnectionLessServiceListWithEmsAndVendor serviceType={serviceType} {...commonProps} />
      );
    }
  };

return (
  <DndProvider backend={HTML5Backend}>
    <div className="container mt-5">
      <header className="mb-4">
        <h2 className="text-center">MIPL Services</h2>
      </header>
      {error && <div className="text-danger text-center">{error}</div>}
      {showList && renderServiceList()}
      <div style={{ marginBottom: '20px', display: 'flex' }}>
        {services.map(service => (
          <DraggableService key={service.id} service={service} />
        ))}
      </div>
      <DroppableArea onDrop={handleDrop}>
        {droppedServices.map(service => (
          <div key={service.id}
              style={{ userSelect: 'none', padding: '16px', margin: '0 8px 8px 0', background: 'grey', width: '120px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
              onClick={() => { setModalShow(true); setSelectedService(service);}}
          >
            {service.content}
          </div>
        ))}
      </DroppableArea>

      <Modal show={modalShow} onHide={() => setModalShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedService?.id === 'bws' ? 'Bandwidth' : selectedService?.id === 'cls' ? 'Connectionless' : 'Select Properties'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService?.id === "cls" && (
            <div className='mb-3'>
              <Select
                id="serviceType-dropdown"
                value={serviceType}
                onChange={handleServiceTypeChange}
                options={serviceTypeOptions}
                placeholder="Select a Service Type"
              />
            </div>
            )}
          <div className="mb-3">
            <Select
              id="vendor-dropdown"
              value={selectedVendor}
              onChange={handleVendorChange}
              options={uniqueVendorNames}
              placeholder="Select a Vendor"
            />
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="inter-vendor-checkbox-modal"
              checked={isInterVendor}
              onChange={handleInterVendorChange}
            />
            <label className="form-check-label" htmlFor="inter-vendor-checkbox-modal">Inter Vendor</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="inter-ems-checkbox-modal"
              checked={isInterEms}
              onChange={handleInterEmsChange}
            />
            <label className="form-check-label" htmlFor="inter-ems-checkbox-modal">Inter EMS</label>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  </DndProvider>
);
}

export default App;