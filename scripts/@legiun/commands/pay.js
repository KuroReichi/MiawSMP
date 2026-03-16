import { registerCommand } from "../frameworks/commands/registry.js";

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

	//==================================================
	// Example balance logic (replace with your database)
	//==================================================

	const balance = player.getDynamicProperty("money") ?? 0;
	const targetBalance = target.getDynamicProperty("money") ?? 0;

	if (balance < amount) {
		player.sendMessage("§cYou don't have enough money.");
		return;
	}

	player.setDynamicProperty("money", balance - amount);
	target.setDynamicProperty("money", targetBalance + amount);

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