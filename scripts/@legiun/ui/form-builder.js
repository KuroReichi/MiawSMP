import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { system, world } from "@minecraft/server";
import database from "./../database.js";
import { configs } from "./../../configs.js";

const Interface = {};

// PROFILE SEDANG DI KERJAKAN, ABAIKAN SAJA UNTUK SAAT INI!
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

Interface.messager = {
	name: "Messager",

	//==================================================
	// @UTIL
	//==================================================

	getFollowers(player) {
		const data = database.player(player).get("followers") ?? [];
		return data.length > 0 ? ` §4[§c${data.length}§4]§r` : "";
	},

	getFriends(player) {
		return database.player(player).get("friend.list") ?? [];
	},

	getInvites(player) {
		return database.player(player).get("friend.invites") ?? [];
	},

	isOnline(name) {
		return world.getPlayers({ name }).length === 1;
	},

	//==================================================
	// @HOME
	//==================================================

	async home(player, fromUI = false) {
		const v = new ActionFormData();
		const friends = this.getFriends(player);

		v.title(this.name);

		if (fromUI) v.button("§cBack", "textures/@legiun/arrow/prev.png");

		v.button("§aAdd Friends", "textures/@legiun/interface/add_friends.png");
		v.button(`§eIncoming Followers${this.getFollowers(player)}`, "textures/@legiun/interface/invitation.png");

		v.divider();

		if (friends.length === 0) {
			v.label("§cLooks like you don't have any friends here...");
		} else {
			friends.forEach((f) => {
				const status = this.isOnline(f.name) ? "online" : "offline";
				v.button(`${this.isOnline(f.name) ? "§a●" : "§7●"} §f${f.name}`, `textures/@legiun/gamerpic_${status}.png`);
			});
		}

		const r = await v.show(player);
		if (r.canceled) return;

		let i = r.selection;

		if (fromUI) {
			if (i === 0) return;
			i--;
		}

		if (i === 0) return this.addFriends(player);
		if (i === 1) return this.incomingInvites(player);

		const friend = friends[i - 2];
		if (friend) return this.friendAction(friend, player);
	},

	//==================================================
	// @FRIEND ACTION
	//==================================================

	async friendAction(target, player) {
		const v = new ActionFormData();

		v.title(target.name);
		v.body("§7Select action");

		v.button("§aChat");
		v.button("§bView Profile");
		v.button("§eUnfriend");
		v.button("§cBack");

		const r = await v.show(player);
		if (r.canceled) return;

		switch (r.selection) {
			case 0:
				player.sendMessage(`§a[Chat] §fOpening chat with §e${target.name}`);
				break;

			case 1:
				Interface.profile(target, player, true);
				break;

			case 2:
				return this.removeFriend(target, player);

			case 3:
				return this.home(player, true);
		}
	},

	removeFriend(target, player) {
		const db = database.player(player);
		let list = db.get("friend.list") ?? [];

		list = list.filter((f) => f.name !== target.name);
		db.set("friend.list", list);

		player.sendMessage(`§cRemoved §f${target.name}`);
		this.home(player, true);
	},

	//==================================================
	// @ADD FRIEND
	//==================================================

	async addFriends(player) {
		const v = new ActionFormData();
		v.title("Add Friends");

		v.button("§cBack", "textures/@legiun/arrow/prev.png");
		v.button("§aSearch Player");

		const r = await v.show(player);
		if (r.canceled) return;

		if (r.selection === 0) return this.searchPlayers(player);
		return this.home(player, true);
	},

	async searchPlayers(player) {
		const modal = new ModalFormData();

		modal.title("Search Player");
		modal.textField("Player Name", "Example: Steve");

		const r = await modal.show(player);
		if (r.canceled) return;

		const name = r.formValues[0]?.trim();
		if (!name) return;

		const target = world.getPlayers().find((p) => p.name.toLowerCase() === name.toLowerCase());

		if (!target) {
			player.sendMessage("§cPlayer not found");
			return this.addFriends(player);
		}

		return this.sendFriendRequest(player, target);
	},

	sendFriendRequest(sender, target) {
		const targetDB = database.player(target);
		let invites = targetDB.get("friend.invites") ?? [];

		if (invites.find((i) => i.name === sender.name)) {
			sender.sendMessage("§cAlready sent request");
			return;
		}

		invites.push({ name: sender.name });
		targetDB.set("friend.invites", invites);

		sender.sendMessage(`§aFriend request sent to §e${target.name}`);
		target.sendMessage(`§e${sender.name} §awants to be your friend`);
	},

	//==================================================
	// @INVITES
	//==================================================

	async incomingInvites(player) {
		const invites = this.getInvites(player);

		const v = new ActionFormData();
		v.title("Incoming Followers");

		if (invites.length === 0) {
			v.label("§cNo incoming requests");
		} else {
			invites.forEach((p) => v.button(p.name));
		}

		v.button("§cBack");

		const r = await v.show(player);
		if (r.canceled) return;

		if (r.selection === invites.length) {
			return this.home(player, true);
		}

		const target = invites[r.selection];
		return this.handleInvite(player, target);
	},

	async handleInvite(player, targetData) {
		const v = new ActionFormData();

		v.title(targetData.name);
		v.body("§7Accept this friend request?");

		v.button("§aAccept");
		v.button("§cDecline");
		v.button("§7Back");

		const r = await v.show(player);
		if (r.canceled) return;

		if (r.selection === 0) return this.acceptInvite(player, targetData);
		if (r.selection === 1) return this.declineInvite(player, targetData);

		return this.incomingInvites(player);
	},

	acceptInvite(player, targetData) {
		const db = database.player(player);
		const targetPlayer = world.getPlayers().find((p) => p.name === targetData.name);

		let friends = db.get("friend.list") ?? [];
		let invites = db.get("friend.invites") ?? [];

		invites = invites.filter((i) => i.name !== targetData.name);
		friends.push({ name: targetData.name });

		db.set("friend.invites", invites);
		db.set("friend.list", friends);

		player.sendMessage(`§aYou are now friends with §e${targetData.name}`);

		if (targetPlayer) {
			const tDB = database.player(targetPlayer);
			let tFriends = tDB.get("friend.list") ?? [];
			tFriends.push({ name: player.name });
			tDB.set("friend.list", tFriends);
		}

		this.home(player, true);
	},

	declineInvite(player, targetData) {
		const db = database.player(player);
		let invites = db.get("friend.invites") ?? [];

		invites = invites.filter((i) => i.name !== targetData.name);
		db.set("friend.invites", invites);

		player.sendMessage(`§cDeclined request from §f${targetData.name}`);
		this.incomingInvites(player);
	}
};

export Interface;
