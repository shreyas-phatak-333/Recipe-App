const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const { addRecipe, getRecipes, editRecipe, deleteRecipe, getRecipeById } = require('../controllers/recipeController');
const authMiddleware = require('../middleware/authMiddleware'); // middleware for authentication

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Setup file upload using multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the absolute path
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.use(authMiddleware); // Protect all routes below

router.get('/recipes', getRecipes); // Get all recipes
router.get('/recipe/:id', getRecipeById); // Get single recipes
router.post('/recipes/add', upload.single('image'), addRecipe); // Add recipe
router.put('/recipe/:id', upload.single('image'), editRecipe); // Edit recipe
router.delete('/recipes/delete/:id', deleteRecipe); // Delete recipe

module.exports = router;