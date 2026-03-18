import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import database from "./../database.js";
import { configs } from "./../../configs.js";

const Interface = {};
Interface.profile = function(target, viewer) {
	const v = new ActionFormData();
	if(viewer === "self") {
		v.title("Profile")
	} else {
		v.title(`${target.name}'s Profile`)
	}
}
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
