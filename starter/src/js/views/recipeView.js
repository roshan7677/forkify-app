import View from './View.js';
import icons from 'url:../../img/icons.svg';

// Local fallback for Fraction (replaces 'fractional' library)
class Fraction {
  constructor(numerator, denominator = 1) {
    if (numerator == null) {
      // undefined or null
      this.numerator = 0;
      this.denominator = 1;
      return;
    }

    if (typeof numerator === 'string' && numerator.includes('/')) {
      const parts = numerator.split('/');
      if (parts.length !== 2) {
        this.numerator = 0;
        this.denominator = 1;
      } else {
        const [num, den] = parts.map(Number);
        this.numerator = num;
        this.denominator = den;
      }
    } else if (typeof numerator === 'number') {
      const precision = 1e6;
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);
      const den = precision;
      const num = Math.round(numerator * den);
      const div = gcd(num, den);
      this.numerator = num / div;
      this.denominator = den / div;
    } else {
      this.numerator = numerator;
      this.denominator = denominator;
    }
  }

  toString() {
    if (this.denominator === 1) return `${this.numerator}`;
    if (this.numerator > this.denominator) {
      const whole = Math.floor(this.numerator / this.denominator);
      const remainder = this.numerator % this.denominator;
      return remainder === 0
        ? `${whole}`
        : `${whole} ${remainder}/${this.denominator}`;
    }
    return `${this.numerator}/${this.denominator}`;
  }
}
class RecipeView extends View {
  _parentElement = document.querySelector('.recipe');
  _errorMessage = `We couldn't find that recipe. Please try another one!`;
  _message = '';

  addHandlerRender(handler) {
    ['hashchange', 'load'].forEach(e => {
      window.addEventListener(e, handler);
    });
  }

addHandlerUpdateServings(handler) {
  this._parentElement.addEventListener('click', function (e) {
    const btn = e.target.closest('.btn--update-servings');
    if (!btn) return;

    const updateTo = +btn.dataset.updateTo;
    if (updateTo > 0) handler(updateTo);
  });
}


_generateMarkup() {
  return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${this._data.title}" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${this._data.cookingTime}</span>
        <span class="recipe__info-text">minutes</span>
      </div>

      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${this._data.servings}</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings - 1}">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${this._data.servings + 1}">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
      </div>

      <div class="recipe__user-generated">
      </div>

      <button class="btn--round">
        <svg class="">
          <use href="${icons}#icon-bookmark-fill"></use>
        </svg>
      </button>
    </div>

    <div class="recipe__ingredients">
      <h2 class="heading--2">Recipe ingredients</h2>
      <ul class="recipe__ingredient-list">
        ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
      </ul>
    </div>

    <div class="recipe__directions">
      <h2 class="heading--2">How to cook it</h2>
      <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__publisher">${this._data.publisher}</span>.
        Please check out directions at their website.
      </p>
      <a class="btn--small recipe__btn" href="${this._data.sourceUrl}" target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-right"></use>
        </svg>
      </a>
    </div>
  `;
}


  _generateMarkupIngredient(ing) {
    return `
              <li class="recipe__ingredient">
                <svg class="recipe__icon">
                  <use href="${icons}#icon-check"></use>
                </svg>
                <div class="recipe__quantity">${new Fraction(
                  ing.quantity
                ).toString()}</div>
                <div class="recipe__description">
                  <span class="recipe__unit">${ing.unit}</span>
                  ${ing.description}
                </div>
              </li>         
            `;
  }
}

export default new RecipeView();
