var fibos = require('fibos');
var fs = require("fs");
var config = require('./config');
console.notice("start FIBOS producer node");

var keys = "";

while (true) {
	keys = console.readLine("input the  produce-rname:public-key:private-key! oooo:xxxxx:xxxx\n");
	if (keys) break;
}


var public_key = "";
var private_key = "";
keys = keys.split(":");
producername = keys[0];
public_key = keys[1];
private_key = keys[2];

fibos.config_dir = config.config_dir;
fibos.data_dir = config.data_dir;

var chain_config = {
	"contracts-console": true,
	'chain-state-db-size-mb': 8 * 1024,
	// "delete-all-blocks": true
};

if (!fs.exists(fibos.data_dir) && !fs.exists(fibos.config_dir)) {
	chain_config['genesis-json'] = "genesis.json";
}


console.notice("config_dir:", fibos.config_dir);
console.notice("data_dir:", fibos.data_dir);

fibos.load("http", {
	"http-server-address": "0.0.0.0:8870",
	"access-control-allow-origin": "*",
	"http-validate-host": false,
	"verbose-http-errors": true
});

fibos.load("net", {
	"max-clients": 100,
	"p2p-peer-address": config.p2p_peer_address,
	"p2p-listen-endpoint": "0.0.0.0:9870"
});

fibos.load("producer", {
	'producer-name': producername,
	// 'enable-stale-production': true,
	'max-transaction-time': 3000,
	'private-key': JSON.stringify([public_key, private_key])
});


fibos.load("chain", chain_config);
fibos.load("chain_api");

fibos.start();