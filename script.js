let url = "https://www.themealdb.com/api/json/v1/1/search.php?s=";
let container = document.querySelector(".container");
let searchBtn = document.getElementById("search-btn");
let result = document.getElementById("result");
let inputBox =document.getElementById("enter-recipe")
let inputContainer = document.querySelector(".search-box")

var sNo ; 
var myMeal, count;
var recipeList
var ingredients = [];
var measures = [];


//Search button operation
searchBtn.addEventListener("click", ()=> {
    var recipe = document.getElementById("enter-recipe").value
       if (inputBox.value == "") {

           result.innerHTML = `<h3>Empty field. Please enter recipe name</h3>`
       } else {
        getData(recipe,0) //setting sNo to zero at the beginning
       }
    })

function getData(recipe,serial) {
  fetch(`${url}${recipe}`).then(data=> data.json()).then(response => {
              recipeList = response;
              console.log(recipeList)
              //finding out length of the array of recipes 
              count = recipeList.meals.length 
              recipeDetails(recipeList ,serial) //function call and passing an object to display the recipe
        }).catch(err => {
          result.innerHTML = `<h3>Entered Recipe not available! Please try again</h3>`
        })
}

//function for extracting recipe details and displaying
    function recipeDetails(itemList , No) { //receives an object
        myMeal = itemList.meals[No] //giving first recipe in array
       for(let i in myMeal){
         if(i.startsWith('strIngredient') && myMeal[i]){
          ingredients.push(myMeal[i]);
         }
         if(i.startsWith('strMeasure') && myMeal[i]){
          measures.push(myMeal[i]);
         }
       }
       displayItems(myMeal ,ingredients, measures, No); //function call for displaying details

}


//function for displaying recipe
function displayItems(mealDetails ,items,amounts ,serialNum) {
        let nameDish = mealDetails.strMeal //giving first recipe name
        let originDish = mealDetails.strArea  //giving place of origin
        let pictureDish = mealDetails.strMealThumb//giving image of dish
        let categoryDish = mealDetails.strCategory //giving category of dish

         result.innerHTML = `
        <div ><img src="${pictureDish}" alt="Photo of ${nameDish}" id="display-photo"></div>
        <div class="heading" id="heading">
          <h2 class="dish" id="dish">${nameDish}</h2>
          <h4 id="origin">Origin : ${originDish}</h4>
          <h4 id="category">Category : ${categoryDish}</h4> 
        </div>
        <div class="ingredients" id="ingredients"></div>
        <div id="button-controls" style="text-align:center, display:flex">
           <button class="previous arrow" onClick="changeNo(${serialNum},-1)">
                 <i class="fa-solid fa-arrow-left"></i>
           </button>
           <button class="next arrow" onClick="changeNo(${serialNum},1)">
                 <i class="fa-solid fa-arrow-right"></i>
           </button>
           <button class="view-recipe" id="view-recipe" style="float:right" onClick="displayProcess(${serialNum})">View ${nameDish}
           </button>
        </div> 
        `
        displayRecipe(items,amounts);
        
}

//function for changing recipe through buttons
function changeNo(sNo,order) { 
  //condition for first and previous recipe button press
  if(sNo === 0 && order == -1) {
    sNo = count -1; //goes to last
  } else if (sNo === count -1 && order == 1) {
    sNo = 0; //goes to the beginning
  } else {
  sNo = sNo + order; //normal add or subtract
  }
  ingredients = [];
  measures = [] ; //clearing previous added data
  recipeDetails(recipeList,sNo)
}



//function for displaying recipe ingredients
function displayRecipe(ingredients,measures) {
  // displaying the ingredient array 
  const divContainer = document.getElementById("ingredients")
  for (i=0; i<ingredients.length; i++){
      const divContain = document.createElement("li")
         divContain.className = "item";
         //conditional for ingredient without any measurement
         measures[i] == " " ? divContain.innerText = ingredients[i]
         : divContain.innerText = ingredients[i] + " : " + measures[i]
    
     divContainer.appendChild(divContain);
  }
   
}

//function for displaying recipe process 
//pass serial number to display 
function displayProcess(sNo) {
    inputContainer.classList.add("hide")
   result.innerHTML =`<div class="recipe-display">
              <button class="hide-recipe" id="hide-recipe" onClick="closeProcess(${sNo})">X</button>
              <p class="process" id="process">${myMeal.strInstructions}</p>
        </div>`
}

//function for closing recipe 
function closeProcess(sNo) { 
    inputContainer.classList.remove("hide")
  displayItems(myMeal ,ingredients, measures,sNo);
}








