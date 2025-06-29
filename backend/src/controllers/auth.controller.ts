import { Request, Response } from 'express';
import User, { IUser } from '../models/user.model';
import { generateToken } from '../utils/jwt.util';

const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    // ✅ Password validation: at least 8 characters, includes uppercase, lowercase, number, special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          'Password must be at least 8 characters long , Include Uppercase Letter,  Include Lowercase Letter,  Include Number, Include Special Character.'
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    await User.create({ email, password });
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    res.status(500).json({ message: 'Signup failed', error });
  }
};

const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }) as (IUser & { _id: any }) | null;
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

export { signup, login };
