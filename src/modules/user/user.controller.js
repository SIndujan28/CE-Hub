import HTTPStatus from 'http-status';
import _ from 'lodash';
import request from 'request';
import stripe from 'stripe';
import User from './user.model';

const myStripe = stripe(process.env.stripe_test_secret_key);

export async function signup(req, res) {
  try {
    const user = await User.create(req.body);
    return res.status(HTTPStatus.CREATED).json(user.toAuthJSON());
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function login(req, res, next) {
  res.status(HTTPStatus.OK).json(req.user.toAuthJSON());
  next();
}

export async function list(req, res) {
  try {
    const users = await User.find({}, 'email userName createdAt updatedAt');
    return res.status(HTTPStatus.OK).json(users);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function userById(req, res, next, id) {
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(HTTPStatus.NOT_FOUND).json('Not found');
    }
    req.profile = user;
    next();
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json('User not found');
  }
}
export async function read(req, res) {
  req.profile.password = undefined;
  return res.status(HTTPStatus.OK).json(req.profile);
}

export async function remove(req, res) {
  try {
    const user = req.profile;
    await user.remove();
    return res.status(HTTPStatus.OK).json('User deleted');
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function update(req, res) {
  try {
    let user = req.profile;
    user = _.extend(user, req.body);
    await user.save();
    return res.status(HTTPStatus.ACCEPTED).json(user);
  } catch (error) {
    return res.status(HTTPStatus.BAD_REQUEST).json(error);
  }
}

export async function isSeller(req, res, next) {
  const Seller = req.profile && req.profile.seller;
  if (!Seller) {
    return res.status(HTTPStatus.UNAUTHORIZED).json({
      error: 'User is not a seller',
    });
  }
  next();
}
export async function stripe_auth(req, res, next) {
  request({
    url: 'https://connect.stripe.com/oauth/token',
    method: 'POST',
    json: true,
    body: { client_secret: process.env.stripe_test_secret_key, code: req.body.stripe, grant_type: 'authorization_code' },
  }, (error, response, body) => {
    // update user
    if (body.error) {
      return res.status('400').json({
        error: body.error_description,
      });
    }
    req.body.stripe_seller = body;
    next();
  });
}

export async function stripeCustomer(req, res, next) {
  if (req.profile.stripe_customer) {
    // update stripe customer
    myStripe.customers.update(req.profile.stripe_customer, {
      source: req.body.token,
    }, (err, customer) => {
      if (err) {
        return res.status(400).send({
          error: 'Could not update charge details',
        });
      }
      req.body.order.payment_id = customer.id;
      next();
    });
  } else {
    myStripe.customers.create({
      email: req.profile.email,
      source: req.body.token,
    }).then((customer) => {
      User.update({ _id: req.profile._id },
        { $set: { stripe_customer: customer.id } },
        (err, order) => {
          if (err) {
            return res.status(HTTPStatus.BAD_REQUEST).send({
              error: err,
            });
          }
          req.body.order.payment_id = customer.id;
          next();
        });
    });
  }
}

export async function createCharge(req, res, next) {
  if (!req.profile.stripe_seller) {
    return res.status('400').json({
      error: 'Please connect your Stripe account',
    });
  }
  myStripe.tokens.create({
    customer: req.order.payment_id,
  }, {
    stripe_account: req.profile.stripe_seller.stripe_user_id,
  }).then((token) => {
    myStripe.charges.create({
      amount: req.body.amount * 100, // amount in cents
      currency: 'usd',
      source: token.id,
    }, {
      stripe_account: req.profile.stripe_seller.stripe_user_id,
    }).then((charge) => {
      next();
    });
  });
}
