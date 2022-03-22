const visitor = document.querySelector("#visitor")
const visitorsInput = document.querySelector("#visitors-name")
const visitorsNameDisplay = document.querySelector("#visitors-name-display")

visitorsInput.addEventListener("keypress", e => {
	const key = e.key
	if (key !== "Enter") {
		e.stopPropagation()
	}
})

document.addEventListener("keypress", e => {
	const key = e.key
	if (key === "Enter") {
		if (visitorsInput.value) {
			localStorage.setItem("visitorsName", visitorsInput.value)
			hideVisitor()
		} else {
			alert("The input field is empty, you can press `S` to skip")
		}
	}

	if (key === "s" || key === "S") {
		localStorage.setItem("visitorsName", "there")
		hideVisitor()
	}
})

window.addEventListener("load", async () => {
	if (localStorage.getItem("visitorsName")) {
		await hideVisitor()
		visitorsNameDisplay.innerText = localStorage.getItem("visitorsName")
	}
})

const hideVisitor = () => {
	visitor.style.display = "none"
}
