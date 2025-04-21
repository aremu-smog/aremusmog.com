const totalBookSpan = document.querySelector("#total_no_of_books")
const totalNoOfPagesSpan = document.querySelector("#total_no_of_pages")
const mostRecentYearSpan = document.querySelector("#most_recent_year")
const booksListSection = document.querySelector("#books_list")

const updateInnerHTML = (domElement, content) => {
	if (domElement) {
		domElement.innerHTML = content
	} else {
		console.warn("No DOM element")
	}
}

document.addEventListener("DOMContentLoaded", () => {
	updateInnerHTML(totalBookSpan, bookStats.totalNoOfBooks)
	updateInnerHTML(totalNoOfPagesSpan, bookStats.totalNoPages.toLocaleString())
	updateInnerHTML(mostRecentYearSpan, mostRecentYear)
	updateInnerHTML(booksListSection, booksMarkup.join(""))
})
