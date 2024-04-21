
import { useState } from 'react';
// import RefundButton from './RefundButton';
import PropTypes from 'prop-types';
// import 'intasend-inlinejs-sdk'
// import '../inta.css'


// new window.IntaSend({
//     publicAPIKey: "ISPubKey_test_73158406-58db-43d2-8b6d-4e1c2b391929",
//     live: false //or true for live environment
//   })
//   .on("COMPLETE", (response) => { console.log("COMPLETE:", response) })
//   .on("FAILED", (response) => { console.log("FAILED", response) })
//   .on("IN-PROGRESS", () => { console.log("INPROGRESS ...") })

const FareCollection = ({ onPayment }) => {
    const [amount, setAmount] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const clearForm = () => {
        setAmount('');
        setPhoneNumber('');
        setPaymentMethod('');
    }
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
                body: JSON.stringify({ amount, phoneNumber, paymentMethod }),
            });
            const data = await response.json();
            
            if (!response.ok){
                throw new Error("Failed to process payment");
            }
            onPayment(data );
            clearForm();
            alert('Payment successful');
            
            // Handle the response from the API
          
                
                
                // Call the onPayment callback with the payment data
               
            // else {
            //     // const errorData = await response.json();
            //     // console.error('Payment failed:', errorData);
            //     // alert('Payment failed. Please try again.');
            //     // // Call the onPayment callback with the error data
            //     // onPayment({ success: false, error: errorData });
            // }
        } catch (error) {
            console.error('Error processing payment:', error);
            alert('An error occurred. Please  contact support.');
            
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
            {/* <input type="text" placeholder="Amount"  />
            <input type="text" placeholder="Phone Number" />
        <button className="intaSendPayButton"  data-amount="10" data-currency="USD">Pay via M-PESA</button> */}
        </div>
    );

};
FareCollection.propTypes = {
    onPayment: PropTypes.func.isRequired
};

export default FareCollection;

