const yearAndBooksTemplate = (year, books = []) => {
	return `	<section>
					<h2 class="year-title">🔖 ${year}</h2>
                    ${books
											.map(book => {
												return `		<ul class="book-info">
						<li>
							<strong>Title:</strong> ${book["Title"]}
						</li>
						<li><strong>Author:</strong> ${book["Author"]}</li>
						<li><strong>No of Pages:</strong> ${book["No of Pages"]}</li>
					</ul>`
											})
											.join("")}
			
				</section>`
}
