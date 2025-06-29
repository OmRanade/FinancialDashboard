import { Request, Response } from 'express';
import Transaction from '../models/transaction.model';
import { Parser } from 'json2csv';
import mongoose from 'mongoose';

// Extend Express Request for user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email?: string;
      };
    }
  }
}

// GET Summary
export const getSummary = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { category, status, startDate, endDate } = req.query;
  const query: any = { user_id: userId };

  if (category) query.category = category;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate.toString());
    if (endDate) query.date.$lte = new Date(endDate.toString());
  }

  const transactions = await Transaction.find(query);

  const totalRevenue = transactions
    .filter(t => t.category === 'Revenue')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.category === 'Expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSavings = totalRevenue - totalExpenses;

  res.json({ totalRevenue, totalExpenses, totalSavings });
};

// GET Transactions
export const getTransactions = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const { search, category, status, sort, page = '1', limit = '10' } = req.query;
  const query: any = { user_id: userId };

  if (category) query.category = category;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { category: new RegExp(search.toString(), 'i') },
      { status: new RegExp(search.toString(), 'i') },
      { user_profile: new RegExp(search.toString(), 'i') }, // Added search on user_profile
    ];
  }

  // Parse sort param: e.g. "date_desc", "amount_asc"
  let sortByField = 'date';
  let sortOrder: 1 | -1 = -1; // default descending
  if (sort) {
    const [field, direction] = sort.toString().split('_');
    if (field) sortByField = field;
    if (direction === 'asc') sortOrder = 1;
    else if (direction === 'desc') sortOrder = -1;
  }

  const skip = (Number(page) - 1) * Number(limit);
  const transactions = await Transaction.find(query)
    .sort({ [sortByField]: sortOrder })
    .skip(skip)
    .limit(Number(limit));

  const total = await Transaction.countDocuments(query);
  res.json({ transactions, total, page: Number(page), pages: Math.ceil(total / Number(limit)) });
};

// CREATE Transaction
export const createTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const transaction = await Transaction.create({ ...req.body, user_id: userId });
  res.status(201).json(transaction);
};

// UPDATE Transaction
export const updateTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const transactionId = req.params.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return res.status(400).json({ message: 'Invalid transaction ID' });
  }

  const updated = await Transaction.findOneAndUpdate(
    { _id: transactionId, user_id: userId },
    req.body,
    { new: true }
  );

  if (!updated) return res.status(404).json({ message: 'Transaction not found' });

  res.json(updated);
};

// DELETE Transaction
export const deleteTransaction = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const transactionId = req.params.id;

  if (!userId) return res.status(401).json({ message: 'Unauthorized' });
  if (!mongoose.Types.ObjectId.isValid(transactionId)) {
    return res.status(400).json({ message: 'Invalid transaction ID' });
  }

  const deleted = await Transaction.findOneAndDelete({ _id: transactionId, user_id: userId });
  if (!deleted) return res.status(404).json({ message: 'Transaction not found' });

  res.status(204).end();
};

// EXPORT CSV
export const exportCSV = async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  const data = await Transaction.find({ user_id: userId }).lean();

  if (!data || data.length === 0) {
    return res.status(404).json({ message: 'No transactions found to export.' });
  }

  const columns = ['date', 'amount', 'category', 'status', 'user_profile'];
  const parser = new Parser({ fields: columns });
  const csv = parser.parse(data);

  res.header('Content-Type', 'text/csv');
  res.attachment('transactions.csv');
  res.send(csv);
};
