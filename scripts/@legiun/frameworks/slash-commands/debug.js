/**
 * =========================================
 * @name registerDebugCommand
 * @description Register custom command "q:debug" untuk membuka UI debug
 * @function
 * =========================================
 */
import { world, system } from "@minecraft/server";
import { Interface } from "../../ui/form-builder.js";

system.beforeEvents.startup.subscribe((event) => {
	const registry = event.customCommandRegistry;

	registry.registerCommand({
		name: "q:debug",
		description: "Open Debug Menu",
		permissionLevel: 0,
		overloads: [
			{
				parameters: [],
				handler(origin) {
					try {
						const player = origin.sourceEntity;
						if (!player) return;

						system.run(() => {
							Interface.debug.main(player);
						});
					} catch {}
				}
			}
		]
	});
});
