require([
    'enums',
    'gameLogic',
    'GameTicket',
    'UI',
    'helpers'
], function(enums, gameLogic, Ticket, UI, helpers) {

    ///////// SETUP
    // The static string given to each bingo card
    const tstring = "011722475204365360702637497481233455758302154058881928446789061241507324334876840738576186051132437816395663800818206590104559628214294664710935667287132130687703253151692742547985";

    // Various config settings for cards, grids and app
    const config = {
        maxBalls: 90,
        cardsUsed: 6,
        cardWidth: 9,
        cardHeight: 3,
        maxScore: 5,
        numbersPerCard: 15
    };

    // Parse the string in to a useable array (uses regex)
    let parsedString = helpers.splitEvery(tstring, 2),
        ticketNumberGroups = [],
        bingoCards = [];

    // Split each number in to a group of fifteen numbers ready to be passed to each card (6 groups altogether)
    for (let i = 0; i < config.cardsUsed * config.numbersPerCard; i++) {

        if (i % config.numbersPerCard === 0) {

            let pickedNumbers = parsedString
                .slice(i, i + config.numbersPerCard)
                .map(x => parseInt(x));

            ticketNumberGroups.push(pickedNumbers);

        }

    }

    ////////////////////////// POPULATION
    // Create the bingo cards using the ticket number group as a basis (consider revision on this)
    bingoCards = ticketNumberGroups.map(function(ticketNumberGroup, i) {
        return new Ticket(config.cardWidth, config.cardHeight, ticketNumberGroup.length, ticketNumberGroup, i).make();
    });

    let numberCache = [];

    for (let i = 1; i <= config.maxBalls; i++) {
        numberCache.push(i);
    }

    ///////////////////////////// BUILD UI
    let appUI = new UI();

    ///////////////////////////// App States
    let CallerState = function() {}

    CallerState.prototype.update = function() {

        if (numberCache.length === 0) {
            console.log("Seems like nothing won.");
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
        let logic = gameLogic.callBall(n, bingoCards);

        if (logic.state === enums.TICKETWIN) {
            console.log(logic.ticketInfo);
            // Perform 'win' state
        }

        if (logic.state === enums.SCORED) {
            console.log(logic.ticketInfo);
            // Perform 'scored' state
        }

    };

    let currentState = new CallerState();

    // Main game loop
    helpers.setInterval(function(){

        currentState.update();
    
    }, 10);

});