import HTTPStatus from 'http-status';
import _ from 'lodash';
import formidable from 'formidable';
import fs from 'fs';

import Shop from './shop.model';

const create = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(HTTPStatus.BAD_REQUEST).json({
        message: 'Image could not be uploaded',
      });
    }
    const shop = new Shop(fields);
    shop.owner = req.profile;
    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path);
      shop.image.contentType = files.image.type;
    }
    shop.save((error, result) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error,
        });
      }
      res.status(HTTPStatus.CREATED).json(result);
    });
  });
};

const shopByID = (req, res, next, id) => {
  Shop.findById(id).populate('owner', '_id name').exec((err, shop) => {
    if (err || !shop) {
      return res.status(HTTPStatus.NOT_FOUND).json({
        error: 'shop not found',
      });
    }
    req.shop = shop;
    next();
  });
};

const photo = (req, res, next) => {
  if (req.shop.image.data) {
    res.set('Content-Type', req.shop.image.contentType);
    return res.send(req.shop.image.data);
  }
  next();
};

const defaultPhoto = (req, res) => res.sendFile(process.cwd() + profileImage);

const list = (req, res, next) => {
  Shop.find((err, shops) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(shops);
  });
};

const listByOwner = (req, res, next) => {
  Shop.find({ owner: req.profile._id }, (err, shops) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(shops);
  }).populate('owner', '_id name');
};

const read = (req, res, next) => res.status(HTTPStatus.OK).json(req.shop);

const update = (req, res, next) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        message: 'Photo could not be uploaded',
      });
    }
    let shop = req.shop;
    shop = _.extend(shop, fields);
    if (files.image) {
      shop.image.data = fs.readFileSync(files.image.path);
      shop.image.contentType = files.image.type;
    }
    shop.save((error, result) => {
      if (err) {
        return res.status(HTTPStatus.BAD_REQUEST).json({
          error,
        });
      }
      res.status(HTTPStatus.CREATED).json(result);
    });
  });
};

const isOwner = (req, res, next) => {
  const isOwner = req.shop && req.auth && req.shop.owner._id == req.auth._id;
  if (!isOwner) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({
      error: 'User is not authorized',
    });
  }
  next();
};

const remove = (req, res) => {
  const shop = req.shop;
  shop.remove((err, result) => {
    if (err) {
      return res.status(HTTPStatus.BAD_REQUEST).json({
        error: err,
      });
    }
    return res.status(HTTPStatus.OK).json(result);
  });
}
;
export default {
  create,
  shopByID,
  photo,
  defaultPhoto,
  list,
  listByOwner,
  read,
  update,
  isOwner,
  remove,
}
;
