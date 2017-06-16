define(['enums'], function(enums) {

    return {

        callBall: function(calledNumber, cards) {

            let result = cards.find(b => b.tryScore(calledNumber) === enums.SCORED);

            if (result) {

                if (result.ticketFull()) {

                    return {
                        state: enums.TICKETWIN,
                        ticketInfo: result
                    };

                }

                return {
                    state: enums.SCORED,
                    ticketInfo: result
                };

            }

            return {
                state: enums.CONTINUE,
                ticketInfo: null
            }

        }

    }

});