class Test{
    constructor(x){
        this.x = this.f(x);
    }
    f(x){
        return ++x;
    }
}
a = new Test(10);
console.log(a.x);