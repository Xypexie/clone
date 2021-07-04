import { elements } from "./base";

//private haragdatstai Function 
const renderRecipe = recipe => {
    const htmlMarkUp = 
    `<li>
        <a class="results__link" href="#${recipe.recipe_id}">
            <figure class="results__fig">
                <img src="${recipe.image_url}" alt="Test">
            </figure>
            <div class="results__data">
                <h4 class="results__name">${recipe.title}</h4>
                <p class="results__author">${recipe.publisher}</p>
            </div>
        </a>
    </li>
    `;
    // ul list ruu htmlMarkUp iig nemne.
    elements.searchResultList.insertAdjacentHTML("beforeend", htmlMarkUp);
};
//Searchiig tsewelene.
export const clearSearchQuery= () => {
    elements.searchInput.value = '';
};
//Search hiisen vr dvng dahin search hiihed ustana.
export const clearSearchResult = () => {
    elements.searchResultList.innerHTML = '';
    elements.pageButtons.innerHTML = '';
};
//Haih vgiin utgiig awna.
export const getInput = () => elements.searchInput.value;

export const renderRecipes = (recipes, currentPage = 1, resPerPage = 10 ) => {


    // Hailtiin vr dvng huudaslaj vzvvleh
    // page = 2, start = 10, end = 20;
    const start = (currentPage - 1) * resPerPage;
    const end = currentPage * resPerPage;

    // recipes dotor bgaa bvh data nuudaig 1 1 eer ni dawtaad renderRecipe function ruu damjuulj bna.
    recipes.slice(start, end).forEach(el => renderRecipe(el));

    // Huudaslaltuudiin button uudig gargaj ireh
    const totalPages = Math.ceil(recipes.length / resPerPage);
    renderButtons(currentPage, totalPages);
};

// type ===> 'prev' , 'next'
const createButton = (page, type, direction) => `
    <button class="btn-inline results__btn--${type}" data-goto=${page}>
        <span>Хуудас ${page}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${direction}"></use>
        </svg> 
    </button>`;

// Button vzvvleh Function
const renderButtons = (currentPage, totalPages) => {
    let buttonHtml;
    if(currentPage === 1 && totalPages > 1){
        // 1-r huudas deer bna, 2-r huudas gedeg towchiig garga
        buttonHtml = createButton(2, "next", 'right');
    }else if(currentPage < totalPages){
        //Omnoh bolon daraachin huudasruu shiljih towchuudig vzvvleh.
        buttonHtml = createButton(currentPage-1, "prev", 'left');
        buttonHtml += createButton(currentPage+1, "next", 'right');
    }
    else if(currentPage === totalPages){
        //Hamgiin suuliin huudas deer bna.Omnohruu shiljvvleh towchiig vzvvlne.
        buttonHtml = createButton(currentPage-1, "prev", 'left');
    }

    elements.pageButtons.insertAdjacentHTML('afterbegin', buttonHtml);
};