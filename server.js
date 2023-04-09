const mongoose = require("mongoose");

const app = require('./app')
//lOq0Z2vFCvFeYXyl

const DB_HOST = "mongodb+srv://maknamar12:lOq0Z2vFCvFeYXyl@cluster0.hjo3h2l.mongodb.net/db-contacts?retryWrites=true&w=majority"

mongoose.connect(DB_HOST)
  .then(() => app.listen(3000), console.log("Database connection successful"))
  .catch(error =>{
    console.log(error.message);
    process.exit(1);
  });




