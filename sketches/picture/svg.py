import numpy as np
from svgpathtools import svg2paths, Path

def points_from_path(path: Path, number: int, scale: float, dx: float, dy: float) -> list[tuple[float, float]]:
    p = [path.point(i) for i in np.linspace(0, 1, number)]
    return [(dx + scale * np.real(z), dy + scale * np.imag(z)) for z in p]

def print_str(points: list[tuple[float, float]]):
    for p in points:
        print(f"create_point({p[0]}, {p[1]}),")

def bounding_box(paths: list[Path]) -> tuple[float, float, float, float]:
    xmin, xmax, ymin, ymax = np.inf, -np.inf, np.inf, -np.inf
    for path in paths:
        xmin2, xmax2, ymin2, ymax2 = path.bbox()
        xmin = min(xmin, xmin2)
        xmax = max(xmax, xmax2)
        ymin = min(ymin, ymin2)
        ymax = max(ymax, ymax2)
    return xmin, xmax, ymin, ymax

def offset_to_center_in_frame(paths: list[Path], scale: float, width: float, height: float) -> tuple[float, float]:
    xmin, xmax, ymin, ymax = bounding_box(paths)
    dx = scale * (xmax - xmin) / 2
    dy = scale * (ymax - ymin) / 2
    return (width / 2 - dx, height / 2 - dy)

paths, _ = svg2paths("google.svg")
scale = 1
offset = offset_to_center_in_frame(paths, scale, 1000, 1000)

points = [
    point
    for path in paths
    for point in points_from_path(path, int(path.length()) // 8, scale, offset[0], offset[1])
]
print_str(points)
print(len(points))