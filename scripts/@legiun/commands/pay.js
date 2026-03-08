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
	name: "pay",
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
				const objective = world.scoreboard.getObjective(OBJECTIVE);
				if (!objective) {
					sender.sendMessage("§cMoney scoreboard not found.");
					return;
				}
				const senderScore = objective.getScore(sender) ?? 0;
				if (senderScore < amount) {
					sender.sendMessage("§cYou don't have enough money.");
					return;
				}
				for (const target of targets) {
					if (target.id === sender.id) {
						sender.sendMessage("§cYou cannot pay yourself.");
						continue;
					}
					const targetScore = objective.getScore(target) ?? 0;
					objective.setScore(sender, senderScore - amount);
					objective.setScore(target, targetScore + amount);
					target.sendMessage(`§aYou received §e${amount}§a from §b${sender.name}`);
				}
				sender.sendMessage(`§aPaid §e${amount}`);
			});
	}
});