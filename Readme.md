Recipe Sharing Platform

This is a Recipe Sharing Platform built using Node.js, MongoDB, HTML, Bootstrap, and JavaScript. Users can sign up, sign in, add their own recipes, view all recipes, edit only the ones they created and delete recipes.

Features:
User authentication (Signup & Signin)
Add recipes (title, ingredients, steps, cooking time, and images)
View all recipes
Edit and delete own recipes
Search recipes

Prerequisites

1. Software Requirements:
Node.js (version 14 or higher)
MongoDB (Local or Cloud MongoDB, like MongoDB Atlas)
NPM (Node Package Manager, comes with Node.js)

Project Structure
Backend:
├── backend/                   # Node.js backend
│   ├── config/                 # MongoDB connection setup
│   ├── models/                 # Mongoose models (User, Recipe)
│   ├── routes/                 # API routes for authentication and recipes
     ├── middleware/    
     ├── controller/                              
│   ├── server.js                  # Main backend file


FrontEnd: 
├── index.html              # Home page
│   ├── signin.html             # Sign In page
│   ├── signup.html             # Sign Up page│ 
│   ├── recipe.html            # Recipe detail page
     ├── add-recipe.html      #add new recipe
│   └── js                         # JavaScript file for API calls
         ├── auth.js
         ├── app.js           
│   ├── style.css       


Setup    

1.clone the repository      

git clone https://github.com/your-username/recipe-sharing-platform.git
cd recipe-sharing-platform

2. Install Backend Dependencies
   
cd backend,
npm install

3. run backend server
 
node server.js  

Frontend :

navigate to frontend folder: cd recipe platform/frontend
open index.html in browser.
