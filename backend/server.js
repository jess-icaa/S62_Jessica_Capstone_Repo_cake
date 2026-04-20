if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

console.log("ENV CHECK:", process.env.MONGODB_URI); 
const app = require("./src/app");
const connectDB = require("./src/config/db.config");
const cors = require("cors");


const PORT = process.env.PORT || 5001;

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});