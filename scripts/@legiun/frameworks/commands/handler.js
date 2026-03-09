import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

if(configs.commandPrefix)
world.beforeEvents.chatSend.subscribe((event) => {
	if (event.message.startsWith(configs.commandPrefix)) {
		
	}
});
