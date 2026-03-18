import { system } from "@minecraft/server";
import { UI } from "../ui/form-builder.js";

system.beforeEvents.startup.subscribe((event) => {
	event.customCommandRegistry.registerCommand(
		{
			name: "q:chat",
			description: "Open Chat GUI",
			permissionLevel: 0,
			cheatsRequired: false,
			mandatoryParameters: [],
			optionalParameters: []
		},
		(origin) => {
			/**
			 * @param {CustomCommandOrigin} origin
			 * @returns { initiator, sourceBlock, sourceEntity, sourceType } CustomCommandOrigin
			 */
			if (origin.sourceType !== "Entity" || origin.sourceEntity?.typeId !== "minecraft:player") {
				console.error("Only player can access this command.");
				return;
			}
		}
	);
});
