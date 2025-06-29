import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  category: { type: String, enum: ['Revenue', 'Expense'], required: true },
  status: { type: String, enum: ['Paid', 'Pending'], required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  user_profile: { type: String },
});

export default mongoose.model('Transaction', transactionSchema);
