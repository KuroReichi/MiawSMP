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
		db.set("playtime.seconds", 0, player.name);
		db.set("playtime.minutes", 0, player.name);
		db.set("playtime.hours", 0, player.name);
		db.set("nirvane.amount", configs.gameplay.initial, player.name);
		db.set("nirvane.maxAmount", configs.gameplay.initial, player.name);
		db.set("nirvane.regenAmount", configs.gameplay.regenAmount, player.name);
		db.set("nirvane.regenTime", configs.gameplay.regenTime, player.name);
		new ActionFormData()
		.title("Select Your Class")
		.button("Aether Vanguard")
		.button("Lunaris Arcanist")
		.button("Seraphine Warden")
		.show(player).then(response => {
			
		})
		world.sendMessage(`§2§l» §r§aWelcome §7${player.name}! §7to §bMiaw§3SMP§f: §dThe Covenant of Past§7.`);
	} else {
		player.sendMessage(`§2§l» §r§aWelcome back §7${player.name}`);
	}
});

world.afterEvents.playerBreakBlock.subscribe((event) => {
	db.incValue("block.break", 1, event.player.name);
});
world.afterEvents.playerPlaceBlock.subscribe((event) => {
	db.incValue("block.place", 1, event.player.name);
});
world.afterEvents.playerInteractWithBlock.subscribe((event) => {
});