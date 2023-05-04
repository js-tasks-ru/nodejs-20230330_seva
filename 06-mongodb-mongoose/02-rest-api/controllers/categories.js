const CategoryModel = require('../models/Category')
const mapCategory = require('../mappers/category')

module.exports.categoryList = async function categoryList(ctx, next) {
  const allCategories = await CategoryModel.find()
  const categories = allCategories.map(mapCategory)

  ctx.body = {
    categories
  };
};
