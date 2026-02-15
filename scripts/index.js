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

import { EntityComponentTypes, ItemStack, system, world } from "@minecraft/server";
import { uiManager, ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { db } from "@minecraft/database.js";
import { configs, PlayerClass } from "./configs.js";

world.afterEvents.worldLoad.subscribe(() => {
	console.info("MIAW's Core Loaded");
	db.set("server.dateCreated", new Date().valueOf(), "global", false);
	db.set("server.uptime", new Date().valueOf(), "global", true);
});

world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
	if (event.itemStack.typeId === undefined) {
		if (db.player(event.target.name).get("allowRider") === true && event.player.isSneaking === false) {
		} else {
			event.player.sendMessage("§4»§a Pemain ini tidak mengizinkanmu menungganginya.");
			event.player.playSound("notify.error");
		}
	} else if (event.itemStack.typeId === "minecraft:name_tag") event.cancel = true;
});

world.afterEvents.playerSpawn.subscribe((event) => {
	const player = event.player;
	if (event.initialSpawn === true) {
		// Data
		db.set(
			{
				"date.firstJoin": new Date().valueOf(),
				"date.lastSeen": false,
				"block.place": 0,
				"block.break": 0,
				"mobs.kill": {
					count: 0,
					list: []
				},
				"player.kill": {
					count: 0, 
					list: []
				}
			},
			player.name,
			false
		);

		// Attributes
		db.set(
			{
				"health": 100,
				"physical.atk": 0,
				"physical.def": 0,
				"magic.power": 0,
				"magic.def": 0,
				"nirvane.current": 0,
				"nirvane.regenAmount": 0,
				"nirvane.regenTime": 0,
				"energy.current": 0,
				"energy.regenAmount": 0,
				"energy.regenTime": 0
			},
			player.name,
			false
		);
	} else {
	}
});
