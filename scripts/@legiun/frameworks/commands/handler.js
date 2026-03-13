import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommands, CommandQueue } from "./registry.js";

if (configs.commandPrefix.startsWith("/")) {
	console.info(`§4[§cERROR§4]§7: §eat §ghandler.js`);
	console.info(
		`    The prefix: ">> ${configs.commandPrefix.substr(configs.commandPrefix.indexOf("/"), 1)} << ${configs.commandPrefix.slice(configs.commandPrefix.indexOf("/") + 1, 3)}${configs.commandPrefix.length >= 3 ? "..." : ""}", cannot starts with a slash (/).`
	);
	configs.commandPrefix = "!";
	console.info(`§2[§aINFO§2]§7: §fChanged the prefix to standard character, now the prefix is "!".`);
}

world.beforeEvents.chatSend.subscribe(async (event) => {
	let query = event.message;
	if (query.startsWith(configs.commandPrefix)) {
		event.cancel = true;
		
		query = event.message
			.slice(configs.commandPrefix.length)
			.trim()
			.match(/"[^"]*"|'[^']*'|`[^`]*`|\S+/g);
		query = query.map((v) => v.replace(/^["'`]|["'`]$/g, ""));

		if (!configs.server.staff.includes(event.sender.name)) console.info(`${event.sender.name}: ${event.message}`);
		CommandQueue(query).then((response) => {
			const logs = database.get("log-commands");

logs.push({
	sender: event.sender,
	status: response.status,
	message: response.message
});

database.set("log-commands", logs);

			// Maximum Data (Default: 100)
			if (database.get("log-commands").length >= 100 /* <== change the value */) database.set("log-commands", database.get("log-commands").slice(1));
		});
	} else {
		event.cancel = true;
		console.info(`${event.sender.name}: ${event.message}`);
	}
});
