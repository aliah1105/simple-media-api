const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();
const userRouter = require("./routes/users");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/posts");

const app = express();
const PORT = 8800 || process.env.PORT;

// Database connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongodb connected"))
  .catch((e) => console.log(e.message));

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

// Api's
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);

app.get("/", (req, res) => {
  res.send("Hello from nodejs");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
