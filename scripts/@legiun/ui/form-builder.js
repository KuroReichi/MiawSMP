import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import database from "./../database.js";
import { configs } from "./../../configs.js";

const Interface = {};
Interface.profile = function (target, viewer) {
	const v = new ActionFormData();
	const player = database.player(target);
	if (viewer === "self") {
		v.title("Profile");
	} else {
		v.title(`${target.name}'s Profile`);
		v.body(
			[
				// Interface Pemain Lain
				`§bName		§3: §f${target.name}`,
				`§bFaction	§3: §f${player.get("faction").name}`,
				`§bPlayTime	§3:`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") / 86400), 0)} §bDays`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") % 86400) / 3600, 0)} §bHours`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") % 3600) / 60, 0)} §bMinutes`,
				`	§3» §f${Math.max(Math.floor(player.get("playtime") % 60), 0)} §bSeconds`
			].join("\n")
		);
	}
};
Interface.messager = {
	name: "WhatsApp Messager",
	getFollowers: function (player) {},
	home: function (player, fromUI) {
		const v = new ActionFormData();
		v.title(this.name);
		if (fromUI) v.button("Back");
		v.button("Add Friends").button(`Incoming Followers §g(§e${this.getFollowers(player)}§g)§r`);
		v.divider();
	}
};

export default Interface;
