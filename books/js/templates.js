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
 * @returns
 */
const yearAndBooksTemplate = (year, books = []) => {
	return `	<section>
					<h2 class="year-title">🔖 ${year}</h2>
                    ${books
											.map(book => {
												return `		<ul class="book-info">
						<li>
							<strong>Title:</strong> ${book["Title"]}
						</li>
						<li><span><strong>Author:</strong> ${book["Author"]}</span>
						<span><strong>pages:</strong> ${book["No of Pages"]}</span></li>
					</ul>`
											})
											.join("")}
			
				</section>`
}
