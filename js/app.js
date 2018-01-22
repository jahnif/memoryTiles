$(function () {
    // Define list of cards
    const allCardsSymbols = [
        'fa-diamond',
        'fa-paper-plane-o',
        'fa-anchor',
        'fa-bolt',
        'fa-cube',
        'fa-anchor',
        'fa-leaf',
        'fa-bicycle',
        'fa-diamond',
        'fa-bomb',
        'fa-leaf',
        'fa-bomb',
        'fa-bolt',
        'fa-bicycle',
        'fa-paper-plane-o',
        'fa-cube'
    ];

    // Declare variables for win modal 
    let totalSeconds, totalMinutes;

    // Shuffle function from http://stackoverflow.com/a/2450976
    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    // reshuffle cards
    function reshuffle() {
        $('.deck').children().remove(); // clear the cards
        let shuffledCards = shuffle(allCardsSymbols);
        for (card of shuffledCards) {
            $('.deck').append(`<li class="card flipping animated"><i class="fa ${card}"></i></li>`);
        }

    }
    reshuffle();

    let openCards = [];
    let moves = 0;
    let delayTime = 500;

    // add open card to list
    function addOpenCard(e) {
        let classes = e.children().attr('class');
        openCards.push(classes);
    }

    // add match class to cards
    function addMatch() {
        $('.open').addClass('match rubberBand');
    }

    // remove open and show classes from cards with custom time parameter
    function cardReset(time) {
        setTimeout(function () {
            $('.open').removeClass('incorrect open show');
        }, time)
    };

    // wrong guess function
    function wrongGuess() {
        $('.open').addClass('incorrect');
        setTimeout(function () {
            // $('.open').removeClass('incorrect show');
            cardReset();
        }, 500);
    }

    // remove star
    function removeStar() {
        $('.stars').children().first().remove();
        $('.stars').append('<li><i class="fa fa-star-o"></i></li>')
    }

    // restart the stars
    function restartStars() {
        $('.stars').children().remove();
        for (let i = 1; i <= 3; i++) {
            $('.stars').append('<li><i class="fa fa-star"></i></li>')
        }
    }

    // copy the stars from the score panel to the win modal
    function winStars() {
        $('.winStars').empty();
        let finishedStars = $('.stars').children().clone();
        $('.winStars').append(finishedStars);
    }

    // increment move
    function oneMove() {
        moves++;
        $('.moves').html(moves);
        (moves === 12) ? removeStar() : (moves === 18) ? removeStar() : null;
    }

    // show card symbol
    function showCard(e) {
        // check to make sure card isn't already matched or shown and don't allow for more than two open cards at once
        if (!e.hasClass('open') && !e.hasClass('match') && $('.open').length < 2) {
            e.addClass('show open');
            addOpenCard(e);
        }
    }

    // check winning conditions
    function checkWin() {
        var totalMatched = $('.match').length;
        (totalMatched === 16) ? winMessage(): null;
    }

    // display and create win modal content
    function winMessage() {
        $('#totalMoves').html(moves);
        $('#totalStars').text(''); // clear totalstars span
        totalSeconds = seconds;
        totalMinutes = minutes;
        $('#totalTime').html(`${totalMinutes}:${totalSeconds}`);
        $('#winModal.hidden').removeClass('hidden'); // show win modal
    }

    // restart function
    function restart() {
        ms = 0;
        openCards = []
        moves = 0;
        stopTimer(firstTimer);
        // $('#timer').text(`00:00`);
        // firstTimer = setInterval(setTime, 1000);

        reshuffle();
        $('.moves').html(moves);
        restartStars();
    }

    // play again button
    $('.button').click(function () {
        restart();
        $('#winModal').addClass('hidden');
    });

    // card event listener
    $('body').on('click', '.card', function () {
        showCard($(this));
        // check if more than one card is open
        if (openCards.length <= 1) {} else {
            if (openCards[0] === openCards[1]) { // if the open cards match, add the 'match' class
                addMatch();
                cardReset();
                oneMove();
                openCards = [];
                winStars();
                checkWin();
            } else { // if the open cards don't match animate them as incorrect guesses and reset them
                wrongGuess();
                oneMove();
                openCards = [];
            }
        }
    });

    // event listener for restart button
    $('.restart').click(function () {
        restart();
    });

    // declare variables for the timer
    let ms = 0,
        seconds = 0,
        minutes = 0;

    // timer function
    function setTime() {
        ms++;
        seconds = Math.floor(ms % 60);
        seconds = ("0" + seconds).slice(-2);
        minutes = Math.floor(ms / 60);
        minutes = ("0" + minutes).slice(-2);
        $('#timer').text(`${minutes}:${seconds}`);
    };

    // start the timer with an defined interval
    let startTimer = function (t) {
        setInterval(setTime, t);
    }

    // declare this variable outside the scope to use clearInterval on the timer
    let firstTimer;

    // stop the timer 
    let stopTimer = function (firstTimer) {
        clearInterval(firstTimer);
                $('#timer').text(`00:00`);
    };

    // start the timer on the first card click of the game
    $('body').on('click', '.card', function () {
        if (openCards.length == 1 && moves == 0) {
            firstTimer = setInterval(setTime, 1000);
        }
    });

});
/*
 x set up the event listener for a card. If a card is clicked:
 *  x display the card's symbol (put this functionality in another function that you call from this one)
 *  x add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  x if the list already has another card, check to see if the two cards match
 *    x if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    x if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    x increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//  x fix timer to start on tile click
//     x make sure it doesn't start immediately after the restart click
// x make game responsive
// x readme
//     x screenshots
//     x description of ratings

// Rubric
/*
Memory Game Logic
The game randomly shuffles the cards. A user wins once all cards have successfully been matched.

Congratulations Popup
When a user wins the game, a modal appears to congratulate the player and ask if they want to play again. It should also tell the user how much time it took to win the game, and what the star rating was.

Restart Button
A restart button allows the player to reset the game board, the timer, and the star rating.

Star Rating
The game displays a star rating (from 1-3) that reflects the player's performance. At the beginning of a game, it should display 3 stars. After some number of moves, it should change to a 2 star rating. After a few more moves, it should change to a 1 star rating.
The number of moves needed to change the rating is up to you, but it should happen at some point.

Timer
When the player starts a game, a timer should also start. Once the player wins the game, the timer stops.

Move Counter
Game displays the current number of moves a user has made.
*/

// Joseph's Notes
/*

- add css animations to cards
	- not match

*/