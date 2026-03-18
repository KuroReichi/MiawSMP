import { system } from "@minecraft/server";
import { Interface } from "../ui/form-builder.js";

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
			 * @returns {object}
			 * #initiator<Entity>
			 * #sourceBlock<Block>
			 * #sourceEntity<Entity>
			 * #sourceType<CustomCommandSource>
			 */
			if (origin.sourceType !== "Entity" || origin.sourceEntity?.typeId !== "minecraft:player") {
				console.error("Only player can access this command.");
				return;
			}
			Interface.chat.home(origin.sourceEntity);
		}
	);
});
