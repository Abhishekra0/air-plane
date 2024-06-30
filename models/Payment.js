import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userEmail: { type: String, required: true },
  flightNumber: { type: String, required: true },
  razorpayPaymentId: { type: String, required: true },
 
  
});

const Payment = mongoose.model('Payment', paymentSchema);

export default Payment;
