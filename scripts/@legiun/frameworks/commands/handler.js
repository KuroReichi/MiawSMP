import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommands, CommandQueue } from "./registry.js";
import database from "../../database.js";

if (configs.commandPrefix.startsWith("/")) {
	console.info(`§4[§cERROR§4]§7: §eat §ghandler.js`);
	console.info(
		`    The prefix: ">> ${configs.commandPrefix.substr(configs.commandPrefix.indexOf("/"), 1)} << ${configs.commandPrefix.slice(configs.commandPrefix.indexOf("/") + 1, 3)}${configs.commandPrefix.length >= 3 ? "..." : ""}", cannot starts with a slash (/).`
	);
	configs.commandPrefix = "!";
	console.info(`§2[§aINFO§2]§7: §fChanged the prefix to standard character, now the prefix is "!".`);
}

/**
 * --------------------------------------------------
 * @name getDistance
 * @description Calculate distance between two entities or locations in 3D space
 * @function
 * @param {Entity|Vector3} a - First entity or location
 * @param {Entity|Vector3} b - Second entity or location
 * @returns {number}
 * --------------------------------------------------
 */

function getDistance(a, b) {
	const posA = a.location ?? a;
	const posB = b.location ?? b;

	const dx = posA.x - posB.x;
	const dy = posA.y - posB.y;
	const dz = posA.z - posB.z;

	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

world.beforeEvents.chatSend.subscribe(async (event) => {
	let query = event.message;
	if (query.startsWith(configs.commandPrefix)) {
		event.cancel = true;

		query =
			event.message
				.slice(configs.commandPrefix.length)
				.trim()
				.match(/"[^"]*"|'[^']*'|`[^`]*`|\S+/g) ?? [];
		query = query.map((v) => v.replace(/^["'`]|["'`]$/g, ""));

		if (!configs.server.staff.includes(event.sender.name)) console.info(`${event.sender.name}: ${event.message}`);
		CommandQueue(event.sender, query).then((response) => {
			const logs = database.get("command-logs") ?? new Array();

			logs.push({
				sender: event.sender.name,
				status: response.status,
				message: response.message
			});

			if (logs.length > 100) logs.shift();
			database.set("command-logs", logs);
		});
	} else {
		event.cancel = true;
		console.info(`${event.sender.name}: ${event.message}`);
		const logs = database.get("chat-logs") ?? new Array();

		logs.push({
			playerName: event.sender.name,
			message: event.message
		});
		if (logs.length > 100) logs.shift();
		database.set("chat-logs", logs);
	}
});
