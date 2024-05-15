import { useState } from 'react';
import 'intasend-inlinejs-sdk'

function MyScreen() {
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [amount, setAmount] = useState('');

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handlePayNowClick = () => {
      new window.IntaSend({
        publicAPIKey: "ISPubKey_test_73158406-58db-43d2-8b6d-4e1c2b391929",
        live: false, // or true for live environment
      })
        .on("COMPLETE", (response) => {
          console.log("COMPLETE:", response);
          // Handle successful payment
        })
        .on("FAILED", (response) => {
          console.log("FAILED", response);
          // Handle failed payment
          alert("Payment failed. Please try again later.");
        })
        .on("IN-PROGRESS", () => {
          console.log("INPROGRESS ...");
          // Handle in-progress payment
        })
        .open({
          amount: parseFloat(amount),
          currency: "KES",
          customer: {
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "0712345678",
          },
        });
    };

  const handlePayViaCashClick = () => {
    console.log("Pay via cash");
  };

  return (
    <div className="container">
      <div className="payment-options">
        <h2>Payment Options</h2>
        <label>
          <input
            type="radio"
            name="payment-method"
            value="cash"
            checked={paymentMethod === 'cash'}
            onChange={handlePaymentMethodChange}
          />
          Cash
        </label>
        <label>
          <input
            type="radio"
            name="payment-method"
            value="intasend"
            checked={paymentMethod === 'intasend'}
            onChange={handlePaymentMethodChange}
          />
          Intasend
        </label>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={handleAmountChange}
            required
          />
        </div>
        {paymentMethod === 'intasend' && (
          <div>
            <button className="intaSendPayButton" data-amount= {amount} data-currency="KES" onClick={handlePayNowClick}>
              Pay Now
            </button>
          </div>
        )}
        {paymentMethod === 'cash' && (
          <div>
            <button onClick={handlePayViaCashClick}>Pay via Cash</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyScreen


