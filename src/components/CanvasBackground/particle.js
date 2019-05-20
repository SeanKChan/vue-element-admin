class Particle {
  constructor(particleRadius = 5, colors = [
    { r: 117, g: 125, b: 175 },
    { r: 68, g: 73, b: 102 },
    { r: 248, g: 172, b: 19 }
  ], ctx) {
    this.x = Math.random() * window.innerWidth
    this.y = Math.random() * window.innerHeight
    this.vx = -1 + Math.random()
    this.vy = -1 + Math.random()
    this.radius = particleRadius
    const color = colors[Math.floor(Math.random() * colors.length)]
    this.color = {
      r: color.r,
      g: color.g,
      b: color.b
    }
    this.blur = Math.floor(-7 * Math.random() + 9) / 10
    this.ctx = ctx
  }

  draw() {
    this.ctx.fillStyle = 'white'
    this.ctx.beginPath()
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * this.radius, !1)
    const { r, g, b } = this.color
    this.ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    this.ctx.fill()
  }
}

export default Particle
