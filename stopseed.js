var fibos = require('fibos');
var fs = require("fs");
var config = require('./config');
var process = require('process');

console.notice("start FIBOS seed node");

var cmdarr = process.argv;
//fibos stopseed.js a 8871 7777

var name = cmdarr[2] || 'test';
var port = Number(cmdarr[3]) || 8870;
var stop_block_num = Number(cmdarr[4]) || 0;


fibos.config_dir = config.auto_dir + name;
fibos.data_dir = config.auto_dir + name;

console.notice("config_dir:", fibos.config_dir);
console.notice("data_dir:", fibos.data_dir);


fibos.load("http", {
	"http-server-address": "0.0.0.0:" + port,
	"access-control-allow-origin": "*",
	"http-validate-host": false,
	"verbose-http-errors": true //打开报错
});


fibos.load("net", {
	"p2p-peer-address": config.p2p_peer_address,
	"max-clients": 100,
	"p2p-listen-endpoint": "0.0.0.0:" + (port + 1000)
});

var chain_config = {
	"contracts-console": true,
	//'chain-state-db-size-mb': 8 * 1024,
	// "delete-all-blocks": true
};

if (!fs.exists(fibos.data_dir) && !fs.exists(fibos.config_dir)) {
	chain_config['genesis-json'] = "genesis.json";
}


fibos.load("producer", {
	// 'enable-stale-production': true,
	'max-transaction-time': 3000
});


if (stop_block_num) {
	fibos.load("emitter");
	fibos.on('action', function(at) {
		var now_num = at.block_num.toString();
		if (now_num > stop_block_num - 5000) console.log(now_num);
		if (now_num == stop_block_num) {
			fibos.stop();
		}
	});
}

fibos.load("chain", chain_config);
fibos.load("chain_api");


fibos.start();