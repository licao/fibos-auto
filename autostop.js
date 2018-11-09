const coroutine = require('coroutine');
const config = require('./config');
const http = require("http");
var fs = require('fs');

let p;

var blocknums = require('./blocknums');
var runnum = require('./runnum');
var runed = runnum.runed;

function runSeed(name, port, stopnum) {
	var cmd = ['stopseed.js', name, port];
	if (stopnum) {
		cmd.push(stopnum)
	}
	p = process.start('fibos', cmd);
}

function endSeed() {
	if (p) {
		console.log('kill fibos');
		pkill.(15);
	}
}

function start() {
	process.run('rm', ['-rf', "./blockData/a"]);
	process.run('cp', ['-rf', './blockData/data', "./blockData/a"]);
}


var last_num = 0;

function syncData() {

	try {
		const rep = http.post("http://127.0.0.1:8871/v1/chain/get_info", {
			json: {}
		});
		const a = rep.json();
		console.log("block_num==> ", runnum.nownum, a.head_block_num, blocknums.length);
		if (a.head_block_num == last_num) {
			endSeed();
			start();
			runnum.nownum = blocknums.shift();
			runnum.runed.push(runnum.nownum)
			fs.writeFile('runnum.json', JSON.stringify(runnum));
			runSeed('a', 8871, runnum.nownum);
		} else {
			last_num = a.head_block_num;
		}
	} catch (e) {
		console.log('stop now')
		runSeed('a', 8871, '');
	}

}

start()
runnum.nownum = blocknums.shift();
runnum.runed.push(runnum.nownum)
fs.writeFile('runnum.json', JSON.stringify(runnum));
runSeed('a', 8871, runnum.nownum);

coroutine.start(
	function() {
		setInterval(syncData, 40 * 1000)
	}
)