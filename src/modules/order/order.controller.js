import _ from 'lodash';
import HTTPStatus from 'http-status';

import { CartItem, Order } from './order.model';

const create = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, result) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.CREATED).json(result);
  });
};

const listByShop = (req, res) => {
  Order.find({ 'products.shop': req.shop._id })
    .populate({ path: 'products.product', select: '_id name price' })
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error: err,
        });
      }
      return res.status(HTTPStatus.OK).json(orders);
    });
};

const update = (req, res) => {
  Order.update({ 'products._id': req.body.cartItemId }, { $set: {
    'products.$.status': req.body.status,
  } }, (err, order) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(order);
  });
};

const getStatusValues = (req, res) => {
  res.json(CartItem.schema.path('status').enumValues);
};

const orderByID = (req, res, next, id) => {
  Order.findById(id).populate('products.product', 'name price').populate('products.shop', 'name').exec((err, order) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    req.order = order;
    next();
  });
};

const listByUser = (req, res) => {
  Order.find({ user: req.profile._id })
    .sort('-created')
    .exec((err, orders) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error: err,
        });
      }
      return res.status(HTTPStatus.OK).json(orders);
    });
};

const read = (req, res) => res.status(HTTPStatus.OK).json(req.order);

export default {
  create,
  listByShop,
  update,
  getStatusValues,
  orderByID,
  listByUser,
  read,
}
;
