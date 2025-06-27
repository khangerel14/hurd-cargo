import { Request, Response } from 'express';
import Product from '../models/Product';

// Create Product (Admin Only)
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, trackingCode, phoneNumber, status, pickupType, userId } =
    req.body;

  try {
    const existingProduct = await Product.findOne({ trackingCode });
    if (existingProduct) {
      res.status(400).json({ message: 'Трекинг код бүртгэлтэй бараа байна.' });
      return;
    }

    const product = new Product({
      name,
      phoneNumber,
      trackingCode,
      status: status,
      pickupType,
      user: userId,
    });
    await product.save();
    res
      .status(201)
      .json({ message: 'Бүтээгдэхүүн мэдээлэл амжилттай нэмлээ.', product });
  } catch (error) {
    console.error('Error occurred:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get Products by User
export const getProductsByUser = async (
  req: any,
  res: Response
): Promise<void> => {
  const { phoneNumber, status } = req.query;
  try {
    const query: any = { phoneNumber: phoneNumber };
    if (status !== undefined) {
      query.status = status;
    }
    const products = await Product.find(query).sort({
      updatedAt: -1,
    });

    if (products.length === 0) {
      res
        .status(404)
        .json({ message: 'Хэрэглэгчид бүртгэлтэй бараа байхгүй байна.' });
      return;
    }

    res.json(products);
  } catch (error) {
    console.error('Error occurred:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

// Get All Products
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await Product.find().sort({ updatedAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Error occurred:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

// Update Product
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const { name, trackingCode, phoneNumber, status, pickupType, user, price } =
    req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      res.status(404).json({ message: 'Бүтээгдэхүүн мэдээлэл олдсонгүй.' });
      return;
    }

    if (name) product.name = name;
    if (trackingCode) product.trackingCode = trackingCode;
    if (phoneNumber) product.phoneNumber = phoneNumber;
    if (status) product.status = status;
    if (pickupType) product.pickupType = pickupType;
    if (user) product.user = user;
    if (price) product.price = price;

    await product.save();
    res.json({
      message: 'Бүтээгдэхүүн мэдээлэл амжилттай шинэчлэгдлээ.',
      product,
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

// Delete Product Completed
export const deleteProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product deleted' });
  } catch (error) {
    console.error('Error occurred:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};

export const updateProductsByPhoneNumber = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { phoneNumber, pickupType } = req.body;

  try {
    const result = await Product.updateMany(
      {
        phoneNumber: phoneNumber,
        status: 'arrived_in_ulaanbaatar',
      },
      { $set: { pickupType } }
    );
    if (result.matchedCount === 0) {
      res
        .status(404)
        .json({ message: 'Хэрэглэгчид бүртгэлтэй бараа байхгүй байна.' });
      return;
    }

    res.json({
      message: `Successfully updated ${result.modifiedCount} products`,
      data: {
        phoneNumber,
        pickupType,
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error updating products:', error);
    res.status(500).json({
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const getProductsByStatus = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, status } = req.query;

    const products = await Product.find({
      phoneNumber: phoneNumber,
      status: status,
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const getProductsByStatusAdmin = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    const products = await Product.find({
      status: status,
    }).sort({ updatedAt: -1 });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

export const getProductsByUserNumber = async (req: Request, res: Response) => {
  const { phoneNumber } = req.query;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Missing phoneNumber' });
  }

  try {
    const products = await Product.find({
      $or: [
        { phoneNumber: phoneNumber.toString() },
        { trackingCode: phoneNumber.toString() },
      ],
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Server error',
      error: (error as Error).message,
    });
  }
};

// Controller to update status of multiple products
export const updateProductsStatus = async (req: Request, res: Response) => {
  try {
    const { productIds, status } = req.body;

    const result = await Product.updateMany(
      { _id: { $in: productIds } },
      { $set: { status } },
      { runValidators: true }
    );

    if (result.matchedCount === 0) {
      return res
        .status(404)
        .json({ message: 'No products found with the provided IDs' });
    }

    res.status(200).json({
      message: 'Product statuses updated successfully',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error('Error updating product statuses:', error);
    res
      .status(500)
      .json({ message: 'Server error', error: (error as Error).message });
  }
};
