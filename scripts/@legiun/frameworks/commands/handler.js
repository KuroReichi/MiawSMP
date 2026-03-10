import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

if (configs.commandPrefix.startsWith("/")) {
	console.info(`§4[§cERROR§4]§7: §eat §ghandler.js`);
	console.info(`">> ${configs.commandPrefix.substr(configs.commandPrefix.indexOf(query), 1)} <<  ${configs.commandPrefix.slice(configs.commandPrefix.indexOf(query) + 1, 3)}..."`;)
	configs.commandPrefix = "!";
	console.info(`§2[§aINFO§2]§7: §fChange the prefix to standard characters, now the prefix is "!".`);
}

world.beforeEvents.chatSend.subscribe((event) => {
	if (event.message.startsWith(configs.commandPrefix)) {
		event.cancel = true;
		if (!configs.server.staff.includes(event.sender.name)) console.info(`${event.sender.name}: ${event.message}`);
	} else {
		event.cancel = true;
		console.info(`${event.sender.name}: ${event.message}`);
	}
});
