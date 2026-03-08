import { registerCommand } from "../frameworks/commands/registry.js";
import { world } from "@minecraft/server";

//===================================================================================
/**
 *	@name payCommand
 *	@description - Mengirim uang ke player lain menggunakan sistem scoreboard.
 *	Syntax: /pay <player> <amount>
 */
//===================================================================================

const OBJECTIVE = "money";

registerCommand({
	name: "q:pay",
	description: "Send money to another player",
	build(root) {
		root
			.playerSelector("player")
			.integer("amount")
			.executes((ctx) => {
				const sender = ctx.source;
				const targets = ctx.args.player;
				const amount = ctx.args.amount;
				if (amount <= 0) {
					sender.sendMessage("§cAmount must be greater than 0.");
					return;
				}
				const senderMoney = database.player(sender).get("money") ?? 0;
				if (senderMoney < amount) {
					sender.sendMessage("§cYou don't have enough money.");
					return;
				}
			});
	}
});