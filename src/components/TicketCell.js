define(['enums'], function(enums){

    let Cell = function(x, y, v) {

        this.x = x;
        this.y = y;
        this.v = v;
        this.hit = 0;

    };

    Cell.prototype.use = function() {
        
        if(this.hit || this.v === 0)
            return;

        this.hit = 1;

    };

    Cell.prototype.getValue = function() {
        return this.v;
    };

    Cell.prototype.occupied = function() {
        return this.hit;
    };

    return Cell;

});