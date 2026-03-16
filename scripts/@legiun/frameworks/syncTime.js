import { world, system } from "@minecraft/server";

/**
 * --------------------------------------------------
 * @name getMinecraftTimeFromIRL
 * @description Convert IRL time to Minecraft ticks
 * @function
 * --------------------------------------------------
 */
function getMinecraftTimeFromIRL() {

	const now = Temporal.Now.zonedDateTimeISO();

	const hour = now.hour;
	const minute = now.minute;
	const second = now.second;

	const irlHours = hour + minute / 60 + second / 3600;

	let mcHours = irlHours - 6;
	if (mcHours < 0) mcHours += 24;

	return Math.floor(mcHours * 1000);
}

/**
 * --------------------------------------------------
 * @name startWorldTimeSync
 * @description Sync Minecraft world time with IRL time
 * --------------------------------------------------
 */
export function startWorldTimeSync() {

	system.runInterval(() => {

		const ticks = getMinecraftTimeFromIRL();

		world.getDimension("overworld").runCommand(
			`time set ${ticks}`
		);

	}, 200); // update tiap 10 detik
}