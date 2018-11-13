const coroutine = require('coroutine');
const http = require("http");
var process = require('process');
var fs = require('fs');
var cmdarr = process.argv;
let p;

var all = require('./check');

var start_num = Number(cmdarr[2]) || 0;

var end_num = Number(cmdarr[3]) || (start_num + 100);

console.log('开始检查==============>', start_num - 1, end_num);

var blocknums = all.slice(start_num - 1, end_num);

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

var coping = false;

function start() {
	coping = true;
	var t = new Date().getTime();
	console.log("cp start=>", t);
	process.run('rm', ['-rf', "./blockData/a"]);
	process.run('cp', ['-rf', './blockData/data', "./blockData/a"]);
	console.log('cp time =>', new Date().getTime() - t);
	coping = false;
}

// rm -rf ./blockData/a
// cp -rf ./blockData/data ./blockData/a

var last_num = 0;
var runinfo = {};
var errornum = 0;

function syncData() {
	if (coping) {
		console.log('coping  ', new Date().getTime());
		return;
	}

	try {
		const rep = http.post("http://127.0.0.1:8871/v1/chain/get_info", {
			json: {}
		});
		const a = rep.json();
		console.log("block_num==1 > ", runnum.nownum, a.head_block_num, blocknums.length);
		runinfo[Number(runnum.nownum)] = a.head_block_num;
		fs.writeFile('runinfo.json', JSON.stringify(runinfo));
		if (a.head_block_num == last_num && a.head_block_num < 11770238) {
			console.log("block_num==2> 不动了 小于11770237");
			endSeed();
			coroutine.sleep(4000);
			start();
			runnum.nownum = blocknums.shift();
			if (!runnum.nownum) {
				console.log("block_num==3> ", runnum.nownum, a.head_block_num, blocknums.length);
				return;
			}
			runnum.runed.push(runnum.nownum)
			fs.writeFile('runnum.json', JSON.stringify(runnum));
			fs.writeFile('runnum2.json', JSON.stringify(blocknums));
			runSeed('a', 8871, runnum.nownum);
		} else {
			last_num = a.head_block_num;

			if (a.head_block_num > 11770237) console.log("block_num==3> 不动了 大于11770237 ==>", a.head_block_num);
		}
	} catch (e) {
		console.log(e);
	}

}

start()
runnum.nownum = blocknums.shift();
runnum.runed.push(runnum.nownum)
fs.writeFile('runnum.json', JSON.stringify(runnum));
fs.writeFile('runnum2.json', JSON.stringify(blocknums));
runSeed('a', 8871, runnum.nownum);


setInterval(syncData, 60 * 1000)