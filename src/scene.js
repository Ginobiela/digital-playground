import * as THREE from 'three'

export function startScene(host) {
  const mobile = matchMedia('(max-width: 700px)').matches
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  let renderer
  try {
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  } catch { return }
  host.append(renderer.domElement)
  const toggle = document.createElement('button')
  toggle.className = 'motion-toggle'
  let animate = !reduced.matches
  function updateToggle() {
    toggle.textContent = animate ? 'Pausar rotor' : 'Animar rotor'
    toggle.setAttribute('aria-pressed', String(animate))
  }
  updateToggle()
  host.after(toggle)
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.4 : 1.8))
  const scene = new THREE.Scene()
  const camera = new THREE.OrthographicCamera()
  camera.position.set(5, 4, 8)
  camera.lookAt(0, 0, 0)
  const rotor = new THREE.Group()
  scene.add(rotor)
  rotor.rotation.z = -.38
  const segments = mobile ? 48 : 96
  const steel = new THREE.MeshStandardMaterial({ color: 0x8eabae, metalness: .48, roughness: .3 })
  const dark = new THREE.MeshStandardMaterial({ color: 0x34484c, metalness: .45, roughness: .34 })
  const cyan = new THREE.MeshStandardMaterial({ color: 0x7be3d8, metalness: .25, roughness: .24 })
  function piece(geometry, material, y) {
    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.y = y
    rotor.add(mesh)
    return mesh
  }
  function washer(radius, hole, depth, y, material) {
    const outline = new THREE.Shape()
    outline.absarc(0, 0, radius, 0, Math.PI * 2, false)
    const cut = new THREE.Path()
    cut.absarc(0, 0, hole, 0, Math.PI * 2, true)
    outline.holes.push(cut)
    const geometry = new THREE.ExtrudeGeometry(outline, {depth, bevelSize: .025, bevelThickness: .025, bevelSegments: 2, curveSegments: segments / 2})
    geometry.rotateX(-Math.PI / 2)
    piece(geometry, material, y)
  }
  washer(1.48, .99, .19, -1.35, steel)
  washer(1.34, .98, .10, -1.03, dark)
  washer(1.59, 1.39, .07, -.36, cyan)
  washer(1.15, .68, .24, .35, steel)
  washer(.91, .65, .09, .78, dark)
  washer(.82, .62, .06, 1.30, cyan)
  piece(new THREE.CylinderGeometry(.23, .23, 1.7, 12), dark, -.17)
  piece(new THREE.OctahedronGeometry(.4), cyan, 1.04)
  const tooth = new THREE.BoxGeometry(.12, .24, .25)
  const count = mobile ? 20 : 36
  for (let i = 0; i < count; i++) {
    const angle = i * Math.PI * 2 / count
    const mesh = piece(tooth, dark, -1.22)
    mesh.position.x = 1.47 * Math.sin(angle)
    mesh.position.z = 1.47 * Math.cos(angle)
    mesh.rotation.y = angle
  }
  const pin = new THREE.CylinderGeometry(.067, .067, .48, 8)
  for (let i = 0; i < 6; i++) {
    const mesh = piece(pin, steel, -.73)
    mesh.position.x = 1.18 * Math.cos(i * Math.PI / 3)
    mesh.position.z = 1.18 * Math.sin(i * Math.PI / 3)
  }
  scene.add(new THREE.HemisphereLight(0xffffff, 0x546b72, 2))
  for (const [x, y, z, color, power] of [[-4, 6, 4, 0xffffff, 3], [3, 2, -2, 0x87ede4, 3]]) {
    const light = new THREE.DirectionalLight(color, power)
    light.position.set(x, y, z)
    scene.add(light)
  }
  let tilt = 0, frame = 0, last = 0
  function draw(now) {
    frame = 0
    if (document.hidden || renderer.getContext().isContextLost()) return
    if (animate) {
      rotor.rotation.y += Math.min((now - last) / 1000, .05) * .16
      rotor.rotation.x += (tilt - rotor.rotation.x) * .05
      frame = requestAnimationFrame(draw)
    }
    last = now
    renderer.render(scene, camera)
  }
  function refresh() {
    cancelAnimationFrame(frame)
    draw(performance.now())
  }
  new ResizeObserver(() => {
    const { width, height } = host.getBoundingClientRect()
    const half = Math.max(1.95, 1.95 * height / width)
    const wide = half * width / height
    Object.assign(camera, {left: -wide, right: wide, top: half, bottom: -half})
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    refresh()
  }).observe(host)
  host.addEventListener('pointermove', event => {
    if (event.pointerType === 'mouse') tilt = (event.offsetY / host.clientHeight - .5) * .2
  })
  host.addEventListener('pointerleave', () => { tilt = 0 })
  document.addEventListener('visibilitychange', refresh)
  toggle.addEventListener('click', () => {
    animate = !animate
    updateToggle()
    refresh()
  })
  reduced.addEventListener('change', () => {
    animate = !reduced.matches
    updateToggle()
    refresh()
  })
  renderer.domElement.addEventListener('webglcontextrestored', refresh)
}
