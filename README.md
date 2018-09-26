
steps:

	1. install fibos 
		curl -s https://fibos.io/download/installer.sh |sh
	2. fibos bp.js   //bp node start
	3. fibos full.js // full node start
	4. fibos seed.js // seed node start

tips:
	
	netstat -aln|grep  '内网ip:9870' | grep -c 'ESTABLISHED'    //find how many people connet you


