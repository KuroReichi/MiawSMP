import { registerCommand } from "../frameworks/commands/registry.js";
import database from "../database.js";

//===================================================================================
/**
 *	@name payCommand
 *	@description - Mengirim uang ke player lain menggunakan sistem database
 *	dynamic property. Syntax: /q:pay <player> <amount>
 */
//===================================================================================

const MONEY_ID = "money";

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
				const senderDB = database.player(sender);
				let senderMoney = senderDB.get(MONEY_ID) ?? 0;
				if (senderMoney < amount) {
					sender.sendMessage("§cYou don't have enough money.");
					return;
				}
				for (const target of targets) {
					if (target.id === sender.id) {
						sender.sendMessage("§cYou cannot pay yourself.");
						continue;
					}
					const targetDB = database.player(target);
					let targetMoney = targetDB.get(MONEY_ID) ?? 0;

					senderMoney -= amount;
					targetMoney += amount;

					targetDB.set(MONEY_ID, targetMoney);
					target.sendMessage(`§aYou received §e${amount}§a from §b${sender.name}`);
				}
				senderDB.set(MONEY_ID, senderMoney);
				sender.sendMessage(`§aPaid §e${amount}`);
			});
	}
});