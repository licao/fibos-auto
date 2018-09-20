var fibos = require('fibos');
var fs = require("fs");
var config = require('./config');

console.notice("start FIBOS full node");


fibos.config_dir = config.config_dir;
fibos.data_dir = config.data_dir;

console.notice("config_dir:", fibos.config_dir);
console.notice("data_dir:", fibos.data_dir);


fibos.load("http", {
	"http-server-address": "0.0.0.0:8870",
	"access-control-allow-origin": "*",
	"http-validate-host": false,
	"verbose-http-errors": true //打开报错
});


fibos.load("net", {
	"p2p-peer-address": [
		"se-p2p.fibos.io",
		"sl-p2p.fibos.io",
		"to-p2p.fibos.io",
		"ca-p2p.fibos.io",
		"ln-p2p.fibos.io",
		"va-p2p.fibos.io",
		"seed.bitze.site:9870",
		"p2p-mainnet.fibos123.com:9977",
		"api.fibosgenesis.com:9870",
		"seed.fibos.rocks:10100",
		"seed-mainnet.fibscan.io:9103",
		"p2p.mainnet.fibos.me:80",
		"p2p.foshenzhenbp.com:9877",
		//"p2p-mainnet.ilovefibos.com:9876", 
		"p2p-mainnet.loveyy.xyz:9871",
		"p2p.fibos.team 9876",
		"seed.fiboso.com:9965",
		"fibos.smr123.com:7890",
		"superfibos.com:9870",
		//"to-p2p.fibos.io:9870",
		//"185.133.193.1:9870",
		"p2p.fibosutility.com:9870",
		"fibos.qubitfund.com:9870",
		"p2p-mainnet.qingah.com:9876"
	],
	"max-clients": 100,
	"p2p-listen-endpoint": "0.0.0.0:9870"
});

var chain_config = {
	"contracts-console": true,
	'chain-state-db-size-mb': 8 * 1024,
	// "delete-all-blocks": true
};

if (!fs.exists(fibos.data_dir) && !fs.exists(fibos.config_dir)) {
	chain_config['genesis-json'] = "genesis.json";
}

fibos.load("producer", {
	'enable-stale-production': true,
	'max-transaction-time': 3000
});

fibos.load("chain", chain_config);
fibos.load("chain_api");
fibos.load("history");
fibos.load("history_api");

fibos.start();