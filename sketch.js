let size = 20;

let size_input;

const screenSize = 700;

let city;

let test = false;
let t_counter = 0;

let drawing_mode;

let beach = false;


let selection = undefined;

let selectionMode = false;

let selectionXInverted = false;
let selectionYInverted = false;


function setup() {
    createCanvas(screenSize * 2 + 10, screenSize + 50);

    size_input = createInput();
    size_input.position(630, 712);
    size_input.size(60);
    size_input.style('font-size', 30+'px');
    size_input.value("20");

    strokeWeight(0);
    textAlign(CORNER);

    console.log(width + "   " + height);

    city = new City(screenSize / size, screenSize / size, size, (0, 0, 0), (255, 255, 255), 1);
}



function draw() {
    background(80);

    city.draw(0, 0, false);
    if (beach) {
        //Mirror mode
        city.draw(10 + screenSize, 0, true);
    }
    //Draw selection
    if (selection != undefined) {
        fill(255, 0, 0, 128);
        rect(selection[0][0] * city.w, selection[0][1] * city.h, (selection[1][0] - selection[0][0] + 1) * city.w, (selection[1][1] - selection[0][1] + 1) * city.h);
    }

    textSize(30);
    fill(255, 255, 255)
    text("Area: " + city.get_area(), 30, 735);
    text("Perimeter: " + city.get_perimeter(beach), 200, 735);
    text("Beach: ", 440, 735);
    text("Smallest perimeter for this area: " + city.get_best_perimeter(beach), 740, 735);


    //Beach button
    if (beach) {
        fill(0, 255, 0);
        rect(550, 710, 30, 30);
    } else {
        fill(255, 0, 0);
        rect(550, 710, 30, 30);
    }

    
    //Beach
    if (beach) {
        fill(220, 220, 0);
        rect(screenSize, 0, 10, 700);
    }


    //Selection
    if (selectionMode) {
        let coords = city.world_to_grid(mouseX, mouseY);
        if (selectionXInverted) {
            selection[0][0] = coords[0];
        } else {
            selection[1][0] = coords[0];
        }
        if (selectionYInverted) {
            selection[0][1] = coords[1];
        } else {
            selection[1][1] = coords[1];
        }
    }

    //Make selection valid
    if (selection != undefined) {
        if (selection[0][0] > selection[1][0]) {
            let buffer = selection.slice(0)[0][0];
            selection[0][0] = selection.slice(0)[1][0];
            selection[1][0] = buffer;
            selectionXInverted = !selectionXInverted;
        }
        if (selection[0][1] > selection[1][1]) {
            let buffer = selection.slice(0)[0][1];
            selection[0][1] = selection.slice(0)[1][1];
            selection[1][1] = buffer;
            selectionYInverted = !selectionYInverted
        }
    }
    
    if (test) {
        if (t_counter % 4 == 0) {
            city.gravityUp();
        }
        else if (t_counter % 4 == 1) {
            city.gravityRight();
        }
        else if (t_counter % 4 == 2) {
            city.gravityDown();
        }
        else if (t_counter % 4 == 3) {
            city.gravityLeft();
        }
        t_counter++;
    }
}


function mouseClicked() {
    //Beach button
    if (mouseX > 550 && mouseX < 580 && mouseY > 710 && mouseY < 740) {
        beach = !beach;
    }
}


function mousePressed() {
    if (selectionMode) {
        selectionMode = false;
    } else {
        let grid_coord = city.world_to_grid(mouseX, mouseY);
        if (grid_coord != null) {
            if (city.get_square(grid_coord[0], grid_coord[1])) {
                drawing_mode = false;
            } else {
                drawing_mode = true;
            }

            city.set_square(grid_coord[0], grid_coord[1], drawing_mode);
        }
    }
}

function mouseDragged() {
    let grid_coord = city.world_to_grid(mouseX, mouseY);
    if (grid_coord != null) {
        city.set_square(grid_coord[0], grid_coord[1], drawing_mode);
    }
}


function keyPressed() {
    //Move around
    if (keyCode === RIGHT_ARROW) {
        city.shift_grid(1, 0);
    }
    if (keyCode === LEFT_ARROW) {
        city.shift_grid(-1, 0);
    }
    if (keyCode === UP_ARROW) {
        city.shift_grid(0, -1);
    }
    if (keyCode === DOWN_ARROW) {
        city.shift_grid(0, 1);
    }

    //Change size
    if (keyCode == ENTER) {
        size = parseInt(size_input.value());

        city = new City(screenSize / size, screenSize / size, size, (0, 0, 0), (255, 255, 255), 1);
    }


    //True
    if (keyCode == 84) {
        if (selection == undefined) {
            for (let y = 0; y < city.size; y++) {
                for (let x = 0; x < city.size; x++) {
                    city.grid[y][x] = true;
                }
            }
        } else {
            for (let y = selection[0][1]; y <= selection[1][1]; y++) {
                for (let x = selection[0][0]; x <= selection[1][0]; x++) {
                    city.grid[y][x] = true;
                }
            }
        }
    }


    //False
    if (keyCode == 70) {
        if (selection == undefined) {
            for (let y = 0; y < city.size; y++) {
                for (let x = 0; x < city.size; x++) {
                    city.grid[y][x] = false;
                }
            }
        } else {
            for (let y = selection[0][1]; y <= selection[1][1]; y++) {
                for (let x = selection[0][0]; x <= selection[1][0]; x++) {
                    city.grid[y][x] = false;
                }
            }
        }
    }


    //Invert
    if (keyCode == 73) {
        if (selection == undefined) {
            for (let y = 0; y < city.size; y++) {
                for (let x = 0; x < city.size; x++) {
                    city.grid[y][x] = !city.grid[y][x];
                }
            }
        } else {
            for (let y = selection[0][1]; y <= selection[1][1]; y++) {
                for (let x = selection[0][0]; x <= selection[1][0]; x++) {
                    city.grid[y][x] = !city.grid[y][x];
                }
            }
        }
    }


    //Remove selection
    if (keyCode == 27) {
        selection = undefined;
        selectionMode = false;
    }


    //Selection
    if (keyCode == 83) {
        selectionMode = true;
        let coords = city.world_to_grid(mouseX, mouseY);
        selection = [coords.slice(0), coords.slice(0)];
    }


    //Gravity
    if (keyCode == 98) {
        city.gravityDown();
    }
    if (keyCode == 100) {
        city.gravityLeft();
    }
    if (keyCode == 102) {
        city.gravityRight();
    }
    if (keyCode == 104) {
        city.gravityUp();
    }
}
