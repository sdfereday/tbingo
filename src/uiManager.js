define(['ko', 'helpers'], function (ko, helpers) {

    let UI = function () {

        this.showGame = false;
        this.showGameOver = false;
        this.vm = null;
        this.stop = false;

        return this;

    };

    UI.prototype.start = function (appData) {

        // Using knockout js, we visualize the various structure of the ticket data, then bind it as view models here
        let CellModel = function (data, atEnd) {

            this.x = ko.observable(data.x);
            this.hit = ko.observable(data.hit);
            this.value = ko.observable(data.v);
            this.end = ko.observable(atEnd);

        };

        let ColumnModel = function(idx, cells) {

            this.x = ko.observable(idx);
            this.cells = cells().filter(function(item){
                return item.x() === this.x();
            }, this);
            
            helpers.shuffle(this.cells);

        };

        let TicketModel = function (data) {

            this.idx = ko.observable(data.idx);
            this.remaining = ko.observable(data.remaining);
            this.isWinner = ko.observable(data.winner);
            this.hide = ko.observable(false);

            this.cells = ko.observableArray(
                data.grid.map(function (cellData, i) {
                    let endOfRow = i % 9 === 0;
                    return new CellModel(cellData, endOfRow);
                })
            );

            let columns = [];

            for(let i = 0; i < data.width; i++) {
                columns.push(new ColumnModel(i, this.cells));
            }

            this.columns = ko.observableArray(columns);

        };

        let AppModel = function (tickets) {

            let self = this;

            this.tickets = ko.observableArray(
                tickets.map(function (ticketData) {
                    return new TicketModel(ticketData)
                })
            );

        };

        this.vm = new AppModel(appData.tickets);

        ko.applyBindings(this.vm);

        return this;

    };

    UI.prototype.update = function (data) {

        if (this.stop)
            return;

        // This could be improved upon, but since we're not worried about ordering, it's possible to just use the raw
        // data directly with the order in which the knockout view models have been made.
        this.vm.tickets().forEach(function (element, i) {

            let currentItem = data[i];

            element.isWinner(currentItem.remaining <= 0);
            this.stop = element.isWinner();

            element.remaining(currentItem.remaining);
            element.cells().forEach(function (cell, j) {
                cell.hit(currentItem.grid[j].hit);
            });

        }, this);

    };

    UI.prototype.win = function (data) {

        this.vm.tickets().forEach(function (ticket) {
            ticket.hide(!ticket.isWinner());
        });

    };

    return UI;

});