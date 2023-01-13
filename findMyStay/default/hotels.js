const mongoose = require('mongoose')
const cities=require('./cities')
const {places,descriptors}=require('./places')
const hotel=require('../Model/hotel')
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://0.0.0.0:27017/findMyStay')
const db=mongoose.connection;
db.on("error",console.error.bind(console,"connection error:"));
db.once("open",()=>{
    console.log("Connected")
})

const sample=array=>array[Math.floor(Math.random()*array.length)]

const fake=async()=>{
    await hotel.deleteMany({});
    for(let i=0;i<100;i++){
        const c=Math.floor(Math.random()*110);
        const price=Math.floor(Math.random()*40)+20;
        const h=new hotel({
            author:"63bac88d86534800009f1fee",
            location:`${cities[c].city},${cities[c].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            description:"Lorem ipsum dolor, sit amet consectetur adipisicing elit. Non fuga quam harum dignissimos repellat officia aperiam distinctio quod enim! Incidunt hic reprehenderit deserunt rerum a harum dicta aliquid, voluptatem corrupti.",
            price:price,
            geometry:{ 
                "type" : "Point", 
                "coordinates" :[
                    cities[c].longitude,
                    cities[c].latitude,
                ]
             },
            images:[ { "url" : "https://images.unsplash.com/photo-1561501878-aabd62634533?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8ODd8fGhvdGVsfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
                       "filename" : "FindMyStay/xucvwftha8bm5r4viuwp"
                    },
                     { "url" : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8aG90ZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                     "filename" : "FindMyStay/uiwtqshrzj3e5ybppfvi" 
                    },
                    { "url" : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWx8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
                    "filename" : "FindMyStay/uiwtqshrzj3e5ybppfvi" 
                   }
                ]
        })
        await h.save();
    }
}

fake()