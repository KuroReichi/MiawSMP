import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import database from "./../database.js";
import { configs } from "./../../configs.js";

const Interface = {};

Interface.profile = async function (target, viewer, fromUI) {
	const v = new ActionFormData();
	const player = database.player(target);
	let JoinDate =
		new Date(player.get("joinedAt")).toLocaleTimeString("id-ID", {
			timeZone: database.get("timezone.location") ?? "Asia/Jakarta",
			timeZoneName: "short",
			hour: "2-digit",
			minute: "2-digit",
			hour12: false
		}) +
		", " +
		new Date(player.get("joinedAt"))
			.toLocaleDateString("id-ID", {
				weekday: "long",
				day: "numeric",
				month: "long",
				year: "numeric"
			})
			.replace(",", "");
	if (viewer === "self") {
		v.title("Profile");
	} else {
		v.title(`${target.name}'s Profile`);
		v.body(
			[
				`§7Joined at §f${JoinDate}`,
				`§bName		§3: §f${target.name} §g(§e${player.get("class")?.name ?? "Pengangguran"}§g)`, // Double comma index tidak error
				,
				`§bFaction	§3: §f${player.get("faction").name}`,
				`§bPlayTime	§3:`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") / 86400), 0)} §bDays`,
				`	§3» §f${Math.max(Math.floor((player.get("playtime") % 86400) / 3600), 0)} §bHours`,
				`	§3» §f${Math.max(Math.floor((player.get("playtime") % 3600) / 60), 0)} §bMinutes`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") % 60), 0)} §bSeconds`
			].join("\n")
		);
	}
	const r = await v.show(player);
};

Interface.debug = {
	database: {
		PageDivider: 10,
		main: function (player) {
			const v = new ActionFormData();
			v.title("Database");
			v.button("Back", "textures/@legiun/arrow/prev.png");
			v.button("PlayerDB", "textures/@legiun/interface/database.png");
			v.button("GlobalDB", "textures/@legiun/interface/database.png");
			v.button("Others", "textures/ui/icon_setting");
		},
		playerDB: function (player, page = 1) {
			const maxPage = math.ceil(database.get("registered-player").length / this.PageDivider);
			const v = new ActionFormData();
			v.title(`Player Database ${page} of ${maxPage}`);
		},
		globalDB: function (player) {
			const v = new ActionFormData();
			v.title(`Global Database`);
		}
	},
	gamerules: function (player) {
		const v = new ModalFormData();
		v.title("Gamerule Settings");
		Object.entries(world.gameRules).forEach(([name, value], position) => {
			console.info(`${name}: ${value} > ${typeof value}`);
		});
	},
	main: function (player) {
		const v = new ActionFormData();
		v.title("");
		v.button("Database", "textures/ui/icon_book_writable");
		v.button("Gamerules", "textures/ui/settings_pause_menu_icon");

		v.show(player).then((response) => {
			if (response.canceled || response.cancelationReason) return;
			switch (respony.selection) {
				default:
					break;
				case 0:
					this.database.main(player);
					break;
				case 1:
					this.gamerules(player);
					break;
			}
		});
	}
};
export { Interface };
