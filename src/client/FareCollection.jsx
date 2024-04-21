
import { useState } from 'react';
// import RefundButton from './RefundButton';
import PropTypes from 'prop-types';


const FareCollection = ({ onPayment }) => {
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handlePayment = async () => {
        // Validate form fields
        if (!amount.trim() || !phoneNumber.trim()) {
            alert('Please enter amount and valid phone number');
            return;
        }

        try {
            // Make an API call to process the payment
            const response = await fetch('http://127.0.0.1:5000/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount, phoneNumber }),
            });

            // Handle the response from the API
            if (response.ok) {
                const responseData = await response.json();
                console.log('Payment successful:', responseData);
                // Call the onPayment callback with the payment data
                onPayment({ success: true, data: responseData });
            } else {
                const errorData = await response.json();
                console.error('Payment failed:', errorData);
                // Call the onPayment callback with the error data
                onPayment({ success: false, error: errorData });
            }
        } catch (error) {
            console.error('Error processing payment:', error);
            // Call the onPayment callback with the error
            onPayment({ success: false, error: error.message });
        }
    };

    
        // const handleRefundSuccess = () => {
        //   // Optionally, you can perform actions after successful refund
        //   // For example, updating UI, fetching updated payment history, etc.
        // };

    return (
        <div>
            <h2>Mobile Money Payment</h2>
            <input type="text" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
            <input type="text" placeholder="Phone Number" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <input type = "text" placeholder='Payment Method' value = {paymentMethod} onChange = {(e) => setPaymentMethod(e.target.value)} />
            <button onClick={handlePayment}>Transact Mobile Payment</button>
            {/* <RefundButton paymentId={payment.id} onRefund={handleRefundSuccess} /> */}
        </div>
    );

};
FareCollection.propTypes = {
    onPayment: PropTypes.func.isRequired
};

export default FareCollection;

