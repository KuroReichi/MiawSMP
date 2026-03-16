import { registerCommand } from "../frameworks/commands/registry.js";
import database from "../database.js";

/**
 * --------------------------------------------------
 * @name payCommand
 * @description Transfer money to another player
 * @function
 * @param {Player} player
 * @param {object} args
 * --------------------------------------------------
 */
function payCommand(player, args) {
	const target = args.playerName;
	const amount = args.amount;

	if (target.id === player.id) {
		player.sendMessage("§cYou cannot pay yourself.");
		return;
	}
	if (amount < 0.01) {
		player.sendMessage("§cMinimum transfer amount is §e0.01§c.");
		return;
	}
	const senderDB = database.player(player);
	const targetDB = database.player(target);

	const senderBalance = senderDB.get("money") ?? 0;

	if (senderBalance < amount) {
		player.sendMessage("§cYou don't have enough money.");
		return;
	}

	// transfer
	senderDB.remove("money", amount);
	targetDB.add("money", amount);

	player.sendMessage(`§aYou paid §e${target.name} §a${amount}.`);
	target.sendMessage(`§aYou received §e${amount} §afrom §e${player.name}§a.`);
}

//===================================================================================
registerCommand({
	name: "pay",
	description: "Transfer money to another player",

	children: [
		{
			type: "argument",
			name: "playerName",
			argType: "player",

			children: [
				{
					type: "argument",
					name: "amount",
					argType: "number",

					run: payCommand
				}
			]
		}
	]
});
