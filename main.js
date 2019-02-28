var dotArray = [];
var bound = [];
var cellSize;
var xSize = 5,
    ySize = 5;
for (let i = 0; i < xSize; i++) {
    let tempArray = [];
    for (let j = 0; j < ySize; j++) {
        tempArray.push(false);
        if (j == 0 || i == 0) {
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
        this.keyPt = {
            x: startX,
            y: startY
        };
        this.directionPassed = [];

        while (!this.end) {
            this.update();
        }
    }
    update() {
        var nextDirection;
        if (this.startPt.x == this.keyPt.x && this.startPt.y == this.keyPt.y) {
            if (this.keyPt.x == 0) {
                nextDirection = 0;
            } else {
                if (this.keyPt.x == xSize - 1) {
                    nextDirection = 6;
                } else {
                    if (this.keyPt.y == 0) {
                        nextDirection = 9;
                    } else {
                        if (this.keyPt.y == ySize - 1) {
                            nextDirection = 3;
                        }
                    }
                }
            }
        } else {
            console.log(this.directionAround(0));
            nextDirection = this.directionAround(this.directionPassed[this.directionPassed.length - 1])[Math.floor(Math.random()*3)];
        }

        this.directionPassed.push(nextDirection);
        switch (nextDirection) {
            case 0:
                this.keyPt.x++;
                break;
            case 1:
                this.keyPt.x++;
                this.keyPt.y++;
                break;
            case 2:
                this.keyPt.x++;
                this.keyPt.y++;
                break;
            case 3:
                this.keyPt.y++;
                break;
            case 4:
                this.keyPt.y++;
                this.keyPt.x--;
                break;
            case 5:
                this.keyPt.y++;
                this.keyPt.x--;
                break;
            case 6:
                this.keyPt.x--;
                break;
            case 7:
                this.keyPt.x--;
                this.keyPt.y--;
                break;
            case 8:
                this.keyPt.x--;
                this.keyPt.y--;
                break;
            case 9:
                this.keyPt.y--;
                break;
            case 10:
                this.keyPt.x++;
                this.keyPt.y--;
                break;
            case 11:
                this.keyPt.x++;
                this.keyPt.y--;
        }
        if (this.keyPt.x == 0 || this.keyPt.y == 0 || this.keyPt.x == xSize - 1 || this.keyPt.y == ySize - 1) {
            this.end = true;
        }
    }
    render() {}
    directionAround(direction) {
        var directionFrom = {
            "right" : [0, 2, 10],
            "up" : [1, 3, 5],
            "left" : [4, 6, 8],
            "down" : [7, 9, 11]
        };
        var directionTo = {
            "right" : [11, 0, 1],
            "up" : [2, 3, 4],
            "left": [5, 6, 7],
            "down": [8, 9, 10]
        }
        Object.keys(directionFrom).forEach((keys)=>{
            if (directionFrom[keys].includes(direction)){
                console.log(directionTo[keys]);
                return (directionTo[keys]);
            } 
        });
        console.log('not found!');
    }
}

var acurve = new oneCurve(0,1);

function setup() {

}

function draw() {

}