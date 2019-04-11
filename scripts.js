'use strict';

function getDogCount() {
    console.log('getDogCount is running');
    $('input[type="submit"]').on('click', event => {
        console.log('form submitted');
        event.preventDefault();
        getAndLogDogs($('input[type="text"]').val());
    });
}

function getAndLogDogs(dogCount) {
    console.log('getAndLogDogs is running');
    fetch(`https://dog.ceo/api/breeds/image/random/${dogCount}`)
    .then(response => response.json())
    .then(responseJson => console.log(responseJson))
    .catch(error => alert('Woof woof. Something isn\'t working right now.'))
}


$(getDogCount());