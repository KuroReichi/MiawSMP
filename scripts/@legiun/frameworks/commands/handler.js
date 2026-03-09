import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

if (configs.commandPrefix.includes("/")) {
	console.info(`§4[§cError§4]§7: §g(§eat §fhandler.js§g)\n    §9pPrefix cannot contain a slash "/"§3..`);
	configs.commandPrefix = "!";
	console.info(`§2[§aInfo§2]§7: §fChange the prefix to standard characters, now the prefix is "!".`);
}

world.beforeEvents.chatSend.subscribe((event) => {
	if (event.message.startsWith(configs.commandPrefix)) {
		if(!configs.server.staff.includes(event.sender.name))
			console.info(`${event.sender.name}: ${event.message}`);
			
			
	} else {
	}
});
