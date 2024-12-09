// API base URL
const apiUrl = 'http://localhost:5000/api'; // Replace with your actual backend URL

// Get the authentication token from localStorage
const getAuthToken = () => localStorage.getItem('authToken');

// Set up the headers for authenticated requests
const getAuthHeaders = () => {
  const token = getAuthToken();
  if (token) {
    return {
      'Authorization': `${token}`,
    };
  }
  return { 'Content-Type': 'application/json' }; // No token, public access
};

// Fetch all recipes
async function fetchRecipes() {
  const response = await fetch(`${apiUrl}/recipes/recipes`, {
    method: 'GET',
    headers: getAuthHeaders(), // Include the token in the headers
  });

  if (response.ok) {
    const recipes = await response.json();
    displayRecipes(recipes);
  } else {
    console.error('Failed to fetch recipes', response.status);
    if (response.status === 401) {
      alert('You are not authorized. Please log in.');
      window.location.href = 'signin.html';
    }
  }
}

// Display all recipes
function displayRecipes(recipes) {
  const recipeList = document.getElementById('recipeList');
  if (recipeList) {
    recipes.forEach(recipe => {
      recipeList.innerHTML += `
        <div class="col-md-3">
          <div class="card">
            <img src="${recipe.image}" class="card-img-top" alt="${recipe.title}">
            <div class="card-body">
              <h5 class="card-title">${recipe.title}</h5>
              <button class="btn btn-primary view-recipe-btn" data-recipe-id="${recipe._id}">View Recipe</button>
              <button class="btn btn-danger delete-recipe-btn" data-recipe-id="${recipe._id}">Delete Recipe</button>
            </div>
          </div>
        </div>
      `;
    });

    const viewRecipeButtons = document.querySelectorAll('.view-recipe-btn');
    viewRecipeButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        const recipeId = event.target.getAttribute('data-recipe-id');
        window.location.href = `recipe.html?id=${recipeId}`
        fetchRecipeDetails(recipeId);
      });
    });

    const deleteRecipeButtons = document.querySelectorAll('.delete-recipe-btn');
    deleteRecipeButtons.forEach(button => {
      button.addEventListener('click', function(event) {
        const recipeId = event.target.getAttribute('data-recipe-id');
        deleteRecipe(recipeId);
      });
    });
  }
  if(recipes.length<=0) {
    recipeList.innerHTML += `
    <div class="col-12 text-center">
      <div class="alert alert-info" role="alert">
        No recipes to display.
      </div>
    </div>
  `;
  }
  
}

// Search function
function searchRecipes() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const recipes = document.querySelectorAll('.card');
  recipes.forEach(recipe => {
    const title = recipe.querySelector('.card-title').textContent.toLowerCase();
    if (title.includes(query)) {
      recipe.style.display = '';
    } else {
      recipe.style.display = 'none';
    }
  });
}

// Fetch single recipe details
async function fetchRecipeDetails(id) {
    const url = new URL(window.location.href);
    if(url.searchParams.get('id') !=="" || url.searchParams.get('id') !==null) {
        id = url.searchParams.get('id');
    }

  const response = await fetch(`${apiUrl}/recipes/recipe/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(), // Include the token in the headers
  });

  if (response.ok) {
    const recipe = await response.json();
    if(recipe) {
        document.getElementById('recipeTitle').textContent = recipe.title;
        document.getElementById('ingredients').innerHTML = `<b>Ingredients: </b>${recipe.ingredients}`;
        document.getElementById('steps').textContent = recipe.steps;
        document.getElementById('recipeImage').src = recipe.image;
        document.getElementById('cookingTime').innerHTML = `<b>Cooking Time: </b> ${recipe.cookingTime}`;
        document.getElementById('editBtn').setAttribute('data-bs-toggle', 'modal');
        document.getElementById('editBtn').setAttribute('data-bs-target', '#exampleModal');
        
        editBtn.addEventListener('click', () => {
          document.getElementById('title-input').value = recipe.title;
          document.getElementById('ingredients-input').value = recipe.ingredients;
          document.getElementById('steps-input').value = recipe.steps; // Use value instead of textContent for textarea
          document.getElementById('time-input').value = recipe.cookingTime;
          const imageInput = document.getElementById('image-input');
          imageInput.value = ""; // Reset the file input before uploading
        });
    }
  } else {
    console.error('Failed to fetch recipe', response.status);
    if (response.status === 401) {
      alert('You are not authorized to view this recipe.');
      window.location.href = 'signin.html';
    }
  }
}

// Add a new recipe
document.getElementById('recipeForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const steps = document.getElementById('steps').value;
  const image = document.getElementById('image').files[0];
  const createdBy = localStorage.getItem('userId');
  const ingredients = document.getElementById('ingredients').value;
  const cookingTime = document.getElementById('time').value;

  const formData = new FormData();
 formData.append('title', title);
 formData.append('ingredients', ingredients);
 formData.append('steps', steps);
 formData.append('cookingTime', cookingTime);
 formData.append('createdBy', createdBy);
 formData.append('image', image);

  const response = await fetch(`${apiUrl}/recipes/recipes/add`, {
    method: 'POST',
    headers: getAuthHeaders(), // Include the token in the headers
    body: formData
  });

  if (response.ok) {
    alert('Recipe added successfully');
    window.location.href = 'index.html';
  } else {
    console.error('Failed to add recipe', response.status);
    if (response.status === 401) {
      alert('You are not authorized. Please log in.');
      window.location.href = 'signin.html';
    }
  }
});

// Edit an existing recipe

document.getElementById('saveChanges')?.addEventListener('click', () => {
  const id = new URLSearchParams(window.location.search).get('id');
  const title = document.getElementById('title-input').value;
  const steps = document.getElementById('steps-input').value;
  const image = document.getElementById('image-input').files[0];
  const createdBy = localStorage.getItem('userId');
  const ingredients = document.getElementById('ingredients-input').value;
  const cookingTime = document.getElementById('time-input').value;

  const formData = new FormData();
  formData.append('title', title);
  formData.append('ingredients', ingredients);
  formData.append('steps', steps);
  formData.append('cookingTime', cookingTime);
  formData.append('createdBy', createdBy);
  formData.append('image', image);
  editRecipe(formData,id);
}) 

async function editRecipe(formData,id) {

  const response = await fetch(`${apiUrl}/recipes/recipe/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(), // Include the token in the headers
    body: formData,
  });

  if (response.ok) {
    alert('Recipe updated successfully');
    window.location.href = 'index.html';
  } else {
    console.error('Failed to edit recipe', response.status);
    if (response.status === 401) {
      alert('You are not authorized to edit this recipe.');
      window.location.href = 'signin.html';
    }
  }
}

// Delete a recipe
async function deleteRecipe(id) {
  const response = await fetch(`${apiUrl}/recipes/recipes/delete/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(), // Include the token in the headers
  });

  if (response.ok) {
    alert('Recipe deleted successfully');
    window.location.href = 'index.html';
  } else {
    console.error('Failed to delete recipe', response.status);
    if (response.status === 401) {
      alert('You are not authorized to delete this recipe.');
      window.location.href = 'signin.html';
    }
  }
}

document.addEventListener('DOMContentLoaded', fetchRecipes);
document.addEventListener('DOMContentLoaded', fetchRecipeDetails)
