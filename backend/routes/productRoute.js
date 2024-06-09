import express from 'express'
import { createProduct, deleteProduct, getAllProducts, getProductDetails, updateProduct } from '../controllers/productController.js'
import { isAuthenticateUser } from '../middleware/auth.js'

const productRouter = express.Router()

productRouter.get('/all', isAuthenticateUser, getAllProducts)
productRouter.post('/add', createProduct)
productRouter.put('/:id', updateProduct)
productRouter.delete('/:id', deleteProduct)
productRouter.get('/:id', getProductDetails)

export default productRouter