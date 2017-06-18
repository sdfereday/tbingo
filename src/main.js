require([
    'config',
    'appData',
    'enums',
    'gameLogic',
    'GameTicket',
    'CallerState',
    'UI',
    'helpers'
], function (config, appData, enums, gameLogic, Ticket, CallerState, UI, helpers) {

    ///////////////////////// PARSING
    // The static string given to each bingo card
    const tstring = "011722475204365360702637497481233455758302154058881928446789061241507324334876840738576186051132437816395663800818206590104559628214294664710935667287132130687703253151692742547985";

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
    appData.set('tickets', []);
    appData.set('numberCache', []);

    // Main application data, useful to keep global tabs on what data's being used
    // Create a collection of tickets with relavant data
    let createdTickets = ticketNumberGroups.map(function (ticketNumberGroup, i) {
        return new Ticket(config.cardWidth, config.cardHeight, ticketNumberGroup.length, ticketNumberGroup, i).make();
    });

    // Create a series of numbers to be balles
    let balls = [];

    for (let i = 1; i <= config.maxBalls; i++) {
        balls.push(i);
    }

    // Update the app data cache with newly created elements
    appData.update('tickets', createdTickets);
    appData.update('numberCache', balls);

    ////////////////////////// UI & Game State
    let appUI = new UI()
        .start({
            tickets: appData.get('tickets')
        });

    let currentState = new CallerState();

    ////////////////////////// DOM events
    let output = document.getElementById('output');
    let playButton = document.getElementById('play');
    let pauseButton = document.getElementById('pause');
    let gameOver = false;
    let paused = false;

    playButton.addEventListener('click', function () {

        this.style.display = 'none';
        pauseButton.style.display = 'inline-block';
        output.style.display = 'block';

        output.innerHTML = "Now playing!";

        startGame();

    });

    pauseButton.addEventListener('click', function () {
        paused = !paused;
        this.innerHTML = paused ? "Resume Game" : "Pause Game";
    });

    ///////////////////////// Main Loop
    function startGame() {

        // To speed up the game, please see the config.js file
        helpers.setInterval(function () {

            if (paused)
                return;

            if (gameOver) {
                // You could get all of these strings from a server resource for translations
                output.innerHTML = "Game won!";
                appUI.win(appData.get('tickets'));
                return;
            }

            let appState = currentState.update();
            gameOver = appState.state === enums.TICKETWIN;

            appUI.update(appData.get('tickets'));

            output.innerHTML = "Number called: " + appData.get('ballCalled');

        }, config.updateSpeed);

    }

});