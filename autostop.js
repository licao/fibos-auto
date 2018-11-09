const coroutine = require('coroutine');
const http = require("http");
var process = require('process');
var fs = require('fs');
var cmdarr = process.argv;
let p;

var bname = cmdarr[2] || "blocknums";

var blocknums = require('./' + bname);
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
		p.kill(15);
	}
}

function start() {
	process.run('rm', ['-rf', "./blockData/a"]);
	process.run('cp', ['-rf', './blockData/data', "./blockData/a"]);
}


var last_num = 0;

function syncData() {
	if (last_num > 11770236) {
		console.log('over the bug , blocknum is ', runnum.nownum);
		return;
	}
	try {
		const rep = http.post("http://127.0.0.1:8871/v1/chain/get_info", {
			json: {}
		});
		const a = rep.json();
		console.log("block_num==> ", runnum.nownum, a.head_block_num, blocknums.length);
		if (a.head_block_num == last_num) {
			endSeed();
			coroutine.sleep(4000);
			start();
			runnum.nownum = blocknums.shift();
			runnum.runed.push(runnum.nownum)
			fs.writeFile('runnum.json', JSON.stringify(runnum));
			fs.writeFile(bname + '.json', JSON.stringify(blocknums));
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
fs.writeFile(bname + '.json', JSON.stringify(blocknums));
runSeed('a', 8871, runnum.nownum);

coroutine.start(
	function() {
		setInterval(syncData, 40 * 1000)
	}
)