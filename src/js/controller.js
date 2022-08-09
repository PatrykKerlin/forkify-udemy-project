import '@babel/polyfill';
import 'regenerator-runtime/runtime';

import {async} from 'regenerator-runtime';
import * as model from './model.js';
import {MODAL_CLOSE_SEC} from './config.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import bookmarksView from './views/bookmarksView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';

// https://forkify-api.herokuapp.com/v2

// if (module.hot) {
// 	module.hot.accept();
// }

///////////////////////////////////////

async function controlRecipes() {
	try {
		const id = window.location.hash.slice(1);
		if (!id) return;

		recipeView.renderSpinner();

		// Mark selected search result
		resultsView.update(model.getSearchResultsPage());
		bookmarksView.update(model.state.bookmarks);

		// 1. Loading recipe
		await model.loadRecipe(id);

		// 2. Rendering recipe
		recipeView.render(model.state.recipe);
	} catch (error) {
		recipeView.renderError();
	}
}

async function controlSearchResults() {
	try {
		resultsView.renderSpinner();
		// 1. Get search query
		const query = searchView.getQuery();
		if (!query) return;
		// 2. Load search results
		await model.loadSearchResults(query);
		// 3. Render search results
		resultsView.render(model.getSearchResultsPage());
		// 4. Render pagination
		paginationView.render(model.state.search);
	} catch (error) {
		console.log(error);
	}
}

function controlPagination(goToPage) {
	resultsView.render(model.getSearchResultsPage(goToPage));
	paginationView.render(model.state.search);
}

function controlServings(newServings) {
	model.updateServings(newServings);
	recipeView.update(model.state.recipe);
}

function controlAddBookmark() {
	if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
	else model.deleteBookmark(model.state.recipe.id);

	recipeView.update(model.state.recipe);

	bookmarksView.render(model.state.bookmarks);
}

function controlBookmarks() {
	bookmarksView.render(model.state.bookmarks);
}

async function controlAddRecipe(newRecipe) {
	try {
		addRecipeView.renderSpinner();

		await model.uploadRecipe(newRecipe);

		recipeView.render(model.state.recipe);

		addRecipeView.renderMessage();

		bookmarksView.render(model.state.bookmarks);

		window.history.pushState(null, '', `#${model.state.recipe.id}`);

		setTimeout(function () {
			addRecipeView._toggleWindow();
		}, MODAL_CLOSE_SEC * 1000);
	} catch (error) {
		addRecipeView.renderError(error.message);
	}
}

(function () {
	bookmarksView.addHandlerRender(controlBookmarks);
	recipeView.addHandlerRender(controlRecipes);
	recipeView.addHandlerUpdateServings(controlServings);
	recipeView.addHandlerAddBookmark(controlAddBookmark);
	searchView.addHandlerSearch(controlSearchResults);
	paginationView.addHandlerClick(controlPagination);
	addRecipeView.addHandlerUpload(controlAddRecipe);
})();
