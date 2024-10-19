const mongoose = require('mongoose');

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

const initData=require("./data");
const Listing=require("../models/listing");

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"670cc12677d11074c80c3994"}));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
}
initDB();

