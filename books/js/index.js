const totalBookSpan = document.querySelector("#total_no_of_books")
const totalNoOfPagesSpan = document.querySelector("#total_no_of_pages")
const booksListSection = document.querySelector("#books_list")

const updateInnerHTML = (domElement, content) => {
	if (domElement) {
		domElement.innerHTML = content
	} else {
		console.warn("No DOM element")
	}
}

// Stats are hidden for now; re-enable these with the stats section in books/index.html
document.addEventListener("DOMContentLoaded", () => {
	// updateInnerHTML(totalBookSpan, bookStats.totalNoOfBooks)
	// updateInnerHTML(totalNoOfPagesSpan, bookStats.totalNoPages.toLocaleString())
	updateInnerHTML(booksListSection, booksMarkup.join(""))
})
