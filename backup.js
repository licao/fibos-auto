var coroutine = require('coroutine');
var config = require('./config');

let p;


function runSeed() {
	endSeed();
	p = process.start('fibos', ['seed.js']);
}

function endSeed() {
	if (p) p.kill(15);
	coroutine.sleep(1000);
}



