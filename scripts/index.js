//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
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
import database from "@legiun/database.js";
import "@legiun/frameworks/commands/handler.js";
import "@legiun/frameworks/commands/loader.js";
import "@legiun/frameworks/slash-commands/loader.js";
import { startWorldTimeSync } from "@legiun/frameworks/syncTime.js";
import { Entity, Player, system, world } from "@minecraft/server";

world.afterEvents.worldLoad.subscribe(() => {
	database.set("server.startDate", new Date().valueOf(), "server", false);
	database.set("server.lastStartDate", new Date().valueOf(), "server", true);
	database.set("timezone.location", "Asia/Jakarta", "global", false);

	startWorldTimeSync();
});
world.afterEvents.playerSpawn.subscribe((event) => {
	const player = event.player;
	const playerDB = database.player(player);
	if (event.initialSpawn === true) {
	} else {
	}
});
//===================================================================================
