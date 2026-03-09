import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

if (configs.commandPrefix.includes("/")) {
	console.info(`§4[§cError§4]§7: §g(§eat §fhandler.js§g)\n    §9pPrefix cannot contains slash "/"§3..`)
	return;
}
	world.beforeEvents.chatSend.subscribe((event) => {
		if (event.message.startsWith(configs.commandPrefix)) {
		}
	});
