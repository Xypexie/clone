require("@babel/polyfill");
import Search from './model/Search';
import { elements, renderLoader, clearLoader } from './view/base';
import * as searchView from './view/searchView'
import Recipe from './model/Recipe';
import { renderRecipe, clearRecipe, highlightSelectedRecipe } from './view/recipeView';
import List from "./model/List";
import Like from './model/Like';
import * as listView from './view/listView';
import { startCase } from 'lodash';
import * as likesView from './view/likesView';

/*
* Web app tolov
* - Hailtiin query, ur dun
* - Tuhain joruud
* - Likelsan joruud
* - Zahialj bgaa joriin nairuulga
*/

const state = {};

//Contoller
const  controlSearch = async () => {
    // 1) Web ees hailtiin tvlhvvr vgiig gargaj awna.
    const query  = searchView.getInput();
   
    if(query){
        // 2) Shineer hailtiin object (Class Search object) - iig vvsgej ogno.
        state.search = new Search(query);
        // 3) Hailt hiihed zoriulj delgetsiin UI beltgene.
        searchView.clearSearchQuery();
        searchView.clearSearchResult();
        renderLoader(elements.searchResultDiv);
        // 4) Hailtiig gvitsetgene.
        await state.search.doSearch();
        // 5) Hailtiin vr dung delgetsend vzvvlne.
        // hailtiin process bvhii icon iig ustagj bna.
        clearLoader();
        //hailtaar ilersen uguig shalgaj bna ilersen bol delgesten hewlene.
        if(state.search.result === undefined) alert("Хайлтаар илэрцгүй....");
        else searchView.renderRecipes(state.search.result);
        
    }
}
// Search Button EventListener
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});
elements.pageButtons.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');

    if(btn){
        const gotoPageNumber = parseInt(btn.dataset.goto, 10);
        searchView.clearSearchResult();
        searchView.renderRecipes(state.search.result, gotoPageNumber);
    }
});

// Joriin controller
const controllRecipe = async () => {
    // 1. Url aas ID-g salgaj awna
    const id = window.location.hash.replace('#', '');
   
    //Url deer ID bgaa eshiig shalgaj bna.
    if(id){
        // 2.Joriin modeliig vvsgej ogno.
        state.recipe = new Recipe(id);
        // 3.UI delgetsiig beltgene.
        clearRecipe();
        renderLoader(elements.recipeDiv);
        highlightSelectedRecipe(id);
        // 4.Beldsenii daraa joroo tataj awchrana.
        await state.recipe.getRecipe();
        // 5.Joriig gvitsetgeh hugaatsaa bolon ortsiig tootsoolno uu.
        clearLoader();
        state.recipe.calcTime();
        state.recipe.calcHuniiToo();
        // 6.Joroo delgetsend gargana.
        renderRecipe(state.recipe, state.likes.isLiked(id));
    } 
}
window.addEventListener('hashchange', controllRecipe);
window.addEventListener('load', controllRecipe);
window.addEventListener('load', e => {
    if(!state.likes) state.likes = new Like();

    //Likes tsesiig gargah eshiig shiideh
    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());

    // like uud bwal tedgeriig tsesend nemj haruulna 
    state.likes.likes.forEach(like => likesView.renderLike(like));
});    

// Nairlaga nii Controll

const controllList = () =>{
    // Nairlaganii modeliig uusgene.
    state.list = new List();
    //Omno haragdaj bsan nairlagunuudig Delgtsees ustagana.
    listView.clearItems();

    // Ug model ruu odoo haragdaj bgaa jornii bvh nairlagiig awch hiine.
    state.recipe.ingredients.forEach( n => {
        //Tuhain nairlagaiig model ruu hiine.
       const item = state.list.addItem(n);
        //Tuhain nairlagagiig Delgetsend gargana.
        listView.renderItem(item);
    });
};
//Like Controller
const controlLike = () => {
    // 1. Like iin model iig vvsgene
   if(!state.likes) state.likes = new Like();
    // 2.ODoo haragdaj bgaa jorin id iig olj awah.
    const currentRecipeId = state.recipe.id;
    // 3.Ene jorri likelsan eshiig shlagah
    if(state.likes.isLiked(currentRecipeId)){
    // 4. likelsan bol like iig ni boliol ni
    state.likes.deleteLike(currentRecipeId);
    likesView.deleteLike(currentRecipeId);
    likesView.toggleLikeBtn(false);
    }else{
    // 5.like laagvi bol like hiine.
    const newLike = state.likes.addLike(currentRecipeId, state.recipe.title, state.recipe.publisher, state.recipe.image_url);
    likesView.renderLike(newLike);
    likesView.toggleLikeBtn(true);
    }

    likesView.toggleLikeMenu(state.likes.getNumberOfLikes());
}

elements.recipeDiv.addEventListener('click', e => {
    if(e.target.matches('.recipe__btn, .recipe__btn *')){
        controllList();
    }else if (e.target.matches('.recipe__love, .recipe__love *')){
        controlLike();
    }
});

elements.shoppingList.addEventListener('click', e => {
    //Click hiisen li elementiin data-itemid attribut --uudig shuuj gargaj avah.
    const id  = e.target.closest('.shopping__item').dataset.itemid;

    // Oldson id tei ortsiig modeloos ustgana.
    state.list.deleteItem(id);
    //Delgetsees  iim id tai ortsiig olj ustgana.
    listView.deleteItem(id);
});