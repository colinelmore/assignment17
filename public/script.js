
const getFoods = async () => {
    try{
        return (await fetch("/api/foods/")).json();
    } catch(error) {
        console.log(error);
    }
}

const showFoods = async() => {
    let foods = await getFoods();
    let foodsDiv = document.getElementById("food-list");
    foodsDiv.innerHTML = "";
    foods.forEach((food) => {
        const section = document.createElement("section");
        section.classList.add("food");
        foodsDiv.append(section);

        const a = document.createElement("a");
        a.href = "#";
        section.append(a);

        h3 = document.createElement("h3");
        h3.innerHTML = food.name;
        a.append(h3);

        a.onclick = (e) => {
            e.preventDefault();
            displayDetails(food);
        };
    });
};

const displayDetails = (food) => {
    const foodDetails = document.getElementById("food-details");
    foodDetails.innerHTML = "";

    const h3 = document.createElement("h3");
    h3.innerHTML = food.name;
    foodDetails.append(h3);

    const dLink = document.createElement("a");
    dLink.innerHTML = "	&#x2715;";
    foodDetails.append(dLink);
    dLink.id = "delete-link";

    const eLink = document.createElement("a");
    eLink.innerHTML = "&#9998;";
    foodDetails.append(eLink);
    eLink.id = "edit-link";

    const p = document.createElement("p");
    foodDetails.append(p);
    p.innerHTML = food.description;

    const ul = document.createElement("ul");
    foodDetails.append("ul");
    //console.log(food.condiments);
    food.condiments.forEach((condiment) => {
        const li = document.createElement("li");
        ul.append(li);
        li.innerHTML = condiment;
    });

    eLink.onclick = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Edit Description"
    console.log("Editing");
    };

    dLink.onclick = (e) => {
    e.preventDefault();
    deleteFood(food);
    console.log("deleting");
    };

    populateEditForm(food);
};

const deleteFood = async(food) => {
    let response = await fetch(`/api/foods/${food.id}`,{
        method: "DELETE",
        headers: {"Content-Type": "application/json;charset=utf-8"}
    });

    if(response.status != 200){
        console.log("error deleting");
        return;
    }

    let result = await response.json();
    showFoods();
    document.getElementById("food-details").innerHTML = "";
    resetForm();
}

const populateEditForm = (food) => {
    const form = document.getElementById("add-edit-food-form")
    form.id.value = food.id;
    form.name.value = food.name;
    form.description.value = food.description;
    populateCondiments(food);
};

const populateCondiments = (food) => {
     const section = document.getElementById("condiment-boxes");
     food.condiments.forEach((condiment)=> {
        const input = document.createElement("input");
        input.type = "text";
        input.value = condiment;
        section.append(input)
     });
}

const addEditFood = async (e) => {
    e.preventDefault();

    const form = document.getElementById("add-edit-food-form");
    const formData = new FormData(form);
    let response;
    formData.append("condiments", getCondiments());

    if(form.id.value == -1){
        formData.delete("id");
        
        response = await fetch("/api/foods", {
            method:"POST",
            body: formData,
        });
    }
    else {

        console.log(...formData);

        response = await fetch(`/api/foods/${form.id.value}`, {
            method: "PUT",
            body: formData
        });
    }


    if(response.status != 200) {
        console.log("Error");
        return;
    }

    food = await response.json();

    if (form.id.value != -1) {
        displayDetails(food);
    }

    resetForm();
    document.querySelector(".dialog").classList.add("transparent");
    showFoods();
}; 

const getCondiments = () => {
    const inputs = document.querySelectorAll("#condiment-boxes input");
    const condiments = [];

    inputs.forEach((input)=>{
        condiments.push(input.value);
    });
    return condiments;
};

const resetForm = () => {
    const form = document.getElementById("add-edit-food-form");
    form.reset();
    form.foodId = "-1";
    document.getElementById("condiment-boxes").innerHTML = " ";
}

const showHideAdd = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("transparent");
    document.getElementById("add-edit-title").innerHTML = "Add Food";
    resetForm();
}

const addCondiment = (e) => {
    e.preventDefault();
    const section = document.getElementById("condiment-boxes");
    const input = document.createElement("input");
    input.type = "text";
    section.append(input);
}


window.onload = () => {
    showFoods();
    document.getElementById("add-edit-food-form").onsubmit = addEditFood;
    document.getElementById("add-link").onclick = showHideAdd;

    document.querySelector(".close").onclick = () => {
        document.querySelector(".dialog").classList.add("transparents");
    }

    document.getElementById("add-condiment").onclick = addCondiment;
}