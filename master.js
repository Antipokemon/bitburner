/** @param {NS} ns **/
export async function main(ns) {
	// Variables
	var targets = ['n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns', 'nectar-net', 'hong-fang-tea', 'harakiri-sushi', 'neo-net', 'zer0', 'max-hardware', 'iron-gym', 'phantasy',
	 'silver-helix', 'omega-net', 'avmnite-02h', 'crush-fitness', 'johnson-ortho', 'the-hub'];
	var threads = 1;
	var servers = ns.getPurchasedServers();
	var growScriptRAM = ns.getScriptRam('grow.js');
	var weakenScriptRam = ns.getScriptRam('weaken.js');
	var hackScriptRam = ns.getScriptRam('hack.js');
	var maxThreads;
	var maxServerRam;
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
				
		ns.killall(servers[i]);
		
		for (var j = 0; j < targets.length; j++) {
			if (ns.hasRootAccess(targets[j])) {
				// Get Purchased Server Max RAM
				maxServerRam = ns.getServerMaxRam(servers[i]);
				maxThreads = Math.floor((maxServerRam / (growScriptRAM + weakenScriptRam + hackScriptRam)));
				threads = Math.floor(maxThreads/targets.length);
				// Grow
				ns.exec('grow.js', servers[i], threads, targets[j]);
				// Weaken
				ns.exec('weaken.js', servers[i], threads, targets[j]);
				// Hack
				ns.exec('hack.js', servers[i], threads, targets[j]);
			} else {
				ns.trpint('No root access on ' + targets[j]);
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