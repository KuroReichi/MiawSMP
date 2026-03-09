import { world } from "@minecraft/server";
import { getCommand } from "./registry.js";

const PREFIX = "!";

function parseParam(type, value) {
	if (type === "number") {
		const n = Number(value);
		if (isNaN(n)) return undefined;
		return n;
	}
	if (type === "string") return value;
	return value;
}

world.beforeEvents.chatSend.subscribe((event) => {
	const msg = event.message;
	if (!msg.startsWith(PREFIX)) return;
	event.cancel = true;
	const sender = event.sender;
	const args = msg.slice(PREFIX.length).trim().split(/\s+/);
	const name = args.shift()?.toLowerCase();
	const command = getCommand(name);

	if (!command) {
		sender.sendMessage("§cUnknown command.");
		return;
	}
	if (!command.literals) {
		command.execute?.(sender, args);
		return;
	}
	const literalName = args.shift()?.toLowerCase();
	const literal = command.literals.find((l) => l.name === literalName);

	if (!literal) {
		sender.sendMessage("§cInvalid subcommand.");
		return;
	}
	for (const overload of literal.overloads) {
		const params = {};
		let valid = true;
		for (let i = 0; i < overload.params.length; i++) {
			const param = overload.params[i];
			const value = parseParam(param.type, args[i]);

			if (value === undefined) {
				valid = false;
				break;
			}
			params[param.name] = value;
		}

		if (!valid) continue;

		try {
			overload.execute(sender, params);
			return;
		} catch (e) {
			console.warn(e);
			sender.sendMessage("§cCommand error.");
			return;
		}
	}
	sender.sendMessage("§cInvalid command usage.");
});
