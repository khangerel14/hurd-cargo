import express, { Request, Response, NextFunction } from 'express';
import { body, validationResult, query } from 'express-validator';
import {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  getProductsByUser,
  getProductsByStatus,
  getProductsByUserNumber,
  getProductsByStatusAdmin,
  updateProductsByPhoneNumber,
  updateProductsStatus,
} from '../controllers/productController';

const router = express.Router();

// Create Product
router.post(
  '/',
  [
    body('name').isString().notEmpty().withMessage('Name is required'),
    body('trackingCode')
      .isString()
      .notEmpty()
      .withMessage('Tracking code is required'),
    body('pickupType')
      .isIn(['pickup', 'delivery'])
      .withMessage("Pickup type must be 'pickup' or 'delivery'"),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    createProduct(req, res);
  }
);

// Get All Products
router.get('/', getProducts);

// Get products by user ID
router.get(
  '/user',
  [
    query('phoneNumber')
      .optional()
      .isString()
      .notEmpty()
      .withMessage('Phone number must be a non-empty string'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    getProductsByUser(req, res);
  }
);

// Update pickupType for all products by user phoneNumber
router.put('/put-products', updateProductsByPhoneNumber);

router.put('/update-status', updateProductsStatus);

// Get Product by status
router.get('/status', getProductsByStatus);
router.get('/status/admin', getProductsByStatusAdmin);

router.get('/user/home', getProductsByUserNumber);

// Update Product
router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  updateProduct(req, res);
});

// Delete Product
router.delete('/:id', deleteProduct);

export default router;
