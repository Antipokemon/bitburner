/** @param {NS} ns **/
export async function main(ns) {
	// Variables
	var targets = ['home'];
	var threads = 1;
	var servers = ns.getPurchasedServers();
	var growScriptRAM = ns.getScriptRam('grow.js');
	var weakenScriptRam = ns.getScriptRam('weaken.js');
	// var hackScriptRam = ns.getScriptRam('hack.js');
	var maxThreads;
	var maxServerRam;
	
	// scan for all servers
	for (var i = 0; i < targets.length; i++) {
		var currentScan = ns.scan(targets[i]);
		for (var j = 0; j < currentScan.length; j++) {
			if (targets.indexOf(currentScan[j]) === -1) {
				targets.push(currentScan[j]);
			}
		}
	}
	// remove purchase servers from targets
	for (var i = 0; i < servers.length; i++) {
		if (targets.indexOf(servers[i] != -1)) {
			targets.splice(targets.indexOf(servers[i]), 1);
		}
	}
	targets.splice(targets.indexOf('home'), 1);
	// remove targets with high level
	for (var i = 0; i < targets.length; i++) {
		if (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(targets[i]) || ns.getServerMaxMoney(targets[i]) === 0) {
			targets.splice(targets.indexOf(targets[i]), 1);
			i--;
		}
	}
	// scp to owned servers
	for (var i = 0; i < servers.length; i++){
		await ns.scp('weaken.js', 'home', servers[i]);
		await ns.scp('grow.js', 'home', servers[i]);
		await ns.scp('hack.js', 'home', servers[i]);
		await ns.scp('nuke.js', 'home', servers[i]);
	}
	// scp to targets
	for (var i = 0; i < targets.length; i++) {
		await ns.scp('weaken.js', 'home', targets[i]);
		await ns.scp('grow.js', 'home', targets[i]);
		await ns.scp('nuke.js', 'home', targets[i]);
	}
	// Check if target is nukeable
	for (var i = 0; i < targets.length; i++) {
		// If nukeable, run nuke.js
		if (ns.getHackingLevel() >= ns.getServerRequiredHackingLevel(targets[i])){
			if (!ns.hasRootAccess(targets[i])) {
				ns.exec('nuke.js', 'home', threads, targets[i]);
			}
		}
	}
	// Run on owned servers
	for (var i = 0; i < servers.length; i++) {
		// Get Purchased Server Max RAM
		maxServerRam = ns.getServerMaxRam(servers[i]);
		maxThreads = Math.floor((maxServerRam / (growScriptRAM + weakenScriptRam)));
		threads = Math.floor(maxThreads/targets.length);
		ns.tprint('server: ', servers[i], ' RAM: ', maxServerRam, ' maxThreads: ', maxThreads, ' threads: ', threads, ' targets: ', targets.length);
		ns.killall(servers[i]);
		
		for (var j = 0; j < targets.length; j++) {
			if (ns.hasRootAccess(targets[j])) {
				// Grow
				ns.exec('grow.js', servers[i], threads, targets[j]);
				// Weaken
				ns.exec('weaken.js', servers[i], threads, targets[j]);
				// Hack
				ns.exec('hack.js', 'home', 1, targets[j]);
			} 
		}
	}
	//Run on target servers
	for (var i = 0; i < targets.length; i++) {
		if (ns.hasRootAccess(targets[i])) {
			ns.killall(targets[i]);
			// Get target max RAM
			maxServerRam = ns.getServerMaxRam(targets[i]);
			threads = Math.floor((maxServerRam - ns.getServerUsedRam(targets[i])) / (growScriptRAM + weakenScriptRam));
			if (threads >= 1) {
				ns.exec('weaken.js', targets[i], threads, targets[i]);
				ns.exec('grow.js', targets[i], threads, targets[i]);
			}
		}
	}
}