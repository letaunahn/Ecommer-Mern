import productModel from "../models/productModel.js";
import ApiFeatures from "../utils/apifeatures.js";

//get all products
export const getAllProducts = async (req, res) => {
    const resultPerPage = 5
    const productCount = await productModel.countDocuments()
  try {
    const apiFeature = new ApiFeatures(productModel.find({}), req.query)
      .search()
      .filter()
      .pagination(resultPerPage)
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
