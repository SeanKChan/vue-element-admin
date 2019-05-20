<template>
  <canvas id="space" width="100%" height="100%" />
</template>
<script>
import Particle from './particle'

export default {
  name: 'CanvasBackground',
  data() {
    return {
      elCanvas: null,
      ctx: null,
      backgroundColor: 'rgba(2,33,62,1)',
      particleCount: 20,
      particles: [],
      particleRadius: 5,
      minDist: 100,
      velocity: 1,
      colors: [
        { r: 117, g: 125, b: 175 },
        { r: 68, g: 73, b: 102 },
        { r: 248, g: 172, b: 19 }
      ]
    }
  },
  mounted() {
    this.init()
    window.onresize = () => {
      this.elCanvas.width = window.innerWidth
      this.elCanvas.height = window.innerHeight
    }
  },
  destroyed() {
    window.removeEventListener('resize', () => {
      this.elCanvas.width = window.innerWidth
      this.elCanvas.height = window.innerHeight
    })
  },
  methods: {
    init() {
      this.elCanvas = document.querySelector('#space')
      this.elCanvas.width = window.innerWidth
      this.elCanvas.height = window.innerHeight

      this.ctx = this.elCanvas.getContext('2d')
      const { particleRadius, colors, ctx } = this

      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push(new Particle(particleRadius, colors, ctx))
      }

      this.particlesAnimationLoop()
    },
    // 粒子绘制
    particlesDraw() {
      this.ctx.fillStyle = this.backgroundColor
      this.ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)
      for (let i = 0; i < this.particles.length; i++) {
        const p = this.particles[i]
        p.draw()
      }
      this.particlesUpdate()
    },

    // 粒子运动
    particlesUpdate() {
      for (let i = 0; i < this.particles.length; i++) {
        const p1 = this.particles[i]
        p1.x += p1.vx
        p1.y += p1.vy
        p1.x > window.innerWidth + p1.radius
          ? (p1.x = p1.radius)
          : p1.x < 0 - p1.radius && (p1.x = window.innerWidth - p1.radius)
        p1.y > window.innerHeight + p1.radius
          ? (p1.y = p1.radius)
          : p1.y < 0 - p1.radius && (p1.y = window.innerHeight - p1.radius)
        for (let j = i + 1; j < this.particles.length; j++) {
          const p2 = this.particles[j]
          this.calcDistance(p1, p2)
        }
      }
    },

    // 计算相邻粒子间距
    calcDistance(p1, p2) {
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (this.minDist >= dist) {
        if (JSON.stringify(p1.color) !== JSON.stringify(p2.color)) {
          this.ctx.beginPath()
          const gradient = this.ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
          const { r: r1, g: g1, b: b1 } = p1.color
          const { r: r2, g: g2, b: b2 } = p2.color

          gradient.addColorStop(0, `rgb(${r1},${g1},${b1})`)
          gradient.addColorStop(1.0, `rgb(${r2},${g2},${b2})`)
          this.ctx.strokeStyle = gradient
          this.ctx.moveTo(p1.x, p1.y)
          this.ctx.lineTo(p2.x, p2.y)
          this.ctx.lineWidth = 2
          this.ctx.stroke()
          this.ctx.closePath()
        }
        const ax = dx / (1e3 * this.velocity)
        const ay = dy / (1e3 * this.velocity)
        p1.vx -= ax
        p1.vy -= ay
        p2.vx += ax
        p2.vy += ay
      }
    },

    particlesAnimationLoop() {
      this.particlesDraw()
      window.requestAnimationFrame(this.particlesAnimationLoop)
    }
  }
}
</script>

<style scoped>
#space {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
}
</style>
