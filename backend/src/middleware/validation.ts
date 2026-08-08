import { Request, Response, NextFunction } from 'express';

interface ValidationRule {
  field: string;
  label: string;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  isIn?: string[];
  isNumber?: boolean;
  min?: number;
}

export const validate = (rules: ValidationRule[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const errors: string[] = [];

    for (const rule of rules) {
      const value = req.body[rule.field];

      if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors.push(`${rule.label} is required`);
        continue;
      }

      if (value !== undefined && value !== null && value !== '') {
        if (rule.minLength && typeof value === 'string' && value.trim().length < rule.minLength) {
          errors.push(`${rule.label} must be at least ${rule.minLength} characters`);
        }

        if (rule.maxLength && typeof value === 'string' && value.trim().length > rule.maxLength) {
          errors.push(`${rule.label} must be at most ${rule.maxLength} characters`);
        }

        if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value.trim())) {
          errors.push(rule.patternMessage || `${rule.label} is invalid`);
        }

        if (rule.isIn && !rule.isIn.includes(value)) {
          errors.push(`${rule.label} must be one of: ${rule.isIn.join(', ')}`);
        }

        if (rule.isNumber) {
          const num = Number(value);
          if (isNaN(num)) {
            errors.push(`${rule.label} must be a number`);
          } else if (rule.min !== undefined && num < rule.min) {
            errors.push(`${rule.label} must be at least ${rule.min}`);
          }
        }
      }
    }

    if (errors.length > 0) {
      res.status(400).json({ error: errors[0], errors });
      return;
    }

    next();
  };
};

export const orderValidation = validate([
  { field: 'name', label: 'Full name', required: true, minLength: 2, maxLength: 150 },
  { field: 'index_number', label: 'Index number', required: true, minLength: 2, maxLength: 100 },
  { field: 'phone', label: 'Phone number', required: true, minLength: 9, maxLength: 30 },
  { field: 'size', label: 'Size', required: true, isIn: ['S', 'M', 'L', 'XL', 'XXL'] },
  { field: 'quantity', label: 'Quantity', required: true, isNumber: true, min: 1 },
]);
