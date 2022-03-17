/** @param {NS} ns **/
export async function main(ns) {
	var quantity = ns.args[0];
	var ram = 1024;
	var hostname = 's';

	for (var i = 0; i < quantity; i++) {
		if (ns.getPurchasedServers().length === ns.getPurchasedServerLimit()) {
			ns.tprint('Server limit reached.');
			return
		}
		ns.purchaseServer(hostname, ram);
	}
}