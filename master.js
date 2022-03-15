/** @param {NS} ns **/
export async function main(ns) {
	var targets = ['n00dles', 'foodnstuff', 'sigma-cosmetics', 'joesguns', 'nectar-net', 'hong-fang-tea', 'harakiri-sushi'];
	var threads = 2;
	var locations = 'nectar-net'
	//var locations = ns.getPurchasedServers();

	//for (var i = 0; i < locations.length; i++) {

		//ns.killall(locations[i]);
	for (var j = 0; j < targets.length; j++) {
		// Grow
		ns.exec("grow.js", locations, threads, targets[j]);//locations[i], threads, targets[j]);
		// Weaken
		ns.exec("weaken.js",locations,threads,targets[j]);//locations[i], threads, targets[j]);
		// Hack
		//ns.exec('hack.js', locations, threads, targets[j]);
		}
	//}
}
