import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

const prefix = configs.commandPrefix;

if (prefix.startsWith("/")) {
	console.info(`§4[§cERROR§4]§7: §eat §ghandler.js`);
	console.info(`    The prefix: ">> ${prefix.substr(prefix.indexOf("/"), 1)} << ${prefix.slice(prefix.indexOf("/") + 1, 3)}${prefix.length >= 3 ? "..." : ""}", cannot starts with a slash (/).`);
	configs.commandPrefix = "!";
	prefix = "!";
	console.info(`§2[§aINFO§2]§7: §fChanged the prefix to standard character, now the prefix is "!".`);
}

world.beforeEvents.chatSend.subscribe((event) => {
	if (event.message.startsWith(prefix)) {
		event.cancel = true;
		if (!configs.server.staff.includes(event.sender.name)) console.info(`${event.sender.name}: ${event.message}`);
	} else {
		event.cancel = true;
		console.info(`${event.sender.name}: ${event.message}`);
	}
});
