class City {
    constructor(width, height, size, background_color, color, outline_weight) {
        this.w = width;
        this.h = height;
        this.size = size;
        this.b_color = background_color;
        this.color = color;
        this.outline = outline_weight;

        this.reset();
    }

    reset() {
        this.grid = [];
        for (let y = 0; y < this.size; y++) {
            this.grid.push([]);
            for (let x = 0; x < this.size; x++) {
                this.grid[y].push(false);
            }
        }
    }


    draw(city_x, city_y, mirrored) {
        let xShift;
        if (mirrored) {
            xShift = this.size - 1;
        } else {
            xShift = 0;
        }
        push();
        strokeWeight(0);
        rectMode(CORNER);
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][Math.abs(x - xShift)]) {
                    fill(this.color);
                    rect(city_x + this.w * x + this.outline, city_y + this.h * y + this.outline, this.w - 2*this.outline, this.h - 2*this.outline);
                } else {
                    fill(this.b_color);
                    rect(city_x + this.w * x + this.outline, city_y + this.h * y + this.outline, this.w - 2*this.outline, this.h - 2*this.outline);
                }
            }
        }
        pop();
    }

    set_square(x, y, state) {
        this.grid[y][x] = state;
    }

    get_square(x, y) {
        return this.grid[y][x];
    }

    world_to_grid(x, y) {
        let grid_x = Math.floor(x / this.w);
        let grid_y = Math.floor(y / this.h);
        
        if (grid_x >= 0 && grid_x < this.size && grid_y >= 0 && grid_y < this.size) {
            return [grid_x, grid_y];
        }
        return null;
    }

    shift_grid(x, y) {
        if (x < 0) {
            x = -x;
            while (x > 0) {
                x -= 1;
                for (let y_index = 0; y_index < this.size; y_index++) {
                    let buffer = this.grid[y_index].shift();
                    this.grid[y_index].push(buffer);
                }
            }
        } else {
            while (x > 0) {
                x -= 1;
                for (let y_index = 0; y_index < this.size; y_index++) {
                    let buffer = this.grid[y_index].pop();
                    this.grid[y_index].unshift(buffer);
                }
            }
        }
        
        if (y < 0) {
            y = -y;
            while (y > 0) {
                y -= 1;
                let buffer = this.grid.shift();
                this.grid.push(buffer);
            }
        } else {
            while (y > 0) {
                y -= 1;
                let buffer = this.grid.pop();
                this.grid.unshift(buffer);
            }
        }
        
    }

    get_area() {
        let area = 0;
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x]) {
                    area++;
                }
            }
        }

        return area;
    }

    get_perimeter(beach) {
        let perimeter = 0;

        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x]) {
                    if (x+1 < this.size) {
                        if (this.grid[y][x+1] == false) {
                            perimeter++;
                        }
                    } else {
                        if (beach == false) {
                            perimeter++;
                        }
                    }
                    if (x > 0) {
                        if (this.grid[y][x-1] == false) {
                            perimeter++;
                        }
                    } else {
                            perimeter++;
                    }
                    if (y+1 < size) {
                        if (this.grid[y+1][x] == false) {
                            perimeter++;
                        }
                    } else {
                        perimeter++;
                    }
                    if (y > 0) {
                        if (this.grid[y-1][x] == false) {
                            perimeter++;
                        }
                    } else {
                        perimeter++;
                    }
                }
            }
        }

        return perimeter;
    }


    get_best_perimeter(beach) {
        if (!beach) {
            let area = this.get_area();
            let perimeter = ( 4 * Math.floor(Math.sqrt(area)) ) + 2 * Math.ceil((area - Math.floor(Math.sqrt(area))**2) / Math.floor(Math.sqrt(area)));
            if (!perimeter) perimeter = 0;
            return perimeter.toString();
        } else {
            return "Not Available";
        }
    }


    gravityDown() {
        // Loop through grid from bottom to up
        for (let y = this.size - 1; y >= 0; y--) {
            for (let x = 0; x < this.size; x++) {
                // If there is a block
                if (this.grid[y][x]) {
                    // Move it down until it reaches a block or the side of the grid
                    let y_index = y;
                    while (y_index < this.size - 1 && this.grid[y_index + 1][x] == false) {
                        y_index++;
                    }
                    this.grid[y][x] = false;
                    this.grid[y_index][x] = true;
                }
            }
        }
    }

    gravityUp() {
        // Loop through grid from bottom to up
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                // If there is a block
                if (this.grid[y][x]) {
                    // Move it down until it reaches a block or the side of the grid
                    let y_index = y;
                    while (y_index > 0 && this.grid[y_index - 1][x] == false) {
                        y_index--;
                    }
                    this.grid[y][x] = false;
                    this.grid[y_index][x] = true;
                }
            }
        }
    }

    gravityLeft() {
        // Loop through grid from bottom to up
        for (let x = 0; x < this.size; x++) {
            for (let y = 0; y < this.size; y++) {
                // If there is a block
                if (this.grid[y][x]) {
                    // Move it down until it reaches a block or the side of the grid
                    let x_index = x;
                    while (x_index > 0 && this.grid[y][x_index - 1] == false) {
                        x_index--;
                    }
                    this.grid[y][x] = false;
                    this.grid[y][x_index] = true;
                }
            }
        }
    }

    gravityRight() {
        // Loop through grid from bottom to up
        for (let x = this.size - 1; x >= 0; x--) {
            for (let y = 0; y < this.size; y++) {
                // If there is a block
                if (this.grid[y][x]) {
                    // Move it down until it reaches a block or the side of the grid
                    let x_index = x;
                    while (x_index < this.size - 1 && this.grid[y][x_index + 1] == false) {
                        x_index++;
                    }
                    this.grid[y][x] = false;
                    this.grid[y][x_index] = true;
                }
            }
        }
    }
}
