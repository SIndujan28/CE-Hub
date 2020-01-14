import HTTPStatus from 'http-status';
import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';

import Product from './product.model';

const create = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Image couldn't be uploaded",
      });
    }
    const product = new Product(fields);
    if (files.photo) {
      product.image.data = fs.readFileSync(files.image.path);
      product.image.contentType = files.image.type;
    }
    product.save((error, result) => {
      if (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error,
        });
      }
      return res.status(HTTPStatus.CREATED).json(result);
    });
  });
};

const productByID = (req, res, next, id) => {
  Product.findById(id).populate('shop', '_id name').exec((err, product) => {
    if (err || !product) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        error: 'product not found',
      });
    }
    req.product = product;
    next();
  });
};

const photo = (req, res, next) => {
  if (req.product.image.data) {
    res.set('Content-Type', req.product.image.contentType);
    return res.send(req.product.image.data);
  }
  next();
};

const defaultPhoto = (req, res) => res.sendFile(process.cwd() + profileImage);

const read = (req, res) => {
  req.product.image = undefined;
  return res.status(HTTPStatus.OK).json(req.product);
};

const update = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: "Image couldn't be uploaded",
      });
    }
    let product = req.product;
    product = _.extend(product, fields);
    if (files.photo) {
      product.image.data = fs.readFileSync(files.image.path);
      product.image.contentType = files.image.type;
    }
    product.save((error, result) => {
      if (error) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error,
        });
      }
      return res.status(HTTPStatus.OK).json(result);
    });
  });
};

const remove = (req, res, next) => {
  const product = req.product;
  product.remove((err, result) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(result);
  });
};

const listByShop = (req, res) => {
  Product.find({ shop: req.shop._id }, (err, products) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(products);
  }).populate('shop', '_id name').select('-images');
};

const listLatest = (req, res) => {
  Product.find({}).sort('-created').limit(5).populate('shop', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error: err,
        });
      }
      return res.status(HTTPStatus.OK).json(result);
    });
};

const listRelated = (req, res) => {
  Product.find({ _id: { $ne: req.product }, category: req.product.category }).limit(5).populate('shop', '_id name')
    .exec((err, result) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error: err,
        });
      }
      return res.status(HTTPStatus.OK).json(result);
    });
};

const listCategories = (req, res) => {
  Product.distinct('category', {}, (err, products) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(products);
  });
};

const list = (req, res) => {
  const query = {};
  if (req.query.search) {
    query.name = { $regex: req.query.search, $options: 'i' };
  }
  if (req.query.category && req.query.category != 'All') {
    query.category = req.query.category;
  }
  Product.find(query, (err, products) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(products);
  }).populate('shop', '_id name').select('-image');
};

const increaseQuantity = (req, res, next) => {
  Product.findByIdAndUpdate(req.product._id, { $inc: { quantity: req.body.quantity } }, { new: true })
    .exec((err, result) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error: err,
        });
      }
      next();
    });
};

const decreaseQuantity = (req, res, next) => {
  const bulkOps = req.body.products.map((item) => ({
    updateOne: {
      filter: { _id: item.product._id },
      update: { $inc: { quantity: -item.quantity } },
    },
  }));
  Product.bulkWrite(bulkOps, {}, (err, products) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    next();
  });
};

export default {
  create,
  productByID,
  photo,
  defaultPhoto,
  list,
  update,
  remove,
  read,
  listByShop,
  listCategories,
  listLatest,
  listRelated,
  increaseQuantity,
  decreaseQuantity,
};

