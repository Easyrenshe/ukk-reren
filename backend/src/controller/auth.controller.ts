import { Request, Response } from 'express';
import pool from "../database/postgres";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ======================
// REGISTER
// ======================
export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Validation
    if (!username && !email) {
      return res.status(400).json({ message: 'Missing required fields: (username or email), password' });
    }
    
    if (!password) {
      return res.status(400).json({ message: 'Missing required field: password' });
    }

    // Generate username from email if not provided
    const finalUsername = username || email?.split('@')[0] || 'user_' + Date.now();
    const finalEmail = email || username + '@hotel.local';

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [finalUsername, finalEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const { rows } = await pool.query(
      `INSERT INTO users (username, email, password, full_name, role, is_active) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, username, email, full_name, role`,
      [finalUsername, finalEmail, hashedPassword, full_name || null, 'staff', true]
    );

    res.status(201).json({
      message: 'User registered successfully',
      user: rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// LOGIN
// ======================
export const login = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;

    // Validation - accept either username or email
    if ((!username && !email) || !password) {
      return res.status(400).json({ message: 'Missing required fields: (username or email), password' });
    }

    // Find user by username or email
    const query = username 
      ? 'SELECT * FROM users WHERE username = $1 AND is_active = true'
      : 'SELECT * FROM users WHERE email = $1 AND is_active = true';
    
    const { rows } = await pool.query(
      query,
      [username || email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    const user = rows[0];

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid username/email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        full_name: user.full_name,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// ======================
// LOGOUT
// ======================
export const logout = async (req: Request, res: Response) => {
  try {
    // JWT logout is handled client-side by removing token
    // This endpoint can be used for server-side logout tracking if needed
    res.json({ message: 'Logout successful' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
