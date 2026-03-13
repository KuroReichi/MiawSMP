import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommands, pendingCommand } from "./registry.js";

if (configs.commandPrefix.startsWith("/")) {
	console.info(`§4[§cERROR§4]§7: §eat §ghandler.js`);
	console.info(
		`    The prefix: ">> ${configs.commandPrefix.substr(configs.commandPrefix.indexOf("/"), 1)} << ${configs.commandPrefix.slice(configs.commandPrefix.indexOf("/") + 1, 3)}${configs.commandPrefix.length >= 3 ? "..." : ""}", cannot starts with a slash (/).`
	);
	configs.commandPrefix = "!";
	console.info(`§2[§aINFO§2]§7: §fChanged the prefix to standard character, now the prefix is "!".`);
}

world.beforeEvents.chatSend.subscribe(async (event) => {
	const query = event.message;
	if (query.startsWith(prefix)) {
		event.cancel = true;
		query = event.message
			.slice(configs.commandPrefix.length)
			.trim()
			.match(/"[^"]*"|'[^']*'|`[^`]*`|\S+/g)
			.map((v) => v.replace(/^["'`]|["'`]$/g, ""));
		/**
		 * @return {object[]}
		 */
		if (!configs.server.staff.includes(event.sender.name)) console.info(`${event.sender.name}: ${event.message}`);
		CommandQueue(query).then((response) => {
			database.set(
				"log-commands",
				database.get("log-commands").push({
					sender: event.sender,
					status: response.status,
					message: response.message
				})
			);
			// Maximum Data (Default: 100)
			if (database.get("log-commands").length >= 100) database.set("log-commands", database.get("log-commands").slice(1));
		});
	} else {
		event.cancel = true;
		console.info(`${event.sender.name}: ${event.message}`);
	}
});
