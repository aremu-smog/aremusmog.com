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
			visitorsNameDisplay.innerText = formatUsername(visitorsInput.value)
			localStorage.setItem("visitorsName", formatUsername(visitorsInput.value))
			hideVisitor()
		} else {
			alert("The input field is empty, you can press `S` to skip")
		}
	}

	if (key === "s" || key === "S") {
		hideVisitor()
	}
})

window.addEventListener("load", async () => {
	if (localStorage.getItem("visitorsName")) {
		await hideVisitor()
		visitorsNameDisplay.innerText = formatUsername(
			localStorage.getItem("visitorsName")
		)
	}
})

const hideVisitor = () => {
	visitor.style.display = "none"
}

const formatUsername = name => {
	const nameArray = name.split(" ")
	const capitalizedNames = nameArray.map(name_item => {
		const firstLetter = name_item[0].toUpperCase()
		const otherLetters = name_item.slice(1, name_item.length).toLowerCase()
		return firstLetter + otherLetters
	})

	return capitalizedNames.join(" ")
}
