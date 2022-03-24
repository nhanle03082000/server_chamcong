require("./database/db");
const app = require("express")();
const port = 3000;

const UserRouter = require("./router/User");
const informationRouter = require("./router/informationUser");

// For accepting post form data
const bodyParser = require("express").json;
app.use(bodyParser());

app.use("/user", UserRouter);
app.use("/user", informationRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
