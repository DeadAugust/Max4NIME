const maxApi = require('max-api');

maxApi.post('test');

let bump = true;
setInterval(function(){
    if (bump){
        maxApi.post('kick');
        maxApi.outlet(['kick', 1, 2, 3, 4, 5, 0, 0, 0])
        maxApi.outlet(['tom', 1, 2, 3, 4, 5, 0, 0, 8]); //list
        maxApi.outlet(['openhat', 1, 2, 0, 0, 5, 6, 0, 0]); //list
        maxApi.outlet(['closedhat', 0, 0, 3, 4, 5, 6, 0, 0]); //list
        maxApi.outlet(['cymbal', 0, 0, 3, 4, 0, 0, 7, 8]); //list
        ; //list
    } else {
        maxApi.post('snare');
        maxApi.outlet(['snare', 0, 0, 0, 1, 5, 6, 7, 8]); //list
    }
    bump = !bump;
}, 1000);
// maxApi.outlet(['kick', 0, 1, 1, 1, 1, 0, 1, 0]); //list

// maxApi.outlet({
//     x: 1,
//     y: 3
// });
// maxApi.outlet([1, 3]);
// maxApi.setDict('kick', {
//     0: 0,
//     1: 1,
//     2: 0,
//     3: 1
// })