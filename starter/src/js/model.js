// Module to write entire MODEL of MVC
// import { async } from '.regenerator-runtime';
import { getJSON } from './helpers.js';
import { API_URL } from './config.js';

//State object containing recipe, and other objects

export const state = {
  recipe: {},
};

export const loadRecipe = async function (id) {
  try {
    const data = await getJSON(`${API_URL}/${id}`);

    const { recipe } = data.data;
    state.recipe = {
      id: recipe.id,
      title: recipe.title,
      publisher: recipe.publisher,
      sourceUrl: recipe.source_url,
      image: recipe.image_url,
      servings: recipe.servings,
      cookingTime: recipe.cooking_time,
      ingredients: recipe.ingredients,
    };
    console.log(state.recipe);
  } catch (err) {
    //Temporary error handling!
    console.error(`${err} 🔥🔥🔥`);
  }
};
