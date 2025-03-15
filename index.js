/*
Author: Brisa Carter
Project: A simple recipe website
Date: 03/09/25
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
//Requires the path module to use the path.join function to join file paths
const path = require("path"); 

//Requires the fs module to use the fs.readFile function to read the file
const fs = require("fs"); 
const app = express();
const PORT = process.env.PORT || 3000; // Use environment variable for tests
//Uses the body-parser middleware to parse the request body
app.use(bodyParser.urlencoded({ extended: true }));

// Set view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.static(path.join(__dirname, 'public')));

// Load recipe data from a JSON file
const recipes = [
  JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recipe1.json'), 'utf8')), 
  JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recipe2.json'), 'utf8')), 
  JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'recipe3.json'), 'utf8'))
];

// Routes
app.get('/', (req, res) => {
  res.render('home', { 
    title: 'Yes, I tried!', 
    recipes: recipes 
  });
});

app.get('/recipe/:id', (req, res) => {
  const id = parseInt(req.params.id);
  // Checks if the recipe ID is valid
  if (id < 1 || id > recipes.length) {
    return res.status(404).send('Recipe not found');
  }
//Creates the navigation between the recipes, uing the previous and next buttons
  const recipe = recipes[id - 1];
  const nextId = id < recipes.length ? id + 1 : 1;
  const prevId = id > 1 ? id - 1 : recipes.length;

  //Displays the recipes
  res.render('recipe', {
    title: recipe.title, 
    recipe: recipe, 
    nextId: nextId, 
    prevId: prevId, 
    recipeId: id
  });
});
//Routs to the about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About Page' });
});

// Starts server
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
});
