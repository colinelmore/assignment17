const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({dest:__dirname + "/public/images"});

mongoose.connect("blahblahefmkewfjefwmefmefw")
.then(() => console.log("Connected to mongodb..."))
.catch((err) => console.error("could not connect ot mongodb...", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const foodSchema = new mongoose.Schema({
    name: String,
    description: String,
    condiments: [String],
    img: String,
});

const Food = mongoose.model("Food", foodSchema);

app.get("/api/foods", (req, res) => {
    getFoods(res);
});

const getFoods = async (res) => {
    const foods = await Food.find();
    res.send(foods);
}

app.post("/api/foods", upload.single("img"), (req, res) => {
    console.log(req.body);
    const result = validateFood(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const food = new Food ({
        name: req.body.name,
        description: req.body.description,
        condiments: req.body.condiments.split(","),
    });

    if (req.file){
        food.img = "images/" + req.file.filename;
    }

    createFood(food, res);
});

const createFood = async(food, res) => {
    const result = await food.save();
    res.send(food);
};

app.put("/api/foods/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const food = foods.find((r) => r.id === id);;

    const result = validateFood(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    food.name = req.body.name;
    food.description = req.body.description;
    food.condiments = req.body.condiments.split(",");

    res.send(foods);
});

let foods = [{
    id:1,
    name:"Hot Dog",
    description: "Weiner on a bun",
    condiments:
    [
        "chili",
        "cheese",
        "mayo"
    ],
},
    {
        id:2,
        name:"Hamburger",
        description:"Patty with condiments in a bun",
        review:"Wack!", rating: "8/10",
        condiments:
        [
            "cheese",
            "mayo",
            "mustard"
        ],
    },
    {
        id:3,
        name:"Pizza",
        description:"Bread with melted cheese",
        review:"So delicious!", rating: "9/10",
        condiments:
        [
            "cheese",
            "sausage",
            "olives"
        ],
    }
]

app.delete("/api/foods/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const food = foods.find((f) => f.id === id);

    if (!food) {
        res.status(404).send("The food was not found");
        return;
    }

    const index = foods.indexOf(food);
    foods.splice(index, 1);
    res.send(food);

});

const validateFood = (food) => {
    const schema = Joi.object({
        id : Joi.allow(" "),
        name: Joi.string().min(3).required(),
        description: Joi.string().min(3).required(),
        condiments: Joi.allow(""),
    });

    return schema.validate(food);
};

app.listen(5000, () =>{
    console.log("Im listening");
}); 