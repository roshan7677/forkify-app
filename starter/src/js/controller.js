import * as model from './model.js';
import 'core-js';
import 'regenerator-runtime';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';

const recipeContainer = document.querySelector('.recipe');

// NEW API URL (instead of the one shown in the video)
// https://forkify-api.jonas.io

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;
    recipeView.renderSpinner();

    // Loading recipe
    await model.loadRecipe(id);

    // Rendering the recipe
    recipeView.render(model.state.recipe);
    // const recipeView = new recipeView (model.state.recipe)
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResults = async function () {
  // 1) Get Search Query
  try {
    const query = searchView.getQuery();
    if (!query) return;

    // 2)
    await model.loadSearchResults(query);
    console.log(model.state.search.results);
  } catch (err) {
    console.log(err);
  }
};
controlSearchResults();

const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResults);
};

init();
