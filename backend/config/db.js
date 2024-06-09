import mongoose from "mongoose";
import colors from 'colors'

const dbConnect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://letuananh28072002:Tuananh1234@cluster0.vhrrsxm.mongodb.net/ecommerce-mern"
    )
    .then(() => {
      console.log(`Connected to Database`.bgMagenta.white);
    });
};

export default dbConnect;
