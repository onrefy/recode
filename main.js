'use strict'
class Link {
    constructor(value, status = true, possibleArray = [], choose = null) {
        this.value = value;
        this.status = status;
        this.possibleArray = possibleArray;
        this.choose = choose;
    }
    deepestChoose(l) {
        if (l.choose == null) {
            return l;
        } else {
            let next = this.deepestChoose(l.choose);
            if (next){
                return next;
            }
        }
    }
}
var dotArray = [];
var bound = [];
var curves = [];
var cellSize = 100;
var xSize = 5,
    ySize = 5;
var number = 1;

var lineWidth = 5;
var dotWidth = 2;
for (let i = 0; i < xSize; i++) {
    let tempArray = [];
    for (let j = 0; j < ySize; j++) {
        tempArray.push(false);
        if ((j == 0 ||
                i == 0 ||
                j == ySize - 1 ||
                i == xSize - 1) &&
            !(i == 0 && j == 0) &&
            !(i == 0 && j == ySize - 1) &&
            !(i == xSize - 1 && j == 0) &&
            !(i == xSize - 1 && j == ySize - 1)
        ) {
            bound.push({
                x: i,
                y: j
            });
        }
    }
    dotArray.push(tempArray);
}

class oneCurve {
    end = false;
    constructor(startX, startY) {
        this.startPt = {
            x: startX,
            y: startY
        }
        dotArray[startX][startY] = true;
        this.keyPt = {
            x: startX,
            y: startY
        };
        this.directionPassed = [];
        this.linkMap = new Link(0);
        this.curveIndex = curves.length;
        while (!this.end) {
            this.update();
        }
        curves.push(this);
    }
    update() {
        var nextDirection;
        var preDirection;

        if (this.directionPassed.length == 0) {
            if (this.keyPt.x == 0) {
                preDirection = 0;
            } else {
                if (this.keyPt.x == xSize - 1) {
                    preDirection = 6;
                } else {
                    if (this.keyPt.y == 0) {
                        preDirection = 3;
                    } else {
                        if (this.keyPt.y == ySize - 1) {
                            preDirection = 9;
                        }
                    }
                }
            }
        } else {
            preDirection = this.directionPassed[this.directionPassed.length - 1];
        }
        this.directionAround(preDirection).forEach((value) => {
            this.linkMap.deepestChoose(this.linkMap).possibleArray.push(new Link(value));
        });

        nextDirection = this.directionAround(preDirection)[Math.floor(Math.random() * this.directionAround(preDirection).length)];


        let a = this.linkMap.deepestChoose(this.linkMap);
        a.choose = new Link(3);
        console.log(this.linkMap);






        this.directionPassed.push(nextDirection);






        this.moveByIndex(this.keyPt, nextDirection);
        dotArray[this.keyPt.x][this.keyPt.y] = true;

        if (this.keyPt.x == 0 || this.keyPt.y == 0 || this.keyPt.x == xSize - 1 || this.keyPt.y == ySize - 1) {
            this.end = true;
        }
    }

    render() {
        var present = {
            x: this.startPt.x,
            y: this.startPt.y
        };
        this.directionPassed.forEach((value) => {
            var old = {
                x: present.x,
                y: present.y
            };
            noFill();
            strokeWeight(lineWidth);
            strokeCap(SQUARE);
            this.moveByIndex(present, value);
            switch (value) {
                case 0:
                    line(old.x * cellSize, old.y * cellSize, present.x * cellSize, present.y * cellSize);
                    break;
                case 1:
                    arc((present.x - 1) * cellSize, present.y * cellSize, cellSize * 2, cellSize * 2, -PI / 2, 0);
                    break;
                case 2:
                    arc(present.x * cellSize, old.y * cellSize, cellSize * 2, cellSize * 2, PI / 2, PI);
                    break;
                case 3:
                    line(old.x * cellSize, old.y * cellSize, present.x * cellSize, present.y * cellSize);
                    break;
                case 4:
                    arc(present.x * cellSize, old.y * cellSize, cellSize * 2, cellSize * 2, 0, PI / 2);
                    break;
                case 5:
                    arc(old.x * cellSize, present.y * cellSize, cellSize * 2, cellSize * 2, PI, -PI / 2);
                    break;
                case 6:
                    line(old.x * cellSize, old.y * cellSize, present.x * cellSize, present.y * cellSize);
                    break;
                case 7:
                    arc(old.x * cellSize, present.y * cellSize, cellSize * 2, cellSize * 2, PI / 2, PI);
                    break;
                case 8:
                    arc(present.x * cellSize, old.y * cellSize, cellSize * 2, cellSize * 2, -PI / 2, 0);
                    break;
                case 9:
                    line(old.x * cellSize, old.y * cellSize, present.x * cellSize, present.y * cellSize);
                    break;
                case 10:
                    arc(present.x * cellSize, old.y * cellSize, cellSize * 2, cellSize * 2, PI, -PI / 2);
                    break;
                case 11:
                    arc(old.x * cellSize, present.y * cellSize, cellSize * 2, cellSize * 2, 0, PI / 2);
            }

        });
    }
    directionAround(direction) {
        var directionFrom = {
            "right": [0, 2, 10],
            "up": [1, 3, 5],
            "left": [4, 6, 8],
            "down": [7, 9, 11]
        };
        var directionTo = {
            "right": [11, 0, 1],
            "up": [2, 3, 4],
            "left": [5, 6, 7],
            "down": [8, 9, 10]
        }
        for (let key of Object.keys(directionFrom)) {
            if (directionFrom[key].includes(direction)) {
                var possibleDerections = directionTo[key].concat(); //must完全拷贝
                for (let i = 0; i < directionTo[key].length; i++) {
                    let tempPosition = {
                        x: this.keyPt.x,
                        y: this.keyPt.y
                    };
                    this.moveByIndex(tempPosition, directionTo[key][i]);
                    if (
                        (
                            (directionTo[key][i] % 3 !== 0) &&
                            (dotArray[this.keyPt.x][tempPosition.y] == true) &&
                            (dotArray[tempPosition.x][this.keyPt.y] == true)
                        ) ||
                        (dotArray[tempPosition.x][tempPosition.y] == true)
                    ) {
                        possibleDerections.splice(possibleDerections.indexOf(directionTo[key][i]), 1);
                    }

                }
                if (possibleDerections.length == 0) {
                    console.log('dead');
                    this.end = true;
                }
                return (possibleDerections);
            }
        }
    }
    moveByIndex(position, index) {
        switch (index) {
            case 0:
                position.x++;
                break;
            case 1:
                position.x++;
                position.y++;
                break;
            case 2:
                position.x++;
                position.y++;
                break;
            case 3:
                position.y++;
                break;
            case 4:
                position.y++;
                position.x--;
                break;
            case 5:
                position.y++;
                position.x--;
                break;
            case 6:
                position.x--;
                break;
            case 7:
                position.x--;
                position.y--;
                break;
            case 8:
                position.x--;
                position.y--;
                break;
            case 9:
                position.y--;
                break;
            case 10:
                position.x++;
                position.y--;
                break;
            case 11:
                position.x++;
                position.y--;
        }
    }
}

for (let i = 0; i < number; i++) {
    let index = Math.floor(Math.random() * bound.length);
    let temp = new oneCurve(bound[index].x, bound[index].y);
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    dotRender();
    curves.forEach((value) => {
        value.render();
    })
}

function draw() {

}

function dotRender() {
    for (let i = 0; i < xSize; i++) {
        for (let j = 0; j < ySize; j++) {
            strokeWeight(dotWidth);
            stroke(255, 0, 0);
            point(i * cellSize, j * cellSize);
        }
    }
}