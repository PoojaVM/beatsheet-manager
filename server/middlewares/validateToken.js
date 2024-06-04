import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
  jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.COGNITO_USER_POOL_ID}/.well-known/jwks.json`,
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    var signingKey = key?.publicKey || key?.rsaPublicKey;
    callback(null, signingKey);
  });
}

function validateToken(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    jwt.verify(
      token,
      getKey,
      { algorithms: ["RS256"] },
      function (err, decoded) {
        if (err) {
          return res.status(401).send({ message: "Unauthorized" });
        }

        if (!decoded) {
          return res.status(401).send({ message: "Unauthorized" });
        }

        req.userName = decoded?.["cognito:username"];

        if (!req.userName) {
          return res.status(401).send({ message: "Unauthorized" });
        }
        next();
      }
    );
  } catch (error) {
    next({ status: 401, message: "Unauthorized. Something went wrong" });
  }
}

export default validateToken;
