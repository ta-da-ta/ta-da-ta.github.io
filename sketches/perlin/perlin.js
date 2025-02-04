resize_canvas(1600, 800)

const magnitude = (x, y) => Math.sqrt(x * x + y * y)

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x
        this.y = y
        this.vx = vx
        this.vy = vy
        this.ax = 0
        this.ay = 0
        this.px = x
        this.py = y
        this.color = color
    }

    update_previous() {
        this.px = this.x
        this.py = this.y
    }

    update() {
        this.update_previous()

        this.x += this.vx
        this.y += this.vy

        this.vx += this.ax
        this.vy += this.ay
        const l = magnitude(this.vx, this.vy)
        if (l > 4) {
            this.vx *= 4 / l
            this.vy *= 4 / l
        }
        
        this.ax = 0
        this.ay = 0
    }

    edges() {
        if (this.x < 0) {
            this.x = WIDTH
            this.update_previous()
        }
        if (this.x > WIDTH) {
            this.x = 0
            this.update_previous()
        }
        if (this.y < 0) {
            this.y = HEIGHT
            this.update_previous()
        }
        if (this.y > HEIGHT) {
            this.y = 0
            this.update_previous()
        }
    }

    draw() {
        draw_line(this.x, this.y, this.px, this.py, this.color)
    }

    apply_force(ax, ay) {
        this.ax += ax
        this.ay += ay
        const l = magnitude(this.ax, this.ay)
        if (l > 0.2) {
            this.ax *= 0.2 / l
            this.ay *= 0.2 / l
        }
    }

    follow(vectors) {
        const i = Math.floor(this.y / noise_height)
        const j = Math.floor(this.x / noise_width)
        const vector = vectors[i][j]
        this.apply_force(vector[0], vector[1])
    }
}

const random_particle = () => new Particle(
    Math.random() * WIDTH,
    Math.random() * HEIGHT,
    Math.random() - 0.5,
    Math.random() - 0.5,
    rgba(56, 26, 0, 0.1)
)

const scale = 10
const noise = new perlinNoise3d();
const noise_height = Math.floor(HEIGHT / scale)
const noise_width = Math.floor(WIDTH / scale)
const perlin = create_matrix(noise_height, noise_width, () => [0, 0])

const particles_count = 1000
const particles = Array.from(Array(particles_count), random_particle)

let z = 0

const update = () => {
    for (var i=0; i<noise_height; i++) {
        for (var j=0; j<noise_width; j++) {
            const r = noise.get(i * 0.1, j * 0.1, z)
            const angle = 2 * Math.PI * r
            perlin[i][j] = [Math.cos(angle), Math.sin(angle)]
        }
    }

    for (let p of particles) {
        p.follow(perlin)
        p.update()
        p.edges()
        p.draw()
    }

    z += 0.01
    requestAnimationFrame(update)
}

update()