import ProductHelper from '../helpers/productHelper';

/**
 * This class contains all methods
 * required to handle all
 * product-related operations.
 */
class ProductController {
  /**
   * This method handles view all product requests.
   * @param {object} req The user's request.
   * @param {object} res The response.
   * @returns {object} The status and some data of the product.
   */
  static async retrieveAllProducts(req, res) {
    try {
      const foundProducts = await ProductHelper.retrieveProducts();
      const productData = foundProducts.rows;

      if (productData.length === 0) {
        return res.status(404).json({
          status: 404,
          message: 'You don’t currently have any product requests'
        });
      }

      return res.status(200).json({
        status: 201,
        message: 'All Products retrieved successfully',
        products: productData
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong when retrieving all products',
        error: error.message
      });
    }
  }

  /**
   * This method handles the request for retrieving a single product.
   * @param {object} req The user's request.
   * @param {object} res The response.
   * @returns {object} The status and some data of the product.
   */
  static async retrieveOneProduct(req, res) {
    try {
      const { productId } = req.params;
      const foundProduct = await ProductHelper.findExistingProduct('id', productId);
      if (foundProduct.length > 0) {
        return res.status(200).json({
          status: 200,
          data: foundProduct
        });
      }
      res.status(404).json({
        status: 404,
        error: `No product found with this id ${productId}`
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong when retrieving the product',
        error: error.message
      });
    }
  }

  /**
   * This method handles selling product request.
   * @param {object} req The user's request.
   * @param {object} res The response.
   * @returns {object} The status and some data of the user's updated product.
   */
  static async markProductAsSold(req, res) {
    try {
      const { productId } = req.params;
      const { status } = req.body;

      const data = {
        status,
        updatedAt: new Date()
      };

      const updatedProduct = await ProductHelper.updateProductWithId(productId, data);
      res.status(200).send({
        status: 200,
        message: 'User product has been successfuly updated',
        data: updatedProduct
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        message: 'Something went wrong when updating the user product',
        error: error.message
      });
    }
  }
}

export default ProductController;
