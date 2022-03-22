const visitor = document.querySelector("#visitor")
const visitorsInput = document.querySelector("#visitors-name")
const visitorsNameDisplay = document.querySelector("#visitors-name-display")

document.addEventListener("keypress", e => {
	const key = e.key
	if (key === "Enter") {
		if (visitorsInput.value) {
			localStorage.setItem("visitorsName", visitorsInput.value)
		} else {
			alert("The input field is empty, you can press `S` to skip")
		}
	}

	if (key === "s" || key === "S") {
		localStorage.setItem("visitorsName", "there")
	}
})

window.addEventListener("load", () => {
	if (localStorage.getItem("visitorsName")) {
		visitor.style.display = "none"
		visitorsNameDisplay.innerText = localStorage.getItem("visitorsName")
	}
})
