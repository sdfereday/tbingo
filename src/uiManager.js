define(['ko'], function (ko) {

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

            this.hit = ko.observable(data.hit);
            this.value = ko.observable(data.v);
            this.end = ko.observable(atEnd);

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