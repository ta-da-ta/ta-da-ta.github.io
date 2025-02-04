resize_canvas(1200, 1200)

const speed_slider = document.getElementById("speed")
const speed_placeholder = document.getElementById("speed_placeholder")

const circles = []
for (var i=150; i<=HEIGHT - 150; i+=50) {
    for (var j=150; j<=WIDTH - 150; j+=50) {
        circles.push({
            'x': i,
            'y': j,
            'radius': 5
        })
    }
}

speed_slider.oninput = function() {
    speed = parseInt(this.value) / 10
    speed_placeholder.innerText = speed * 10
}

let speed = 0.1

const update = () => {
    clear_canvas()
    circles.forEach(c => draw_circle(c.x, c.y, c.radius, 'white'))
    circles.forEach(c => c.radius += speed)
    requestAnimationFrame(update)
}

update()