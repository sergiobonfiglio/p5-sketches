function Cell(x, y, val) {

    this.x = x;
    this.y = y;
    this.val = val;

    this.isAlive = function () {
        return this.val > .1;
    };

    this.click = function () {
        if (mouseX > this.x * res-res && mouseX <= (this.x * res + res*2) &&
            mouseY > this.y * res-res && mouseY <= (this.y * res + res*2)) {
            this.val = random();
        }
    };


    this.change = 0.5;
    this.revive = function () {
        this.val = min((this.val + this.change), 1)
    };

    this.kill = function () {
        this.val = max((this.val - this.change), 0)

    };

}