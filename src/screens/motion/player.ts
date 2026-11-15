// The motion page's video player. Each [data-player] wraps a <video> without
// native controls; its state is mirrored to data attributes for the CSS

type IOSVideo = HTMLVideoElement & { webkitEnterFullscreen?: () => void }

const formatTime = (seconds: number) => {
	const whole = Math.floor(seconds)
	return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`
}

export function setUpPlayers() {
	const players = [...document.querySelectorAll<HTMLElement>("[data-player]")]
	const videos = players.map((player) => player.querySelector("video") as IOSVideo)

	players.forEach((player, index) => {
		const video = videos[index]
		const seek = player.querySelector<HTMLInputElement>("[data-seek]")!
		const time = player.querySelector<HTMLElement>("[data-time]")!
		const playButton = player.querySelector<HTMLElement>(".player__bar [data-toggle]")!
		const muteButton = player.querySelector<HTMLElement>("[data-mute]")
		let frame = 0

		const render = () => {
			const progress = video.duration ? video.currentTime / video.duration : 0
			player.style.setProperty("--progress", String(progress))
			seek.value = String(Math.round(progress * 1000))
			time.textContent = video.duration
				? `${formatTime(video.currentTime)} / ${formatTime(video.duration)}`
				: formatTime(video.currentTime)
		}

		// timeupdate only fires about four times a second, so the bar follows
		// animation frames while playing
		const tick = () => {
			render()
			frame = requestAnimationFrame(tick)
		}

		const toggle = () => (video.paused ? video.play() : video.pause())
		player.querySelectorAll("[data-toggle]").forEach((button) => {
			button.addEventListener("click", toggle)
		})
		video.addEventListener("click", toggle)

		video.addEventListener("play", () => {
			// One piece at a time
			videos.forEach((other) => other !== video && other.pause())
			player.dataset.state = "playing"
			player.dataset.started = ""
			playButton.setAttribute("aria-label", "Pause")
			frame = requestAnimationFrame(tick)
		})
		video.addEventListener("pause", () => {
			player.dataset.state = "paused"
			playButton.setAttribute("aria-label", "Play")
			cancelAnimationFrame(frame)
			render()
		})
		video.addEventListener("loadedmetadata", render)

		seek.addEventListener("input", () => {
			if (!video.duration) return
			video.currentTime = (Number(seek.value) / 1000) * video.duration
			render()
		})

		if (muteButton) {
			muteButton.addEventListener("click", () => (video.muted = !video.muted))
			video.addEventListener("volumechange", () => {
				player.toggleAttribute("data-muted", video.muted)
				muteButton.setAttribute("aria-label", video.muted ? "Unmute" : "Mute")
			})
		}

		player.querySelector("[data-fullscreen]")!.addEventListener("click", () => {
			if (document.fullscreenElement) document.exitFullscreen()
			else if (player.requestFullscreen) player.requestFullscreen()
			// iPhone Safari only lets the video itself go full screen
			else video.webkitEnterFullscreen?.()
		})
	})
}
