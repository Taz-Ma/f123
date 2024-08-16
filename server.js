const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware 
app.use(express.json());
MONGODB_URI= "mongodb+srv://3380:3380@tm-1.3rfpsev.mongodb.net/f0815"


// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('Error connecting to MongoDB:', err));

// DB Item schema
const itemSchema = new mongoose.Schema({

    title: { type: String, required: true },
    author: { type: String, required: true },
    description: { type: String },
        
})
// declare Item in MongoDB
const Item = mongoose.model("Item", itemSchema)


const router = express.Router()


// Add Item
app.use("/", router)
router.route("/item/add").post((req,res)=>{

        const title = req.body.title
        const author = req.body.author
        const description = req.body.description
   
        const newItem = new Item( {
            title,author,description
        })

        newItem
            .save()
            .then(()=>res.json("New Item Added"))
            .catch((err) =>{
                res.status(400).json("Error: " + err);
            })
    })

//Get all
    router.route("/items")
    .get((req,res)=>{
        Item.find()
            .then((items)=>{res.json(items)})
            .catch((err) =>{
                res.status(400).json("Error: " + err);
            })
    })

// Get Random (put before fin by ID)
    router.route("/item/random")
    .get((req, res) => {
        Item.aggregate([{ $sample: { size: 1 } }])
            .then((randomItem) => {
                res.json(randomItem[0]);
            })
            .catch((err) => {
                res.status(400).json("Error: " + err);
            });
    });


//Find by ID
    router.route("/item/:id")
        .get((req, res) => {
            Item.findById(req.params.id)
                .then((item) => {
                    res.json(item);
                })
                .catch((err) => {
                    res.status(400).json("Error: " + err);
                });
        });

// Update
router.route("/item/update/:id")
    .put((req, res) => {
        Item.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .then((updatedItem) => {
                res.json(updatedItem);
            })
            .catch((err) => {
                res.status(400).json("Error: " + err);
            });
    });

//Delete
router.route("/item/delete/:id")
    .delete((req, res) => {
        Item.findOneAndDelete(req.params.id)
            .then(() => {
                res.json("Item deleted.");
            })
            .catch((err) => {
                res.status(400).json("Error: " + err);
            });
    });



// Routes
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});