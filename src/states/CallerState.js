define(['enums', 'appData', 'helpers', 'gameLogic'], function(enums, appData, helpers, gameLogic){

    let CallerState = function() {}

    CallerState.prototype.update = function() {

        let numberCache = appData.get('numberCache');
        let tickets = appData.get('tickets');

        if (numberCache.length === 0) {
            return;
        } else {
            console.info("Running...");
        }

        let rand = helpers.chance.integer({
            min: 0,
            max: numberCache.length - 1
        });

        let n = numberCache.splice(rand, 1)[0];

        // Keeps calling ranom numbers from 1 - 90 (once only), with each call checks each ticket to see if it has the
        // number in there.
        let logic = gameLogic.callBall(n, tickets);

        if (logic.state === enums.TICKETWIN) {
            //console.log(logic.ticketInfo);
            // Perform 'win' state
        }

        if (logic.state === enums.SCORED) {
            //console.log(logic.ticketInfo);
            // Perform 'scored' state
        }

    };

    return CallerState;

});