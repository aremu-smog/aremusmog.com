// Interactive point-cloud portrait for the home page header.
// Progressive enhancement: the static <img> stays visible until the model has
// loaded and rendered, and remains as the fallback if WebGL or the network fails.
import {
	BufferAttribute,
	BufferGeometry,
	Group,
	PerspectiveCamera,
	Points,
	Scene,
	ShaderMaterial,
	WebGLRenderer,
} from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.min.js"

const container = document.querySelector("[data-portrait-3d]")

// Packed point cloud: N little-endian int16 XYZ triplets normalised to [-1, 1],
// followed by N uint8 brightness values (relief lighting baked in offline).
const MODEL_URL = "/assets/model/aremu-points-v1.bin"
const BYTES_PER_POINT = 7

// How far the portrait may be turned, in radians. The cloud is a relief
// (no back side), so it is never allowed to spin all the way round.
const MAX_YAW = 0.75
const MAX_PITCH = 0.35
const DRAG_SPEED = 0.012
const EASE = 0.08

async function init() {
	if (!container) return

	const response = await fetch(MODEL_URL)
	if (!response.ok) throw new Error(`Failed to load ${MODEL_URL}`)
	const buffer = await response.arrayBuffer()
	const count = buffer.byteLength / BYTES_PER_POINT
	if (!Number.isInteger(count)) throw new Error("Unexpected point data size")

	const geometry = new BufferGeometry()
	geometry.setAttribute(
		"position",
		new BufferAttribute(new Int16Array(buffer, 0, count * 3), 3, true),
	)
	geometry.setAttribute(
		"shade",
		new BufferAttribute(new Uint8Array(buffer, count * 6, count), 1, true),
	)

	const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
	const material = new ShaderMaterial({
		uniforms: { pointSize: { value: 1.25 * pixelRatio } },
		vertexShader: `
			attribute float shade;
			uniform float pointSize;
			varying float vShade;
			void main() {
				vShade = shade;
				gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				gl_PointSize = pointSize;
			}
		`,
		fragmentShader: `
			varying float vShade;
			void main() {
				vec2 c = gl_PointCoord - 0.5;
				if (dot(c, c) > 0.25) discard;
				gl_FragColor = vec4(vec3(0.96 * vShade), 1.0);
			}
		`,
	})

	const pivot = new Group()
	pivot.add(new Points(geometry, material))

	const scene = new Scene()
	scene.add(pivot)

	const camera = new PerspectiveCamera(30, 1, 0.1, 20)
	camera.position.set(0, 0, 4.1)

	const renderer = new WebGLRenderer({ antialias: false, alpha: true })
	renderer.setClearColor(0x000000, 0)
	renderer.setPixelRatio(pixelRatio)

	const canvas = renderer.domElement
	canvas.className = "header__model-canvas"
	canvas.setAttribute("aria-hidden", "true")
	container.appendChild(canvas)

	const resize = () => {
		const { width, height } = container.getBoundingClientRect()
		renderer.setSize(width, height, false)
		camera.aspect = width / height
		camera.updateProjectionMatrix()
	}
	resize()
	new ResizeObserver(resize).observe(container)

	// --- Interaction: drag to turn, eases back into a gentle idle sway. ---
	const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
	const clamp = (v, max) => Math.max(-max, Math.min(max, v))
	let targetYaw = 0
	let targetPitch = 0
	let dragging = null
	let lastInteraction = -Infinity

	canvas.addEventListener("pointerdown", (event) => {
		dragging = { id: event.pointerId, x: event.clientX, y: event.clientY }
		canvas.setPointerCapture(event.pointerId)
		container.classList.add("is-dragging")
	})
	canvas.addEventListener("pointermove", (event) => {
		if (!dragging || dragging.id !== event.pointerId) return
		targetYaw = clamp(targetYaw + (event.clientX - dragging.x) * DRAG_SPEED, MAX_YAW)
		targetPitch = clamp(targetPitch + (event.clientY - dragging.y) * DRAG_SPEED, MAX_PITCH)
		dragging.x = event.clientX
		dragging.y = event.clientY
		lastInteraction = performance.now()
	})
	const endDrag = (event) => {
		if (!dragging || dragging.id !== event.pointerId) return
		dragging = null
		lastInteraction = performance.now()
		container.classList.remove("is-dragging")
	}
	canvas.addEventListener("pointerup", endDrag)
	canvas.addEventListener("pointercancel", endDrag)

	// Only render while the header is on screen.
	let visible = true
	new IntersectionObserver(([entry]) => {
		visible = entry.isIntersecting
		renderer.setAnimationLoop(visible ? frame : null)
	}).observe(container)

	let shown = false
	function frame(time) {
		const idle = !dragging && time - lastInteraction > 2500
		if (idle) {
			const sway = reduceMotion.matches ? 0 : 1
			targetYaw = Math.sin(time / 2600) * 0.32 * sway
			targetPitch = Math.sin(time / 3700) * 0.06 * sway
		}
		pivot.rotation.y += (targetYaw - pivot.rotation.y) * EASE
		pivot.rotation.x += (targetPitch - pivot.rotation.x) * EASE
		renderer.render(scene, camera)

		if (!shown) {
			shown = true
			container.classList.add("is-ready")
		}
	}
	renderer.setAnimationLoop(visible ? frame : null)
}

init().catch((error) => {
	// Leave the static image in place.
	console.warn("3D portrait unavailable:", error)
})
