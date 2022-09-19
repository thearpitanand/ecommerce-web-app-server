const braintree = require("braintree");

const {
  BRAINTREE_SECRET_MERCHANT_ID,
  BRAINTREE_SECRET_PUBLIC_KEY,
  BRAINTREE_SECRET_PRIVATE_KEY,
} = process.env;

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: BRAINTREE_SECRET_MERCHANT_ID,
  publicKey: BRAINTREE_SECRET_PUBLIC_KEY,
  privateKey: BRAINTREE_SECRET_PRIVATE_KEY,
});

exports.getToken = (req, res) => {
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(response);
    }
  });
};

exports.processPayment = (req, res) => {
  let nonceFromTheClient = req.body.paymentMethodNonce;
  let amountFromTheClient = req.body.amount;
  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        res.json(result);
      }
    }
  );
};
