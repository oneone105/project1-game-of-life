let unitLength = 20;
let boxColor = [0, 100, 255];
let backgroundColor = 245;
let variBoxColor = boxColor;
let strokeColor = 220;
let columns; /* To be determined by window width */
let rows;    /* To be determined by window height */
let currentBoard;
let nextBoard;
let fr = 10; // frame rate
let nLoneliness = 2; // min neighbor
let nOverPopu = 3; // max neighbor
let nRepo = 3; // neighbor needs for reproduction
let discoMode = false; // keep random color at draw()
let isGameStart = false;
let inserting = false;
let insertName = ""
let singleColor = true;
let frame = document.querySelector('#frame-counter');
let frr = 0;
let keepInsert = false;

function init() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = 0;
            nextBoard[i][j] = 0;
        }
    }
}
function generate() {
    //Loop over every single box on the board
    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            // Count all living members in the Moore neighborhood(8 boxes surrounding)
            let neighbors = 0;
            for (let i of [-1, 0, 1]) {
                for (let j of [-1, 0, 1]) {
                    if (i == 0 && j == 0) {
                        // the cell itself is not its own neighbor
                        continue;
                    }
                    // The modulo operator is crucial for wrapping on the edge
                    neighbors += currentBoard[(x + i + columns) % columns][(y + j + rows) % rows];
                }
            }
            // Rules of Life
            if (currentBoard[x][y] == 1 && neighbors < nLoneliness) {
                // Die of Loneliness
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 1 && neighbors > nOverPopu) {
                // Die of Overpopulation
                nextBoard[x][y] = 0;
            } else if (currentBoard[x][y] == 0 && neighbors == nRepo) {
                // New life due to Reproduction
                nextBoard[x][y] = 1;
            } else {
                // Stasis
                nextBoard[x][y] = currentBoard[x][y];
            }
        }
    }

    // Swap the nextBoard to be the current Board
    [currentBoard, nextBoard] = [nextBoard, currentBoard];
}
function setup() {
    frameRate(fr);
    /* Set the canvas to be under the element #canvas*/
    const canvas = createCanvas(windowWidth - 200, windowHeight - 520);
    canvas.parent(document.querySelector('#canvas'));

    /*Calculate the number of columns and rows */
    columns = floor(width / unitLength);
    rows = floor(height / unitLength);  
    console.log(columns, rows)

    /*Making both currentBoard and nextBoard 2-dimensional matrix that has (columns * rows) boxes. */
    currentBoard = [];
    nextBoard = [];
    for (let i = 0; i < columns; i++) {
        currentBoard[i] = [];
        nextBoard[i] = []
    }
    // Now both currentBoard and nextBoard are array of array of undefined values.
    init();  // Set the initial values of the currentBoard and nextBoard
    updateUI();
}
function updateUI() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            if (currentBoard[i][j] == 1) {
                // the box will die in next round change different color
                if (nextBoard[i][j] == 0) {
                    fill(variBoxColor)
                } else {
                    fill(boxColor);
                }
            } else {
                // no life
                fill(backgroundColor);
            }
            stroke(strokeColor);
            rect(i * unitLength, j * unitLength, unitLength, unitLength);
        }
    }
    // stroke("#000")
    // rect(0, 0, columns * unitLength, rows * unitLength);

}
function setGameStart() {
    isGameStart = true;
}
function draw() {
    if (!isGameStart) {
        return;
    }
    background(255);
    generate();
    updateUI();
    if (discoMode === true) {
        randomColor();
        multiColor();
        backgroundColor = 50;
        strokeColor = variBoxColor;
    }
    frr += 1;
    frame.innerHTML = frr;
}

function mouseDragged() {
    /**
     * If the mouse coordinate is outside the board
     */
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    } else if (inserting == true) {
        return;
    } else {
    const x = Math.floor(mouseX / unitLength);
    const y = Math.floor(mouseY / unitLength);
    currentBoard[x][y] = 1;
    fill(boxColor);
    stroke(strokeColor);
    rect(x * unitLength, y * unitLength, unitLength, unitLength);
}}

/**
 * When mouse is pressed
 */
function mousePressed() {
    // noLoop();
    if (mouseX > unitLength * columns || mouseY > unitLength * rows) {
        return;
    } else {
        isGameStart = false;
    }
    if (inserting == true){
            insertPattern();
    }
    mouseDragged();
}

// /**
//  * When mouse is released
//  */
// function mouseReleased() {
//     loop();
// }

function randomColor() {
    boxColor[0] = parseInt(Math.floor(Math.random() * 255));
    boxColor[1] = parseInt(Math.floor(Math.random() * 255));
    boxColor[2] = parseInt(Math.floor(Math.random() * 255));
}

function multiColor() {
    let r = 0;
    let g = 0;
    let b = 0;
    r = Math.floor(Math.random() * 255)
    g = Math.floor(Math.random() * 255)
    b = Math.floor(Math.random() * 255)
    variBoxColor = [r, g, b]
}

function darkenColor() {
    let r = 0;
    let g = 0;
    let b = 0;
    r = parseInt(Math.floor(boxColor[0] / 1.67))
    g = parseInt(Math.floor(boxColor[1] / 1.67))
    b = parseInt(Math.floor(boxColor[2] / 1.67))
    boxColor = [r, g, b]
    console.log(boxColor)
}
// resize game board to update window size
function windowResized() {
    noLoop()
    resizeCanvas(windowWidth - 200, windowHeight - 500)
    setup()
    updateUI()
}

document.querySelector('#game-start')
    .addEventListener('click', function () {
        // frameRate(fr);
        setGameStart();
        loop();
    });

document.querySelector('#game-pause')
    .addEventListener('click', function () {
        noLoop();
    });

document.querySelector('#reset-game')
    .addEventListener('click', function () {
        noLoop();
        discoMode = false;
        boxColor = [0, 100, 255];
        frr = 0;
        backgroundColor = 245;
        variBoxColor = boxColor;
        strokeColor = 220;
        init();
        updateUI();
    });


document.querySelector('#keep-random')
    .addEventListener('click', function () {
        if (discoMode == false) {
            discoMode = true;
        } else {
            discoMode = false;
        }
    });
// button - make box color become random color
document.querySelector('#random-color')
    .addEventListener('click', function () {
        randomColor();

    });
// button - make stable box color darken
document.querySelector('#darken-color')
    .addEventListener('click', function () {
        darkenColor();

    });
// button - change to multi color
document.querySelector('#multi-color')
    .addEventListener('click', function () {
        if (singleColor == true){
            multiColor();
            singleColor = false;
            console.log(singleColor)
        } else {
            a = 1;
            variBoxColor = boxColor;
            singleColor = true;
        }
        console.log(singleColor)
    });
document.querySelector('#keep-insert')
.addEventListener('click', function () {
    if (keepInsert == false){
        inserting = true;
        keepInsert = true;
        console.log("keepInsert is true")
    } else if (keepInsert == true){
        keepInsert = false;
        console.log("keepInsert is false")

    }
});
// // button - change to single color
// document.querySelector('#single-color')
//     .addEventListener('click', function () {
//         a = 1;
//         variBoxColor = boxColor;

//     });

document.querySelectorAll('.pattern').forEach((e)=>{
    e.addEventListener('click',(event)=>{
        inserting = true;
        insertName = event.target.value;
    })
})

// document.querySelector('#insert-glider')
// .addEventListener('click', function () {
//     inserting = true;
//     insertName = "glider"
// });

// document.querySelector('#insert-gun')
// .addEventListener('click', function () {
//     inserting = true;
//     insertName = "gun"
// });
// document.querySelector('#insert-emoji')
// .addEventListener('click', function () {
//     inserting = true;
//     insertName = "emoji"
// });

document.querySelector('#random-init')
    .addEventListener('click', function () {
        randomState();
        isGameStart = false;
    });

// frame rate slider
let slider = document.getElementById("customRange3")
let output = document.getElementById("frames");
document.getElementById("frames").innerHTML = output.innerHTML;
output.innerHTML = slider.value;
slider.oninput = function () {
    output.innerHTML = this.value;
    fr = Number(this.value);
    frameRate(fr);
    loop();
}
// grid size slider
let grid = document.querySelector('#grid-range')
grid.addEventListener('input', () => {
    unitLength = grid.value
    setup();
})
// survival min neighbor
const minNeighborList = document.querySelectorAll(".survivalNum")
minNeighborList.forEach(elem => {
    elem.addEventListener("click", (event) => {
        nLoneliness = Number(event.target.innerText);
        loop();
        document.querySelectorAll('.overNum').forEach(elem => {
            if (elem.innerText <= nLoneliness) {
                elem.classList.add("disabled")
            } else {
                elem.classList.remove("disabled")
            }
        })
    })
})
// survival max neighbor
const maxNeighborList = document.querySelectorAll(".overNum")
maxNeighborList.forEach(elem => {
    elem.addEventListener("click", (event) => {
        nOverPopu = Number(event.target.innerText);
        loop();
        document.querySelectorAll('.survivalNum').forEach(elem => {
            if (elem.innerText >= nOverPopu) {
                elem.classList.add("disabled")
            } else {
                elem.classList.remove("disabled")
            }
        }
        )
    })
})
// reproduction neighbor
const repoNumList = document.querySelectorAll(".repoNum")
repoNumList.forEach(elem => {
    elem.addEventListener("click", (event) => {
        nRepo = Number(event.target.innerText);
        loop();
    })
})

function insertPattern() {
    let pattern;
    if (insertName == "gun"){ 
        pattern = gosperGun.split('\n')
    } else if (insertName == "glider") {
        pattern = glider.split('\n')
    } else if (insertName == "emoji") {
        pattern = emoji.split('\n')
    } else if (insertName == "sword") {
        pattern = sword.split('\n')
    } else if (insertName == "block") {
        pattern = block.split('\n')
    } else if (insertName == "blinker") {
        pattern = blinker.split('\n')
    } else if (insertName == "toad") {
        pattern = toad.split('\n')
    } else if (insertName == "loaf") {
        pattern = loaf.split('\n')
    } else if (insertName == "hassler") {
        pattern = hassler.split('\n')
    } else if (insertName == "lwss") {
        pattern = lwss.split('\n')
    }
    for (let i = 0; i < pattern.length; i++) {
        for (let j = 0; j < pattern[i].length; j++) {
            let x = Math.floor(mouseX / unitLength);
            let y = Math.floor(mouseY / unitLength);
            let columns = floor(width / unitLength);
            let rows = floor(height / unitLength);  
            currentBoard[(x + j + columns) % columns][(y + i + rows) % rows] = pattern[i][j] === "." ? 0 : 1;
        }
    }
    updateUI();
}

function mouseReleased() {
    if (keepInsert == false){
        inserting = false;
    }
}

function randomState() {
    for (let i = 0; i < columns; i++) {
        for (let j = 0; j < rows; j++) {
            currentBoard[i][j] = Math.round(Math.random(), 0.5)
            // nextBoard[i][j] = 0;
        }
    }
    updateUI();
}

