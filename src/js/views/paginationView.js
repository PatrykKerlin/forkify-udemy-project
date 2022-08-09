import View from './View.js';
import icons from 'url:../../img/icons.svg';

class PaginationView extends View {
	_parentElement = document.querySelector(`.pagination`);

	_generateMarkup() {
		const currentPage = this._data.page;
		const numPages = Math.ceil(
			this._data.results.length / this._data.resultsPerPage
		);
		// First page of many
		if (currentPage === 1 && numPages > 1) {
			return this._generateButtonMarkup(currentPage, `next`);
		}
		// Last page of many
		if (currentPage > 1 && currentPage === numPages) {
			return this._generateButtonMarkup(currentPage, `prev`);
		}
		// Middle page of many
		if (currentPage > 1 && currentPage < numPages) {
			return [
				this._generateButtonMarkup(currentPage, `next`),
				this._generateButtonMarkup(currentPage, `prev`),
			].join(``);
		}
		// First and only page
		return ``;
	}

	_generateButtonMarkup(page, direction) {
		return `
            ${
				direction === `next`
					? `
                <button data-goto="${
					page + 1
				}" class="btn--inline pagination__btn--${direction}">
                    <span>Page ${page + 1}</span>
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-right"></use>
                    </svg>
                `
					: `
                <button data-goto="${
					page - 1
				}" class="btn--inline pagination__btn--${direction}">
                    <svg class="search__icon">
                        <use href="${icons}#icon-arrow-left"></use>
                    </svg>
                    <span>Page ${page - 1}</span>
            `
			}                    
            </button>
        `;
	}

	addHandlerClick(handler) {
		this._parentElement.addEventListener(`click`, function (event) {
			const button = event.target.closest(`.btn--inline`);
			if (!button) return;
			const goToPage = Number(button.dataset.goto);
			handler(goToPage);
		});
	}
}

export default new PaginationView();
