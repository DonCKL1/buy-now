import { Request, Response, NextFunction } from 'express';
import { config } from '../config';

export const adminAuth = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === config.admin.username && password === config.admin.password) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
};
