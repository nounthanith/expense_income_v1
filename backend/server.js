const { default: mongoose } = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3001;
const DB = process.env.DB_URI;

mongoose.connect(DB).then(() => {console.log("Connected to MongoDB")}).catch((err) => {console.log(err)});

app.listen(PORT, () => {console.log(`Server is running on port: http://localhost:${PORT}`)});
