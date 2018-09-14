import utils from './utils'

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const fov = 300

canvas.width = innerWidth
canvas.height = innerHeight

const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
}

const colors = ['#2185C5', '#7ECEFD', '#FFF6E5', '#FF7F66']

// Event Listeners
addEventListener('mousemove', event => {
    mouse.x = event.clientX
    mouse.y = event.clientY
})

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

// Particles
function Particle(x, y) {
    this.x = x
    this.y = y
    this.z = 10
    this.x3d = this.x
    this.y3d = this.y
    this.scale = 10
    this.speed_z = 0.5

    this.draw = () => {
        // c.beginPath()
        // c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        // c.fillStyle = this.color
        // c.fill()
        // c.closePath()
        c.fillStyle = 'red';
        c.ellipse(this.x3d, this.y3d, this.scale, this.scale, 0, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
    }

    this.update = () => {
        // calculate new position
        this.z -= this.speed_z;
        this.scale = fov / (this.z + fov);
        this.x3d = this.x3d * this.scale;
        this.y3d = this.y3d * this.scale;

        // remove elements that are off the screen
        if (this.z < -fov) {
            particles.splice(0, 1);
        }

        // draw new position
        this.draw()
    }
}

// Implementation
let particles
function init() {
    particles = []

    for (let i = 0; i < 1; i++) {
        let x = (canvas.width / 2) + utils.randomIntFromRange(-20, 20)
        let y = (canvas.height / 2) + utils.randomIntFromRange(-20, 20)
        particles.push(new Particle(x, y));
    }

    console.log(particles);
}

// Animation Loop
function animate() {
    requestAnimationFrame(animate)
    c.clearRect(0, 0, canvas.width, canvas.height)

    // Center point
    c.fillStyle = 'blue'
    c.ellipse(canvas.width / 2, canvas.height / 2, 2, 2, 0, 0, Math.PI * 2, false)
    c.fill()
    c.beginPath()

    particles.forEach(particle => {
        particle.update()
    })
}

init()
animate()
