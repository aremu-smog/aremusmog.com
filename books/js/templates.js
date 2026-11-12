/**
 * Represents a book entry.
 *
 * @typedef {Object} Book
 * @property {string} Title - The title of the book.
 * @property {string} Status - The reading status of the book.
 * @property {number} No_of_Pages - Total number of pages in the book.
 * @property {string} Author - The author of the book.
 */

/**
 *
 * @param {number} year
 * @param {Book[]} books
 * @param {boolean} isOpen - Whether the year starts expanded.
 * @returns
 */
const yearAndBooksTemplate = (year, books = [], isOpen = false) => {
	return `<details class="year" name="years"${isOpen ? " open" : ""}>
		<summary class="year__summary">
			<h2 class="year-title">${year}</h2>
			<span class="year__arrow" aria-hidden="true"></span>
		</summary>
		<ul class="book-list">
			${books
				.map(
					book => `<li class="book">
				<div>
					<p class="book__title">${book["Title"]}</p>
					<p class="book__author">${book["Author"]}</p>
				</div>
				<p class="book__pages">${book["No of Pages"]}<span>pp</span></p>
			</li>`
				)
				.join("")}
		</ul>
	</details>`
}
