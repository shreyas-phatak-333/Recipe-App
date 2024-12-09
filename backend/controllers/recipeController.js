const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Add new recipe
exports.addRecipe = async (req, res) => {
    const { title, ingredients, steps, cookingTime } = req.body;
    try {
        const recipe = new Recipe({
            title,
            ingredients,
            steps,
            cookingTime,
            createdBy: req.user.id, // user ID from JWT
            image: req.file ? req.file.path : null, // Assuming image is uploaded using multer
        });

        await recipe.save();
        res.status(201).json({ message: 'Recipe added successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error adding recipe' });
    }
};

// Get all recipes
exports.getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find().populate('createdBy', 'username');
        res.status(200).json(recipes);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error fetching recipes' });;
    }
};

// Get single recipe by ID
exports.getRecipeById = async (req, res) => {
    try {
      const recipe = await Recipe.findById(req.params.id);
      if (!recipe) {
        return res.status(404).json({ message: 'Recipe not found' });
      }
      res.status(200).json(recipe);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching recipe' });
    }
  };

// Edit own recipe
exports.editRecipe = async (req, res) => {
    const { title, ingredients, steps, cookingTime } = req.body;
    try {
        let recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        if (recipe.createdBy.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });

        recipe.title = title;
        recipe.ingredients = ingredients;
        recipe.steps = steps;
        recipe.cookingTime = cookingTime;
        recipe.image = req.file ? req.file.path : recipe.image;

        await recipe.save();
        res.status(200).json({ message: 'Recipe updated successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error editing recipe' });
    }
};

// Delete recipe
exports.deleteRecipe = async (req, res) => {
    try {
        let recipe = await Recipe.findById(req.params.id);
        console.log(recipe)
        if (!recipe) return res.status(404).json({ msg: 'Recipe not found' });

        if (recipe.createdBy.toString() !== req.user.id)
            return res.status(401).json({ msg: 'Not authorized' });

        await Recipe.findByIdAndDelete(recipe._id);
        res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Error deleting recipe' });
    }
};