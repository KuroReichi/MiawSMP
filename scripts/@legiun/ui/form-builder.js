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
				`§bName		§3: §f${target.name} §g(§e${player.get("class")?.name ?? "Unemployed"}§g)`, // Double comma index tidak error
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

			v.show(player).then((response) => {
				if (response.canceled || response.cancelationReason) return;
				switch (response.selection) {
					case 0:
						Interface.debug.main(player);
						break;
					case 1:
						this.playerDB(player, 1);
						break;
					case 2:
						this.globalDB(player);
						break;
					case 3:
						break;
				}
			});
		},
		playerDB: function (player, page = 1) {
			const data = database.get("registered-player") ?? [];
			const maxPage = Math.ceil(data.length / this.PageDivider) || 1;

			if (page < 1) page = 1;
			if (page > maxPage) page = maxPage;

			const start = (page - 1) * this.PageDivider;
			const end = start + this.PageDivider;
			const list = data.slice(start, end);

			const v = new ActionFormData();
			v.title(`Player Database ${page}/${maxPage}`);
			v.button("Back", "textures/@legiun/arrow/prev.png");
			v.button("Search", "textures/ui/magnifyingGlass");
			v.divider();

			list.forEach((id) => {
				v.button(String(id));
			});

			if (maxPage > 1) {
				v.divider();
				if (page > 1) v.button("Prev", "textures/@legiun/arrow/prev.png");
				if (page < maxPage) v.button("Next", "textures/@legiun/arrow/next.png");
			}

			v.show(player).then((response) => {
				if (response.canceled || response.cancelationReason) return;
				const baseIndex = 2;

				if (response.selection === 0) {
					this.main(player);
				} else if (response.selection === 1) {
					this.playerDB(player, page);
				} else if (response.selection >= baseIndex && response.selection < baseIndex + list.length) {
					const index = response.selection - baseIndex;
					const selected = list[index];
				} else {
					let offset = baseIndex + list.length;

					if (maxPage > 1) {
						offset += 1;
						if (page > 1 && response.selection === offset) {
							this.playerDB(player, page - 1);
							return;
						}
						if (page < maxPage) {
							const nextIndex = page > 1 ? offset + 1 : offset;
							if (response.selection === nextIndex) {
								this.playerDB(player, page + 1);
								return;
							}
						}
					}
				}
			});
		},
		globalDB: function (player) {
			const v = new ActionFormData();
			v.title(`Global Database`);
			v.button("Back", "textures/@legiun/arrow/prev.png");

			database.getAllBy().forEach((data) => {
				v.button(data.id);
			});

			v.show(player).then((response) => {
				if (response.canceled || response.cancelationReason) return;
				if (response.selection === 0) {
					this.main(player);
				}
			});
		}
	},
	gamerules: function (player) {
		const v = new ModalFormData();
		v.title("Gamerule Settings");

		Object.entries(world.gameRules).forEach(([name, value]) => {
			if (typeof value === "number") {
				if (name === "playersSleepingPercentage") {
					v.slider(name, 0, 101, {
						defaultValue: value
					});
				} else {
					v.slider(name, 0, value, {
						defaultValue: value
					});
				}
			} else if (typeof value === "boolean") {
				v.toggle(name, {
					defaultValue: value
				});
			}
		});
		v.submitButton("Submit Changes");
		v.show(player).then((response) => {
			if (response.canceled || response.cancelationReason) return;
			let i = 0;
			Object.entries(world.gameRules).forEach(([name, value]) => {
				const newValue = response.formValues[i++];
				if (newValue !== undefined) {
					world.gameRules[name] = newValue;
				}
			});
		});
	},
	main: function (player) {
		const v = new ActionFormData();
		v.title("Debugging");
		v.button("Database", "textures/ui/icon_book_writable");
		v.button("Gamerules", "textures/ui/settings_pause_menu_icon");

		v.show(player).then((response) => {
			if (response.canceled || response.cancelationReason) return;
			switch (response.selection) {
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
