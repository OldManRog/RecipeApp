
const mealsEl = document.getElementById('meals')

const favoriteContainer = document.getElementById('fav-meals')

const mealPopup = document.getElementById('meal-popup');
const ClosePopupBtn = document.getElementById('close-popup')
console.log(ClosePopupBtn)

const mealRecipeEl = document.getElementById('meal-recipe')
console.log(mealRecipeEl)

const searchTerm = document.getElementById('search-term')
const searchBtn = document.getElementById('search')




getRandomMeal()//Get's random meal
fetchFavMeals()//gets fav meals 

async function getRandomMeal() {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/random.php'); // grabs the response
    const respData = await resp.json() // turns the response into json
    const randomMeal = respData.meals[0] // assigns the randonMeal var to the json that is generated



    addMeal(randomMeal, true);

}

async function getMealByID(id) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/lookup.php?i=' + id);

    const respData  = await resp.json();

    const meal = respData.meals[0]

    return meal;
}


async function getMealsBySearch(term) {
    const resp = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=' + term);

    const respData = await resp.json();

    const meals = respData.meals;

    console.log(meals)

    return meals;

  
}



//Dynamically adds the meal
function addMeal(mealInfo, random = false) {
    
    
    const meal = document.createElement('div');
    meal.classList.add('meal')

    meal.innerHTML = `
    
    <div class="meal-header">
       ${random ? ` <span class="random">
       Random Recipe
   </span>` : ''}

        <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}">
    </div>
    <div class="meal-body">
        <h4> ${mealInfo.strMeal}</h4>
        <button class="fav-btn"><i class="fas fa-heart"></i></button>
    </div>

     `
    const btn = meal.querySelector(".meal-body .fav-btn");


    btn.addEventListener("click", () => {

        if (btn.classList.contains('active')) {
            removeMealLS(mealInfo.idMeal)
            btn.classList.remove("active");
        } else {
            addMealLS(mealInfo.idMeal)
            btn.classList.add("active");
        }

        fetchFavMeals();
    });
    

    meal.addEventListener('click', () => {

        showMealRecipe(mealInfo)
    })
    meals.appendChild(meal)
        ;
   

}




function addMealLS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem('fun', JSON.stringify([...mealIds, mealId]));
   
}

function removeMealLS(mealId) {
    const mealIds = getMealsLS();
    localStorage.setItem('fun', JSON.stringify(mealIds.filter((id) => id !== mealId)));
   

}


function getMealsLS() {
    const mealIds = JSON.parse(localStorage.getItem('fun'));

    console.log(mealIds)
    return mealIds === null ? [] : mealIds
   
}


async function fetchFavMeals() {
    favoriteContainer.innerHTML = "";
    const mealIds = getMealsLS();

    for(let i = 0; i < mealIds.length; i++) {
      const mealId = mealIds[i];
      meal = await getMealByID(mealId);

      addMealToFav(meal); // adding 'meal' which is the meal id that is saved in local storage
    
       
    }

}


function addMealToFav(mealInfo, random = false) {

    const favMeal = document.createElement('li');

   



    favMeal.innerHTML = `
    <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}"><span>${mealInfo.strMeal}</span><button class="clear"><i class="far fa-window-close"></i></button>
     `;
   
    const btn = favMeal.querySelector('.clear');

    btn.addEventListener('click', () => {
        removeMealLS(mealInfo.idMeal);
        fetchFavMeals();
       
        
    })

    favMeal.addEventListener('click', () => {
            showMealRecipe(mealInfo);
            
        
    })

  
    favoriteContainer.appendChild(favMeal);
    

}

function showMealRecipe(mealInfo) {
  
    //clear fetch from previous call
    mealRecipeEl.innerHTML = ''

    //update the meal info
    const mealEl = document.createElement('div');
    
    const ingredients = []

    //get ingredient and measures to display them
    for(let i=1; i<=20; i++ ){
        if(mealInfo['strIngredient'+i]){
            ingredients.push(`${mealInfo['strIngredient'+i]} /
             ${mealInfo['strMeasure'+i]} `)
        } else {
            break;
        }
    }


     mealEl.innerHTML = `
    <h1>${mealInfo.strMeal}</h1>
    <img src="${mealInfo.strMealThumb}" alt="${mealInfo.strMeal}" />


    <p>
      ${mealInfo.strInstructions}
    </p>
    <h3>Ingredients:</h3>
    <ul>
    ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>
    `
mealRecipeEl.appendChild(mealEl)

  //show the popup
  mealPopup.classList.remove('hidden')
  
}

searchBtn.addEventListener('click', async () => {
    mealsEl.innerHTML = '';

   const search = searchTerm.value;
   const meals = await getMealsBySearch(search);

   if(meals) {
   meals.forEach(meal => {
      addMeal(meal);
   })

} else {
    alert('Meal not found, try again')
}

})


ClosePopupBtn.addEventListener('click', () => {
    mealPopup.classList.add('hidden')
})
    