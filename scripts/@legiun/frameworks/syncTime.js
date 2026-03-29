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
 * @name getDayPassed
 * @description Hitung hari berdasarkan tanggal (00:00 reset)
 * --------------------------------------------------
 */
function getDayPassed() {
	const start = database.get("server.startDate", "server");
	if (!start) return 0;

	const tz = database.get("timezone.location") ?? "Asia/Jakarta";

	const startDate = new Date(new Date(start).toLocaleString("en-US", { timeZone: tz }));

	const nowDate = new Date(new Date().toLocaleString("en-US", { timeZone: tz }));

	// reset jam ke 00:00
	startDate.setHours(0, 0, 0, 0);
	nowDate.setHours(0, 0, 0, 0);

	const diff = nowDate - startDate;

	return Math.max(Math.floor(diff / 86400000), 0);
}

/**
 * --------------------------------------------------
 * @name startWorldTimeSync
 * @description Sync Minecraft world time + scaling day
 * --------------------------------------------------
 */

export function startWorldTimeSync() {
	system.runInterval(() => {
		const ticks = getMinecraftTimeFromIRL();
		const days = getDayPassed();

		const finalTime = ticks + Math.floor(days * 24000);

		world.getDimension("overworld").runCommand(`time set ${finalTime}`);
	}, 5);
}
