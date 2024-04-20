
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';
import '../styles.css';

const Dashboard = ({ totalRevenue, totalTrips, fareCollectionTrends }) => {
    // Sample data for fare collection trends
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Fare Collection Trends',
                data: fareCollectionTrends,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }
        ]
    };

    // Sample options for the chart
    const options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };

    return (
        <div className='dashboard'>
            <h2>Real-time Reporting Dashboard</h2>
            <p>Total Revenue: ${totalRevenue}</p>
            <p>Total Trips: {totalTrips}</p>
            {/* Display fare collection trends */}
            <div className='chart-container'>
                <h3>Fare Collection Trends</h3>
                <Line data={data} options={options} />
            </div>
        </div>
    );
};

Dashboard.propTypes = {
    totalRevenue: PropTypes.number.isRequired,
    totalTrips: PropTypes.number.isRequired,
    fareCollectionTrends: PropTypes.array.isRequired
}

export default Dashboard;

