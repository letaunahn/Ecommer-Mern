import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import ApiFeatures from "../utils/apifeatures.js";

//get all products
export const getAllProducts = async (req, res) => {
  const resultPerPage = 5;
  const productCount = await productModel.countDocuments();
  try {
    const apiFeature = new ApiFeatures(productModel.find({}), req.query)
      .search()
      .filter()
      .pagination(resultPerPage);
    const products = await apiFeature.query;
    res.status(200).json({ success: true, data: products, productCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `${error}` });
  }
};

//create new product
export const createProduct = async (req, res) => {
  const product = new productModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    images: req.body.images,
  });
  try {
    await product.save();
    res
      .status(200)
      .json({ success: true, message: "Product has been created" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: `${error}` });
  }
};

//update product
export const updateProduct = async (req, res) => {
  const product = await productModel.findById(req.params.id);
  if (!product) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  const newProduct = await productModel.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );
  res.status(200).json({ success: true, newProduct });
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await productModel.findByIdAndDelete(req.params.id);
    res.status(200).json({
      success: true,
      message: "Product has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);
    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: `${error}`,
    });
  }
};

export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment,
    };
    const product = await productModel.findById(req.body.productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    

    product.ratings = avg / product.reviews.length;

    console.log(product.reviews.length)
    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: `${error}`,
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id)
    res.json({
      success: true,
      reviews: product.reviews
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}

export const deleteProductReview = async (req, res) => {
  try {
    const {productId, reviewId} = req.query
    const product = await productModel.findById(productId)

    const reviewIndex = product.reviews.findIndex(
      (rev) => rev._id.toString() === reviewId && rev.user.toString() === req.user._id.toString()
    )
    
    if (reviewIndex === -1) {
      return res.status(401).json({
        success: false,
        message: 'You can only delete your own reviews',
      });
    }

    product.reviews.splice(reviewIndex, 1)

    let avg = 0
    reviews.forEach((rev) => {
      avg += rev.rating
    })
    if (reviews.length === 0) {
      product.ratings = 0;
    } else {
      product.ratings = avg / reviews.length;
    }
    product.numOfReviews = reviews.length
    await productModel.findByIdAndUpdate(
      req.query.productId,{
        reviews,
        ratings,
        numOfReviews
      },{
        new: true,
        runValidators: true,
        useFindAndModify: false
      }
    )
    res.json({
      success: true,
      message: 'Review has been deleted successfully'
    })
  } catch (error) {
    console.log(error)
    res.json({
      success: false,
      message: `${error}`
    })
  }
}
