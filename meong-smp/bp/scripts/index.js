//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░███╗░░░███╗██╗░█████╗░░██╗░░░░░░░██╗░░░░░░░░░░░░
//░░░████╗░████║██║██╔══██╗░██║░░██╗░░██║░░░░░░░░░░░░
//░░░██╔████╔██║██║███████║░╚██╗████╗██╔╝░░░░░░░░░░░░
//░░░██║╚██╔╝██║██║██╔══██║░░████╔═████║░░░░░░░░░░░░░
//░░░██║░╚═╝░██║██║██║░░██║░░╚██╔╝░╚██╔╝░░░░░░░░░░░░░
//░░░╚═╝░░░░░╚═╝╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░██████╗████████╗██╗░░░██╗██████╗░██╗░█████╗░░░░
//░░░██╔════╝╚══██╔══╝██║░░░██║██╔══██╗██║██╔══██╗░░░
//░░░╚█████╗░░░░██║░░░██║░░░██║██║░░██║██║██║░░██║░░░
//░░░░╚═══██╗░░░██║░░░██║░░░██║██║░░██║██║██║░░██║░░░
//░░░██████╔╝░░░██║░░░╚██████╔╝██████╔╝██║╚█████╔╝░░░
//░░░╚═════╝░░░░╚═╝░░░░╚═════╝░╚═════╝░╚═╝░╚════╝░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

import { world, system } from "@minecraft/server";
import { uiManager, ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { configs } from "./configs.js";
import { db } from "@minecraft/database.js";

world.afterEvents.playerSpawn.subscribe((event) => {
	if (event.initialSpawn === false) return;
	const player = event.player;

	if (!db.get("isMember", player.name)) {
		db.set("isMember", true, player.name);
		db.set("server.firstJoinDate", new Date().valueOf(), player.name);
		db.set("server.loginStreak", 0, player.name);
		db.set("block.place", 0, player.name);
		db.set("block.break", 0, player.name);
		db.set("kills", 0, player.name);
		db.set("deaths", 0, player.name);
		db.set("", 0, player.name);
		db.set("nirvane.amount", configs.gameplay.initial, player.name);
		db.set("nirvane.maxAmount", configs.gameplay.initial, player.name);
		db.set("nirvane.regenAmount", configs.gameplay.regenAmount, player.name);
		db.set("nirvane.regenTime", configs.gameplay.regenTime, player.name);
		player.sendMessage(`§2§l» §r§aWelcome §7${player.name}! §fYou're new here!`);
	} else {
		player.sendMessage(`§2§l» §r§aWelcome back §7${player.name}`);
	}
});

world.beforeEvents.playerBreakBlock.subscribe((event) => {
	console.info(1)
});