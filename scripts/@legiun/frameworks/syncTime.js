import { world, system } from "@minecraft/server";

const TIMEZONE = "Asia/Jakarta";

/**
 * --------------------------------------------------
 * @name getJakartaTime
 * @description Get current Jakarta time using Date API
 * @function
 * --------------------------------------------------
 */
function getJakartaTime() {
	const date = new Date();
	const jakarta = new Date(date.toLocaleString("en-US", { timeZone: TIMEZONE }));

	return {
		hour: jakarta.getHours(),
		minute: jakarta.getMinutes(),
		second: jakarta.getSeconds()
	};
}

/**
 * --------------------------------------------------
 * @name getMinecraftTimeFromIRL
 * @description Convert IRL time (Jakarta) into Minecraft ticks
 * @function
 * --------------------------------------------------
 */
function getMinecraftTimeFromIRL() {
	const { hour, minute, second } = getJakartaTime();
	const irlHours = hour + minute / 60 + second / 3600;
	let mcHours = irlHours - 6;
	if (mcHours < 0) mcHours += 24;
	return Math.floor(mcHours * 1000);
}

/**
 * --------------------------------------------------
 * @name startWorldTimeSync
 * @description Sync Minecraft world time with Jakarta time
 * @function
 * --------------------------------------------------
 */
export function startWorldTimeSync() {
	system.runInterval(() => {
		const ticks = getMinecraftTimeFromIRL();
		world.getDimension("overworld").runCommand(`time set ${ticks}`);
	}, 5);
}
