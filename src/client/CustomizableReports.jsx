import  { useState } from 'react';
import PropTypes from 'prop-types';

const CustomizableReports = ({ onGenerateReport, onExportReport }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [busRoute, setBusRoute] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleGenerateReport = () => {
        // Validate form fields
        if (!startDate.trim() || !endDate.trim() || !busRoute.trim() || !paymentMethod.trim()) {
            alert('Please fill all fields');
            return;
        }

        // Call onGenerateReport function passed from parent component
        onGenerateReport({ startDate, endDate, busRoute, paymentMethod });
    };

    const handleExportReport = () => {
        // Call onExportReport function passed from parent component
        onExportReport();
    };

    return (
        <div>
            <h2>Customizable Reports</h2>
            <div>
                <label>Start Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            <div>
                <label>End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
            <div>
                <label>Bus Route</label>
                <input type="text" value={busRoute} onChange={(e) => setBusRoute(e.target.value)} />
            </div>
            <div>
                <label>Payment Method</label>
                <input type="text" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
            </div>
            <button onClick={handleGenerateReport}>Generate Report</button>
            <button onClick={handleExportReport}>Export Report</button>
        </div>
    );
};

CustomizableReports.propTypes = {
    onGenerateReport: PropTypes.func.isRequired,
    onExportReport: PropTypes.func.isRequired
};

export default CustomizableReports;

