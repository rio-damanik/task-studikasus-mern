const path = require('path');
const fs = require('fs');
const config = require('../config');
const Product = require('./model');
const Category = require('../category/model');
const Tag = require('../tag/model');

const index = async (req, res, next) => {
  try {
    let { limit = 10, skip = 0, q = '', category = '', tags = [] } = req.query;

    let criteria = {};

    if (q.length) {
      criteria = {
        ...criteria,
        name: { $regex: `${q}`, $options: 'i' }
      }
    }

    if (category.length) {
      criteria = { ...criteria, category: category };
    }

    if (tags.length) {
      if (typeof tags === 'string') {
        tags = [tags];
      }
      criteria = { ...criteria, tags: { $in: tags } };
    }

    let count = await Product.find(criteria).countDocuments();

    const products = await Product
      .find(criteria)
      .skip(parseInt(skip))
      .limit(parseInt(limit))
      .populate('category')
      .populate('tags');

    return res.json({
      data: products,
      count
    });
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    let payload = req.body;

    // Handle image upload
    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          if (payload.category) {
            const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (!category) {
              const newCategory = new Category({ name: payload.category });
              await newCategory.save();
              payload.category = newCategory._id;
            } else {
              payload.category = category._id
            }
          }
          if (payload.tags) {
            const tags = await Tag.find({ name: { $in: payload.tags } });
            payload.tags = tags.map(tag => tag._id)
          }
          let product = new Product({ ...payload, image_url: filename });
          await product.save();
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            });
          }
          next(err);
        }
      });

      src.on('error', async () => {
        next(err);
      });

    } else {
      if (payload.category) {
        const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
        if (!category) {
          const newCategory = new Category({ name: payload.category });
          await newCategory.save();
          payload.category = newCategory._id;
        } else {
          payload.category = category._id
        }
      }
      if (payload.tags) {
        const tags = await Tag.find({ name: { $in: payload.tags } });
        payload.tags = tags.map(tag => tag._id)
      }
      let product = new Product(payload);
      await product.save();
      return res.json(product);
    }
  } catch(err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    let payload = req.body;
    let { id } = req.params;

    if (req.file) {
      let tmp_path = req.file.path;
      let originalExt = req.file.originalname.split('.')[req.file.originalname.split('.').length - 1];
      let filename = req.file.filename + '.' + originalExt;
      let target_path = path.resolve(config.rootPath, `public/uploads/${filename}`);

      const src = fs.createReadStream(tmp_path);
      const dest = fs.createWriteStream(target_path);
      src.pipe(dest);

      src.on('end', async () => {
        try {
          if (payload.category) {
            const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
            if (!category) {
              const newCategory = new Category({ name: payload.category });
              await newCategory.save();
              payload.category = newCategory._id;
            } else {
              payload.category = category._id
            }
          }

          if (payload.tags) {
            const tags = await Tag.find({ name: { $in: payload.tags } });
            payload.tags = tags.map(tag => tag._id)
          }
          let product = await Product.findById(id);
          let currentImage = `${config.rootPath}/public/uploads/${product.image_url}`;

          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          product = await Product.findByIdAndUpdate(id, { ...payload, image_url: filename }, {
            new: true,
            runValidators: true
          });
          return res.json(product);
        } catch (err) {
          fs.unlinkSync(target_path);
          if (err && err.name === 'ValidationError') {
            return res.json({
              error: 1,
              message: err.message,
              fields: err.errors
            });
          }
          next(err);
        }
      });

      src.on('error', async () => {
        next(err);
      });

    } else {
      if (payload.category) {
        const category = await Category.findOne({ name: { $regex: payload.category, $options: 'i' } });
        if (!category) {
          const newCategory = new Category({ name: payload.category });
          await newCategory.save();
          payload.category = newCategory._id;
        } else {
          payload.category = category._id
        }
      }

      if (payload.tags) {
        const tags = await Tag.find({ name: { $in: payload.tags } });
        payload.tags = tags.map(tag => tag._id)
      }
      let product = await Product.findByIdAndUpdate(id, payload, {
        new: true,
        runValidators: true
      });
      return res.json(product);
    }
  } catch (err) {
    if (err && err.name === 'ValidationError') {
      return res.json({
        error: 1,
        message: err.message,
        fields: err.errors
      });
    }
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    let product = await Product.findByIdAndDelete(req.params.id);
    let currentImage = `${config.rootPath}/public/uploads/${product.image_url}`;
    if (fs.existsSync(currentImage)) {
      fs.unlinkSync(currentImage);
    }
    return res.json(product);
  } catch(err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    console.log('Fetching product by ID...');
    const { id } = req.params;
    const product = await Product.findById(id).populate('category').populate('tags');
    console.log('Product retrieved:', product);
    return res.json(product);
  } catch (err) {
    console.error('Error in product controller:', err);
    next(err);
  }
}

module.exports = {
  store,
  index,
  update,
  destroy,
  show
};