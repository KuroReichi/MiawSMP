import { world } from "@minecraft/server";
import { configs } from "./../../../configs.js";
import { getCommand } from "./registry.js";

world.beforeEvents.chatSend.subscribe((event) => {
	if(event.message.startsWith()) {
	}
});
