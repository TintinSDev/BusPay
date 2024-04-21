import PropTypes from 'prop-types';

const RefundButton = ({ paymentId, onRefund }) => {
  const handleRefund = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/payments/${paymentId}/refund`, {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert('Payment refunded successfully');
        // Optionally, you can perform additional actions after successful refund
        // For example, updating UI, fetching updated payment history, etc.
        onRefund();
      } else {
        alert(data.error || 'Failed to refund payment');
      }
    } catch (error) {
      console.error('Error refunding payment:', error);
      alert('Failed to refund payment. Please try again later.');
    }
  };

  return (
    <button onClick={handleRefund}>Refund</button>
  );
};

RefundButton.propTypes = {
  paymentId: PropTypes.number.isRequired,
  onRefund: PropTypes.func.isRequired,
};

export default RefundButton;
