define(['enums', 'appData', 'helpers', 'gameLogic'], function (enums, appData, helpers, gameLogic) {

    // Caller state could quite easily be accompanied by other states using an FSM. This would allow for you to 
    // chain various animations or events. Since this is just a simple example, we only need the one.
    let CallerState = function () {

        // Set a new property in the appData area for balls called through the session
        appData.set('ballCalled', -1);

    }

    CallerState.prototype.update = function () {

        let numberCache = appData.get('numberCache');
        let tickets = appData.get('tickets');

        if (numberCache.length === 0)
            return;

        let rand = helpers.chance.integer({
            min: 0,
            max: numberCache.length - 1
        });

        let n = numberCache.splice(rand, 1)[0];
        let logic = gameLogic.callBall(n, tickets);

        appData.update('ballCalled', n);

        if (logic.state === enums.TICKETWIN) {
            return {
                state: logic.state,
                data: logic.ticketInfo
            };
        }

        // You might want to use this for some sort of scoring animation event
        // if (logic.state === enums.SCORED) {
        //     //console.log(logic.ticketInfo);
        //     // Perform 'scored' state
        // }

        return {
            state: logic.state,
            data: null
        };

    };

    return CallerState;

});