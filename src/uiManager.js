define(['ko'], function(ko) {

    let UI = function() {

        this.vm = null;        
        return this;

    };

    UI.prototype.start = function(appData) { console.log(appData.tickets)

        let CellModel = function(data, atEnd) {

            this.hit = ko.observable(data.hit);
            this.value = ko.observable(data.v);
            this.end = ko.observable(atEnd);

        };

        let TicketModel = function(data) {

            this.remaining = ko.observable(data.remaining);

            this.cells = ko.observableArray(
                data.grid.map(function(cellData, i) {
                    let endOfRow = i % 9 === 0;
                    return new CellModel(cellData, endOfRow);
                })
            );

        };

        let AppModel = function(tickets) {

            let self = this;

            this.tickets = ko.observableArray(
                tickets.map(function(ticketData) {
                    return new TicketModel(ticketData)
                })
            );

        };

        this.vm = new AppModel(appData.tickets);

        ko.applyBindings(this.vm);

        return this;

    };

    UI.prototype.update = function(data) {

        this.vm.tickets().forEach(function(element, i) {

            let currentItem = data[i];
            
            element.remaining(currentItem.remaining);
            element.cells().forEach(function(cell, j){
                cell.hit(currentItem.grid[j].hit);
            });

        }, this);

        //throw "";

    };

    return UI;

});