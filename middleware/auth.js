import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    let decodedData;

    if (token) {
      decodedData = jwt.verify(token, secret);
      req.userId = decodedData?.id;
      next();
    }
  } catch (error) {
    res.status(500).json("error");
  }
};
