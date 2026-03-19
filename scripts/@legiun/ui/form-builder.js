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
				`§bName		§3: §f${target.name} §g(§e${player.get("class")?.name ?? "Pengangguran"}§g)`,
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

Interface.messager = {
	name: "Messager",
	getFollowers: function (player) {
		const playerDB = database.player(player).get("followers");
		if (!playerDB) return "";
		return ` §4[§c${playerDB.length}§4]§r`;
	},
	home: async function (player, fromUI) {
		const v = new ActionFormData();
		const playerDB = database.player(player);
		v.title(this.name);
		if (fromUI) v.button("§cBack", "textures/@legiun/arrow/prev.png");

		v.button("Add Friends", "textures/@legiun/interface/add_friends.png");
		v.button(`Incoming Followers${this.getFollowers(player)}`, "textures/@legiun/interface/invitation.png");
		v.divider();
		if (playerDB.get("friend.list")) {
			playerDB.get("friend.list").forEach((friend) => {
				let status = world.getPlayers({ name: friend.name }).length === 1 ? "online" : "offline";
				v.button(`${friend.name}`, `textures/@legiun/gamerpic_${status}.png`);
			});
		} else {
			v.label("§cLooks like you don't have any friends here...");
		}
		const r = await v.show(player);
		if (r.cancelationReason) return;
		switch (r.selection) {
			default:
				this.friendAction(playerDB.get("friend.list")[r.selection - 2], player);
				break;
			case 0:
				this.addFriends(player);
				break;
			case 1:
				this.incomingInvites(player);
		}
	},
	friendAction: async function (target, player) {},
	addFriends: async function (player) {},
	searchPlayers: async function (player) {},
	incomingInvites: async function (player) {}
};

export default Interface;
