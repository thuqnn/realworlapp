const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
    console.log("database is connected");
  } catch (error) {
    console.log("disconect");
  }
}
module.exports = { connect };
