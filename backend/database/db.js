import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.mongose_uri}/e-cart`);
    console.log("connect to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};
export default connectDB;
