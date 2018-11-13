 var runcheck = require('./runinfo');


var buck = {};
var c = 0;
 for(var bnum in runcheck){
 	if(!buck[runcheck[bnum]])buck[runcheck[bnum]] = [];
 	buck[runcheck[bnum]].push(bnum);
 	c++;
 }
 console.log(buck);
 for(var i in buck){
 	 console.log(i,"===>",buck[i].length);
 }


 console.log("count==> ",c);