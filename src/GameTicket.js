define(['enums', 'helpers', 'TicketCell'], function(enums, helpers, TicketCell) {

    let GameTicket = function(w, h, maxScore, numberGroup, i) {

        this.maxScore = maxScore;
        this.currentScore = 0;

        this.width = w;
        this.height = h;
        this.area = w * h;

        this.grid = [];
        this.colData = [];

        this.idx = i;

        // Sort our number group in corresponding columns
        for (let j = 0; j < w; j++) {

            let filtered = numberGroup.filter(x => Math.floor(x / 10) === j);

            if (filtered.length > 0)
                this.colData.push(filtered);

        }

        return this;

    };

    GameTicket.prototype.make = function() {

        let columnData = this.colData;

        for (let col = 0; col < this.width; col++) {

            this.grid.push([]);

            for (let row = 0; row < this.height; row++) {

                let value = columnData[col][row];

                if (value) {
                    this.grid[col].push(new TicketCell(col, row, value));
                } else {
                    this.grid[col].push(new TicketCell(col, row, 0));
                }
            }

        }

        // We flatten the grid to make it quicker to access
        this.grid = helpers.flatten(this.grid);

        return this;

    };

    GameTicket.prototype.getCellByPosition = function(x, y) {

        return this.grid.find(c => c.x === x && c.y === y);

    };

    GameTicket.prototype.getCellByValue = function(v) {

        return this.grid.find(c => c.getValue() === v);

    };

    GameTicket.prototype.tryScore = function(n) {

        // Should any return true, we can return
        // the event that runs the celebration state.
        let cell = this.getCellByValue(n);

        if (cell && !cell.occupied()) {
            
            cell.use();
            this.currentScore += 1;
            
            return enums.SCORED;

        }

        return enums.MISSED;

    };

    GameTicket.prototype.ticketFull = function() {

        return this.currentScore >= this.maxScore;

    };

    return GameTicket;

});