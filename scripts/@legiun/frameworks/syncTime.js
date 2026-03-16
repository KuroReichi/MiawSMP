import { world, system } from "@minecraft/server";
import database from "../database.js";
const TIMEZONE = "Asia/Jakarta";

/**
 * --------------------------------------------------
 * @name getTimezoneLoc
 * @description Get current Jakarta time using Date API
 * @function
 * --------------------------------------------------
 */

function getTimezoneLoc() {
	const date = new Date();
	const timez = new Date(date.toLocaleString("en-US", { timeZone: database.get("timezone.location") ?? TIMEZONE }));

	return {
		hour: timez.getHours(),
		minute: timez.getMinutes(),
		second: timez.getSeconds()
	};
}

/**
 * --------------------------------------------------
 * @name getMinecraftTimeFromIRL
 * @description Convert IRL Time with specific timezone into Minecraft ticks
 * @function
 * --------------------------------------------------
 */
function getMinecraftTimeFromIRL() {
	const { hour, minute, second } = getTimezoneLoc();
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
