resize_canvas(1000, 1000)

const add = (p1, p2) => {
    return {'x': p1.x + p2.x, 'y': p1.y + p2.y, 'z': p1.z + p2.z}
}

const subtract = (p1, p2) => {
    return {'x': p1.x - p2.x, 'y': p1.y - p2.y, 'z': p1.z - p2.z}
}

const multiply = (p, f) => {
    return {'x': p.x * f, 'y': p.y * f, 'z': p.z * f}
}

const dot = (p1, p2) => {
    return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z
}

const point = (x, y, z) => {
    return {'x': x, 'y': y, 'z': z}
}

const zero = () => point(0.0, 0.0, 0.0)

const length = (p) => {
    return Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)
}

const unit = (p) => multiply(p, 1.0 / length(p))

const sphere_sdf = (p, center, radius) => {
    return length(subtract(p, center)) - radius
}

const closest_object = (p) =>  {
    const sphere_0 = sphere_sdf(p, point(0.0, 0.0, -1), 1)
    const displacement = Math.sin(7.0 * p.x) * Math.sin(7.0 * p.y) * Math.sin(7.0 * p.z) * 0.25
    return sphere_0 + displacement
}

const DELTA_X = point(0.001, 0.0, 0.0)
const DELTA_Y = point(0.0, 0.001, 0.0)
const DELTA_Z = point(0.0, 0.0, 0.001)

const calculate_normal = (p) => {
    const gradient_x = closest_object(add(p, DELTA_X)) - closest_object(subtract(p, DELTA_X))
    const gradient_y = closest_object(add(p, DELTA_Y)) - closest_object(subtract(p, DELTA_Y))
    const gradient_z = closest_object(add(p, DELTA_Z)) - closest_object(subtract(p, DELTA_Z))
    return unit(point(gradient_x, gradient_y, gradient_z))
}

const ray_march = (origin, direction) => {
    const NUMBER_OF_STEPS = 32;
    const MINIMUM_HIT_DISTANCE = 0.0001
    const MAXIMUM_TRACE_DISTANCE = 1000.0
    
    let total_distance_traveled = 0.0

    for (let i = 0; i < NUMBER_OF_STEPS; i++) {
        const current_position = add(origin, multiply(direction, total_distance_traveled))
        let distance_to_closest = closest_object(current_position)

        if (distance_to_closest < MINIMUM_HIT_DISTANCE) {
            const normal = calculate_normal(current_position)
            const light_position = point(2.0, 5.0, 5.0)
            const direction_to_light = unit(subtract(light_position, current_position))
            const diffuse_intensity = Math.max(0.0, dot(normal, direction_to_light))
            const color = point(1.0, 0.7, 0.3)
            return multiply(color, diffuse_intensity)
        }

        if (total_distance_traveled > MAXIMUM_TRACE_DISTANCE) {
            break
        }

        total_distance_traveled += distance_to_closest
    }

    return zero()
}

const lin_map = (x, a, b, c, d) => {
    return (x - a) * (d - c) / (b - a) + c
}

const render_scene = () => {
    const camera = point(0, 0, 1)
    return create_matrix(HEIGHT, WIDTH, (y, x) => {
        const py = lin_map(y, 0, HEIGHT, 1, -1)
        const px = lin_map(x, 0, WIDTH, -1, 1)
        const pixel = point(px, py, 0.0)
        const direction = unit(subtract(pixel, camera))
        return ray_march(camera, direction) 
    })
}

const draw_image = (image) => {
    const height = rows(image)
    const width = columns(image)

    var id = ctx.getImageData(0, 0, height, width)
    var pixels = id.data

    for (var i = 0; i < height; i++) {
        for (var j = 0; j < width; j++) {
            var r = image[i][j].x * 255
            var g = image[i][j].y * 255
            var b = image[i][j].z * 255
            var off = (i * id.width + j) * 4
            pixels[off] = r
            pixels[off + 1] = g
            pixels[off + 2] = b
            pixels[off + 3] = 255
        }
    }

    ctx.putImageData(id, 0, 0);
}

clear_canvas()
draw_image(render_scene())