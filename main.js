'use strict'
class Node {
    constructor(value, status = true, possibleChildren = [], choose = null) {
        this.value = value;
        this.status = status;
        this.possibleChildren = possibleChildren;
        this.choose = choose;
        this.parent = null;
    }
    chooseIndex(index) {
        this.choose = index;
        this.possibleChildren[index].parent = this;
    }
    deepestChoose(l) {
        if (l.choose == null) {
            return l;
        } else {
            let next = this.deepestChoose(l.possibleChildren[l.choose]);
            if (next) {
                return next;
            }
        }
    }
}
var dotArray = [];
var bound = [];
var curves = [];
var cellSize = 10;
var xSize = 100,
    ySize = 100;
var number = 50;

var lineWidth = 3;
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
        var v;
        if (this.keyPt.x == 0) {
            v = 0;
        } else {
            if (this.keyPt.x == xSize - 1) {
                v = 6;
            } else {
                if (this.keyPt.y == 0) {
                    v = 3;
                } else {
                    if (this.keyPt.y == ySize - 1) {
                        v = 9;
                    }
                }
            }
        }
        this.linkMap = new Node(v);
        this.curveIndex = curves.length;
        while (!this.end) {
            this.end = this.update();
        }
        curves.push(this);
    }
    update() {
        let nextDirection;
        let nowDirection;
        let linkNow = this.linkMap.deepestChoose(this.linkMap);

        nowDirection = linkNow.value;

        let nextDirectionPossible = this.directionAround(nowDirection);
        if (!nextDirectionPossible.length) {
            console.log(1);
            while (!linkNow.possibleChildren.length) {
                if (!linkNow.prent) {
                    return false;
                } 
                linkNow.parent.possibleChildren.splice(linkNow.parent.choose, 1);
                linkNow.parent.choose = null;
                linkNow = linkNow.parent;
            }
            nowDirection = linkNow.value;
            nextDirectionPossible = linkNow.possibleChildren.map((e) => e.value);
        } else {
            nextDirectionPossible.forEach((value) => {
                linkNow.possibleChildren.push(new Node(value));
            });
        }

        let nextIndex = Math.floor(Math.random() * nextDirectionPossible.length);
        nextDirection = nextDirectionPossible[nextIndex];
        linkNow.chooseIndex(nextIndex);

        this.moveByIndex(this.keyPt, nextDirection);
        dotArray[this.keyPt.x][this.keyPt.y] = true;

        if (this.keyPt.x == 0 || this.keyPt.y == 0 || this.keyPt.x == xSize - 1 || this.keyPt.y == ySize - 1) {
            this.end = true;
        }
        return true;
    }

    render() {
        let node = this.linkMap.possibleChildren[this.linkMap.choose];
        this.directionPassed = [];
        while (node.possibleChildren.length) {
            this.directionPassed.push(node.value);
            node = node.possibleChildren[node.choose];
        }
        this.directionPassed.push(node.value);

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