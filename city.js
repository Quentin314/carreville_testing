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


    draw(city_x, city_y) {
        push();
        strokeWeight(0);
        rectMode(CORNER);
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                if (this.grid[y][x]) {
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

        return [grid_x, grid_y];
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
                        perimeter++;
                    }
                    if (x > 0) {
                        if (this.grid[y][x-1] == false) {
                            perimeter++;
                        }
                    } else {
                        if (beach == false) {
                            perimeter++;
                        }
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
}