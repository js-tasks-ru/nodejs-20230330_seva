const mongoose = require('mongoose')

const ProductModel = require('../models/Product')
const mapProduct = require('../mappers/product')

module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {
  const { subcategory } = ctx.query;

  if (!subcategory) return next();

  if (!mongoose.isValidObjectId(subcategory)) {
    ctx.throw(400, 'invalid id')
  }

  const products = await ProductModel.find({ subcategory })

  ctx.body = {
    products: products.map(mapProduct)
  };
};

module.exports.productList = async function productList(ctx, next) {
  const allProduct = await ProductModel.find()
  const products = allProduct.map(mapProduct)

  ctx.body = {
    products
  };
};

module.exports.productById = async function productById(ctx, next) {
  const { id } = ctx.params
  const product = await ProductModel.findById(id)

  if (!product) {
    ctx.throw(404, 'user not found')
  }

  ctx.body = {
    product: mapProduct(product)
  };
};

