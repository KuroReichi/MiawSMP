import { system } from "@minecraft/server";

system.beforeEvents.startup.subscribe((event) => {
	event.customCommandRegistry.registerCommand({
		name: "q:chat",
		description: "Open Chat GUI",
		permissionLevel: 0,
		cheatsRequired: false,
		mandatoryParameters: [],optionalParameters: []
	});
});
