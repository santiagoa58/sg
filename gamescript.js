const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const c = canvas.getContext("2d");

let offsetY = canvas.getBoundingClientRect().top;
let offsetX = canvas.getBoundingClientRect().left;
let end = false;

const mouse = {
    x: undefined,
    y: undefined
};
/*COLORS
$color-primary: #062f4f;
$color-primary-light: #015e87;
$color-primary-dark: #08233c;

$color-secondary-lightest: #bf6aae;
$color-secondary-lighter: #b551a0;
$color-secondary-light: #813772;
$color-secondary: #652c59;
$color-secondary-dark: #391a33;
$color-secondary-darker: #291225;
$color-secondary-darkest: #1a0b16;

$color-tertiary: #891600;
$color-tertiary-light: #b82601;
$color-tertiary-dark: #531616;
*/
let len = (canvas.width + canvas.height) * 0.04;
let xpos = canvas.width / 2 - len * 2;
let ypos = canvas.height / 2 - len * 3;
let boxColor = "#f2f2f2";
const playerColor = "#222";
const winLineColor = "#b82601";
const borderColor = "#000";

tic = new TicBoard(xpos, ypos, len);
button = new Button(tic.posx + tic.len * 1.25, tic.posy + tic.len * 5, tic.len * 1.5);
const cross = [];
const circle = [];
const taken = [false, false, false, false, false, false, false, false, false];
let crossTurn = false;

window.addEventListener("click", function (event) {
    mouse.x = event.clientX - offsetX;
    mouse.y = event.clientY - offsetY;
    storeLoc(mouse.x, mouse.y);
    flip(cross, circle);
    gameResult();
});

window.addEventListener("resize", function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    tic.len = (canvas.width + canvas.height) * 0.04;
    tic.posx = canvas.width / 2 - tic.len * 2;
    tic.posy = canvas.height / 2 - tic.len * 3;
    button.x = tic.posx + tic.len * 1.25;
    button.y = tic.posy + tic.len * 5;
    button.size = tic.len * 1.5;
    button.fontSize = (parseInt(button.size / 25 * 5)).toString();
    button.fontSize = button.fontSize + "px";
    init();
});

window.addEventListener("scroll", function () {
    offsetY = canvas.getBoundingClientRect().top;
    offsetX = canvas.getBoundingClientRect().left;
});


function TicBoard(posx = 100, posy = 100, len = 100) {
    this.posx = posx;
    this.posy = posy;
    this.len = len;

    this.draw = function () {

        //draw box
        c.fillStyle = boxColor;
        c.fillRect(this.posx, this.posy, this.len, this.len);
        c.fillRect(this.posx, this.posy + this.len * (3 / 2), this.len, this.len);
        c.fillRect(this.posx, this.posy + this.len * (6 / 2), this.len, this.len);

        c.fillRect(this.posx + this.len * (3 / 2), this.posy, this.len, this.len);
        c.fillRect(this.posx + this.len * (3 / 2), this.posy + this.len * (3 / 2), this.len, this.len);
        c.fillRect(this.posx + this.len * (3 / 2), this.posy + this.len * (6 / 2), this.len, this.len);

        c.fillRect(this.posx + this.len * (6 / 2), this.posy, this.len, this.len);
        c.fillRect(this.posx + this.len * (6 / 2), this.posy + this.len * (3 / 2), this.len, this.len);
        c.fillRect(this.posx + this.len * (6 / 2), this.posy + this.len * (6 / 2), this.len, this.len);

        //draw border
        c.strokeStyle = borderColor;
        c.lineWidth = 4;
        c.strokeRect(this.posx, this.posy, this.len, this.len);
        c.strokeRect(this.posx, this.posy + this.len * (3 / 2), this.len, this.len);
        c.strokeRect(this.posx, this.posy + this.len * (6 / 2), this.len, this.len);

        c.strokeRect(this.posx + this.len * (3 / 2), this.posy, this.len, this.len);
        c.strokeRect(this.posx + this.len * (3 / 2), this.posy + this.len * (3 / 2), this.len, this.len);
        c.strokeRect(this.posx + this.len * (3 / 2), this.posy + this.len * (6 / 2), this.len, this.len);

        c.strokeRect(this.posx + this.len * (6 / 2), this.posy, this.len, this.len);
        c.strokeRect(this.posx + this.len * (6 / 2), this.posy + this.len * (3 / 2), this.len, this.len);
        c.strokeRect(this.posx + this.len * (6 / 2), this.posy + this.len * (6 / 2), this.len, this.len);

        c.stroke();
    };

    this.getX = function (column) {
        if (column < 1 || column > 3) return -1;
        return this.posx + this.len * ((column - 1) * 3 / 2);
    };
    this.getY = function (row) {
        if (row < 1 || row > 3) return -1;
        return this.posy + this.len * ((row - 1) * 3 / 2);
    };
}

function Cross(posx, posy, len, square) {
    this.posx = posx;
    this.posy = posy;
    this.len = len;
    this.square = square; //what square is the cross in (where columns are square%3)

    this.draw = function () {
        this.update();
        c.beginPath();
        c.moveTo(this.posx + 0.2 * this.len, this.posy + 0.2 * this.len);
        c.lineTo(this.posx + 0.8 * this.len, this.posy + 0.8 * this.len);
        c.moveTo(this.posx + 0.8 * this.len, this.posy + 0.2 * this.len);
        c.lineTo(this.posx + 0.2 * this.len, this.posy + 0.8 * this.len);
        c.lineWidth = 5;
        c.strokeStyle = playerColor;
        c.stroke();
    };

    this.update = function () {
        this.posx = tic.getX((this.square - 1) % 3 + 1);
        this.posy = tic.getY(Math.ceil(this.square / 3));
        this.len = tic.len;
    };
}

function Circle(posx, posy, len, square) {
    this.posx = posx;
    this.posy = posy;
    this.len = len;
    this.square = square; //what square is the circle in (where columns are square%3)

    this.draw = function () {
        this.update();
        c.beginPath();
        c.arc(this.posx + this.len / 2, this.posy + this.len / 2, this.len / 3, 0, Math.PI * 2, false);
        c.lineWidth = 5;
        c.strokeStyle = playerColor;
        c.stroke();
    };

    this.update = function () {
        this.posx = tic.getX((this.square - 1) % 3 + 1);
        this.posy = tic.getY(Math.ceil(this.square / 3));
        this.len = tic.len;
    };
}

function Button(positionx, positiony, size) {
    this.x = positionx;
    this.y = positiony;
    this.size = size;
    this.fontSize = (parseInt(this.size / 25 * 5)).toString();
    this.fontSize = this.fontSize + "px";

    this.draw = function () {
        c.fillStyle = boxColor;
        c.fillRect(this.x, this.y, this.size, this.size / 2);
        c.strokeStyle = borderColor;
        c.lineWidth = 4;
        c.strokeRect(this.x, this.y, this.size, this.size / 2);
        c.stroke();
        c.font = (this.fontSize + " Arial");
        c.textAlign = "left";
        c.fillStyle = playerColor;
        c.fillText("Replay", this.x + this.size / 5, this.y + this.size / 3.4);
    };
}

function storeLoc(clickX, clickY) {
    //if reset button is clicked, reset
    if (clickX >= button.x && clickX <= (button.x + button.size)) {
        if (clickY >= button.y && clickY <= (button.y + button.size / 2))
            clearBoard(init);
    }
    if (!end) {
        let spot = 0;
        //check to see if the mouse click location matches with a location on the board
        for (let x = 1; x <= 3; x++) {
            if (clickX >= tic.getX(x) && clickX <= tic.getX(x) + tic.len) {
                for (let y = 1; y <= 3; y++) {
                    //if the click matches a board location, and that spot is empty (not taken), then draw a circle or a cross
                    spot = ((3 * y) - 3) + (x - 1);
                    if (clickY >= tic.getY(y) && clickY <= tic.getY(y) + tic.len && !taken[spot]) {
                        if (crossTurn) {
                            cross.push(new Cross(tic.getX(x), tic.getY(y), tic.len, (spot + 1)));
                            crossTurn = false;
                        } else {
                            crossTurn = true;
                            circle.push(new Circle(tic.getX(x), tic.getY(y), tic.len, (spot + 1)));
                        }
                        taken[spot] = true;

                    }

                }

            }
        }

    }
}

function flip(crossArray, circleArray) {
    for (let i = 0; i < crossArray.length; i++) {
        crossArray[i].draw();
    }
    for (let i = 0; i < circleArray.length; i++) {
        circleArray[i].draw();
    }
}

function init() {
    tic.draw();
    button.draw();
    flip(cross, circle);
    gameResult();
    offsetY = canvas.getBoundingClientRect().top;
    offsetX = canvas.getBoundingClientRect().left;
}

function hasWon(objArray) {
    let horWin = [0, 0, 0];
    let verWin = [0, 0, 0];
    let diWin = [0, 0]; //[Left Diagonal,Right Diagonal]

    for (let i = 0; i < objArray.length; i++) {

        /*Horizontal Test*/
        //if array has elements in the first row
        if (objArray[i].square / 3 <= 1) {
            horWin[0]++;
            if (horWin[0] == 3) {
                return [1, "horizontal1"];
            }
        }
        //if array has elements in the second row
        if (objArray[i].square / 3 <= 2 && objArray[i].square / 3 > 1) {
            horWin[1]++;
            if (horWin[1] == 3) {
                return [1, "horizontal2"];
            }
        }
        //if array has elements in the third row
        if (objArray[i].square / 3 <= 3 && objArray[i].square / 3 > 2) {
            horWin[2]++;
            if (horWin[2] == 3) {
                return [1, "horizontal3"];
            }
        }
        /*End Horizontal Test*/

        /*Vertical Test*/
        //if array has elements in the first column
        if (objArray[i].square % 3 == 1) {
            verWin[0]++;
            if (verWin[0] == 3) {
                return [1, "vertical1"];
            }
        }
        //if array has elements in the second column
        if (objArray[i].square % 3 == 2) {
            verWin[1]++;
            if (verWin[1] == 3) {
                return [1, "vertical2"];
            }
        }
        //if array has elements in the third column
        if (objArray[i].square % 3 == 0) {
            verWin[2]++;
            if (verWin[2] == 3) {
                return [1, "vertical3"];
            }
        }
        /*End Vertical Test*/

        /*Diagonal Test*/
        //if array has elements in the left to right diagonal
        if (objArray[i].square == 1 || objArray[i].square == 5 || objArray[i].square == 9) {
            diWin[0]++;
            if (diWin[0] == 3) {
                return [1, "diagonal1"]; //from column 1 to column 3
            }
        }
        //if array has elements in the right to left diagonal
        if (objArray[i].square == 3 || objArray[i].square == 5 || objArray[i].square == 7) {
            diWin[1]++;
            if (diWin[1] == 3) {
                return [1, "diagonal3"]; //from column 3 to column 1
            }
        }
        /*End Diagonal Test*/
    }

    if (objArray.length == 5) {
        return [-1, "none"];
    }
    return 0;
}

function clearBoard(reInit) {
    end = false;
    for (let i = 0; i < taken.length; i++) {
        taken[i] = false;
    }
    for (let j = cross.length - 1; j >= 0; j--) {
        cross.pop();
    }
    for (let w = circle.length - 1; w >= 0; w--) {
        circle.pop();
    }
    document.getElementById("tictactoe").children[1].innerHTML = "";
    canvas.width = canvas.width;
    reInit();
}

function drawWin(winStyle) {

    end = true;
    let startx = tic.posx;
    let starty = tic.posy;
    let endx = startx + tic.len * 4;
    let endy = starty + tic.len * 4;
    let num;
    winStyle = winStyle.toLowerCase();

    num = parseInt(winStyle[winStyle.length - 1]);

    c.beginPath();
    if (winStyle.indexOf("vertical") != -1) {
        startx = tic.posx + tic.len * (1.5 * num - 1);
        endx = startx;
    } else if (winStyle.indexOf("horizontal") != -1) {
        starty = tic.posy + tic.len * (1.5 * num - 1);
        endy = starty;
    } else if (winStyle.indexOf("diagonal") != -1) {
        startx = tic.posx + (tic.len * 4) * Math.floor(num / 3);
        endx = tic.posx + (tic.len * 4) * (num % 3);
    }
    c.moveTo(startx, starty);
    c.lineTo(endx, endy);
    c.lineWidth = 7;
    c.strokeStyle = winLineColor;
    c.stroke();
}

function gameResult() {
    const crossResult = hasWon(cross);
    const circleResult = hasWon(circle);

    if (crossResult[0] == -1 || circleResult[0] == -1) {
        document.getElementById("tictactoe").children[1].innerHTML = "No Winners!";
        offsetY = canvas.getBoundingClientRect().top;
        offsetX = canvas.getBoundingClientRect().left;
    } else if (crossResult[0]) {
        document.getElementById("tictactoe").children[1].innerHTML = "Cross Wins!";
        drawWin(crossResult[1]);
        crossTurn = true;
        offsetY = canvas.getBoundingClientRect().top;
        offsetX = canvas.getBoundingClientRect().left;
    } else if (circleResult[0]) {
        document.getElementById("tictactoe").children[1].innerHTML = "Circle Wins!";
        drawWin(circleResult[1]);
        crossTurn = false;
        offsetY = canvas.getBoundingClientRect().top;
        offsetX = canvas.getBoundingClientRect().left;
    }
}

init();
