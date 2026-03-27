import { system, CustomCommandSource } from "@minecraft/server";
import { Interface } from "../../ui/form-builder.js";

/**
 * =========================================
 * @name registerDebugCommand
 * @description Register custom command "q:debug" untuk membuka UI debug
 * @function
 * =========================================
 */
system.beforeEvents.startup.subscribe((event) => {
	const registry = event.customCommandRegistry;

	registry.registerCommand({
		name: "q:debug",
		description: "Open Debug Menu",
		permissionLevel: 0,
		cheatsRequired: false,
		mandatoryParameters: [],
		optionalParameters: []
	}, (origin) => {
		if (origin.sourceType !== CustomCommandSource.Entity) return;

		const player = origin.sourceEntity;
		if (!player || player.typeId !== "minecraft:player") return;

		Interface.debug.main(player);
	});
});