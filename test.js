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
            var next = this.deepestChoose(l.choose);
            if (next) return next;
        }
    }
}

var l = new Link(0);
var i = 0;
for (let i = 0;i<10;i++){
    if (l.deepestChoose(l).value < 100){
        l.choose = new Link(i++);
    }
}
