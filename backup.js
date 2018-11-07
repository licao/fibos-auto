const coroutine = require('coroutine');
const config = require('./config');
const http = require("http");

let p;

function runSeed() {
	p = process.start('fibos', ['seed.js']);
}

function endSeed() {
	if (p) {
		console.log('kill fibos');
		p.kill(15);
	}
	console.log('sleep 1 s');
	coroutine.sleep(1000);
}


runSeed();
syncData();

function syncData() {
	console.log("start now ,waiting 10 s")
	coroutine.sleep(10 * 1000);
	const rep = http.post("http://127.0.0.1:8870/v1/chain/get_info", {
		json: {}
	});
	const a = rep.json();

	console.log("now head_block_num==> ",a.head_block_num);

	endSeed();
	console.log("tar  =====>");
	process.run('tar', ['-zcvf', config.backup_dir + "/data_" + a.head_block_num + ".tar.gz", config.data_dir]);

	console.log("restart   sync");
	runSeed();

	console.log("waiting 30 s");
	coroutine.sleep(30 * 1000);
	syncData()
}