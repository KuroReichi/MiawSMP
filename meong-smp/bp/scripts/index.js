//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░███╗░░░███╗██╗░█████╗░░██╗░░░░░░░██╗░░░░░░░░░░░░
//░░░████╗░████║██║██╔══██╗░██║░░██╗░░██║░░░░░░░░░░░░
//░░░██╔████╔██║██║███████║░╚██╗████╗██╔╝░░░░░░░░░░░░
//░░░██║╚██╔╝██║██║██╔══██║░░████╔═████║░░░░░░░░░░░░░
//░░░██║░╚═╝░██║██║██║░░██║░░╚██╔╝░╚██╔╝░░░░░░░░░░░░░
//░░░╚═╝░░░░░╚═╝╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░██████╗████████╗██╗░░░██╗██████╗░██╗░█████╗░░░░
//░░░██╔════╝╚══██╔══╝██║░░░██║██╔══██╗██║██╔══██╗░░░
//░░░╚█████╗░░░░██║░░░██║░░░██║██║░░██║██║██║░░██║░░░
//░░░░╚═══██╗░░░██║░░░██║░░░██║██║░░██║██║██║░░██║░░░
//░░░██████╔╝░░░██║░░░╚██████╔╝██████╔╝██║╚█████╔╝░░░
//░░░╚═════╝░░░░╚═╝░░░░╚═════╝░╚═════╝░╚═╝░╚════╝░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
//░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░

import { world, system, ItemStack, Vector3, Vector2, EquipmentSlot} from "@minecraft/server";
import { uiManager, ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";

import { configs } from "./configs.js";
import { realtimeDate, metricNumber, useNirvane } from "./utility.js";
import { db } from "@minecraft/database.js";

function databaseCheck(player) {
	player.onScreenDisplay.setHudVisibility(0, [1, 6, 10]);
	if (!db.get("miaw.member", player.name)) {
		// Common Information
		db.set("miaw.member", true, player.name);
		db.set("server.firstJoinDate", new Date().valueOf(), player.name);
		db.set("server.loginStreak", 0, player.name);
		db.set("block.place", 0, player.name);
		db.set("block.break", 0, player.name);
		db.set("kills", 0, player.name);
		db.set("deaths", 0, player.name);
		db.set("playtime.local-timer", 0, player.name)
		db.set("playtime.seconds", 0, player.name);
		db.set("playtime.minutes", 0, player.name);
		db.set("playtime.hours", 0, player.name);
		db.set("playtime.hours-total", 0, player.name);
		db.set("playtime.days", 0, player.name);
		
		// Gameplay
		db.set("nirvane.timer", 0, player.name);
		db.set("nirvane.amount", 0, player.name);
		db.set("nirvane.maxAmount", 0, player.name);
		db.set("nirvane.regenAmount", 0, player.name);
		db.set("nirvane.regenTime", 0, player.name);
		
		db.set("player.visitor", 0, player.name);
		db.set("player.class", undefined, player.name);
		db.set("player.friends", undefined, player.name)
		db.set("hp.value", 100, player.name);
		db.set("hp.max", 100, player.name);
		
		const item = new ItemStack("miaw:menu", 1);
		item.lockMode = "inventory";
		item.keepOnDeath = true;
		item.setLore([
			`§r§aOwned by §2${player.name}`
		]);
		player.getComponent("minecraft:inventory").container.setItem(8, item);
		
		world.sendMessage(`§2§l» §r§aWelcome §7${player.name}! §7to §bMiaw§3SMP§f: §dThe Covenant of Past§7.`);
	} else {
		player.sendMessage(`§2§l» §r§aWelcome back §7${player.name}`);
	}
};

function rawtext(parts = []) {
	const formatted = parts.map((part, index) => {
		if (!part || typeof part !== "object") return part;
		if (part.text && typeof part.text === "string" && Object.keys(part).length === 1) {
			return { text: part.text + (index !== parts.length - 1 ? "\n§r" : "") };
		}
		if (part.translate && typeof part.translate === "string" && Object.keys(part).length === 1) {
			return { translate: part.translate + (index !== parts.length - 1 ? "\n§r" : "") };
		}
		return part;
	});
	return { rawtext: formatted };
}
const UI = {
	selectClass: (player, isFromClosed = false) => {
		const form = new ActionFormData();
		form.title("Select Class");
		if(isFromClosed) form.body("§cPlease select a class to continue§7.")
		configs.gameplay.class.forEach(playerClass => {
			form.button(playerClass.name.color + playerClass.name.display + "\n§8" + playerClass.type, playerClass.icon);
			form.label(rawtext([
				{"text": "Description :"},
				{"text": "  §7" + playerClass.description}
			]));
			form.label(rawtext([
				{"text": "§bAttribute§3(§bs§3) §8:"},
				{"text": "   §7Health §3» §f" + playerClass.stats.base.hp},
				{"text": "   §7Nirvane §3» §f" + Math.round(configs.gameplay.nirvane.initial * (1 + (playerClass.stats.nirvane.multiplier / 100)))},
				{"text": "   §7Physical ATK §3» §f" + playerClass.stats.base.pA},
				{"text": "   §7Physical DEF §3» §f" + playerClass.stats.base.pD},
				{"text": "   §7Magical ATK §3» §f" + playerClass.stats.base.mA},
				{"text": "   §7Magical DEF §3» §f" + playerClass.stats.base.mD}
			]))
			if(playerClass.name.display !== configs.gameplay.class[configs.gameplay.class.length - 1].name.display) form.divider();
		});
		form.show(player).then(response => {
			if(response.cancelationReason === "UserBusy") return;
			if(response.cancelationReason === "UserClosed") {
				UI.selectClass(player, true);
				player.playSound("note.bass");
			} else {
				if(typeof response.selection !== "number") return;
				const classes = configs.gameplay.class;
				db.set("player.class", classes[response.selection].name.display, player.name);
				db.set("hp.value", classes[response.selection].stats.base.hp, player.name);
				db.set("hp.max", classes[response.selection].stats.base.hp, player.name);
				db.set("nirvane.timer", classes[response.selection].stats.nirvane.regen.time, player.name);
				db.set("nirvane.amount", Math.round(configs.gameplay.nirvane.initial * (1 + (classes[response.selection].stats.nirvane.multiplier / 100))), player.name);
				db.set("nirvane.maxAmount", Math.round(configs.gameplay.nirvane.initial * (1 + (classes[response.selection].stats.nirvane.multiplier / 100))), player.name);
				db.set("nirvane.regenAmount", classes[response.selection].stats.nirvane.regen.amount, player.name);
				db.set("nirvane.regenTime", classes[response.selection].stats.nirvane.regen.time, player.name);
				player.sendMessage("§aYou selected §2" + classes[response.selection].name.display); 
			}
		})
	}
}

world.afterEvents.playerSpawn.subscribe((event) => {
	if (event.initialSpawn === false) return;
	const player = event.player;
	databaseCheck(player);
});
world.afterEvents.worldLoad.subscribe((event) => {
	console.info("Miaw's Core Loaded");
	console.info(" » Version: "+configs.version);
	world.getAllPlayers().forEach(player => {
		databaseCheck(player);
	})
});

function getKnockbackReduction(player) {
	const armor = player.getComponent("minecraft:equippable");
	let reduction = 0;
	let equipmentSlot = [
		EquipmentSlot.Head,
		EquipmentSlot.Chest,
		EquipmentSlot.Legs,
		EquipmentSlot.Feet
	];
	for (let i = 0; i < 4; i++) {
		const item = armor.getEquipment(equipmentSlot[i]);
		if (!item) continue;
		if (item.typeId === "minecraft:netherite_helmet") reduction += 0.2;
		if (item.typeId === "minecraft:netherite_chestplate") reduction += 0.2;
		if (item.typeId === "minecraft:netherite_leggings") reduction += 0.2;
		if (item.typeId === "minecraft:netherite_boots") reduction += 0.2;
	}

	return Math.min(reduction, 80);
};

function applyKnockback(victim, attacker, basePower = 0.45, upward = 0.3) {
	const dx = victim.location.x - attacker.location.x;
	const dz = victim.location.z - attacker.location.z;
	const len = Math.sqrt(dx * dx + dz * dz);

	if (len === 0) return;
	const nx = dx / len;
	const nz = dz / len;
	
	const reduction = getKnockbackReduction(victim);
	
	const power = basePower * (1 - reduction / 100);
	const impulse = {x: nx * power, y: upward, z: nz * power};
	victim.applyImpulse(impulse);
}
world.afterEvents.entityHurt.subscribe((event) => {
	const player = event.hurtEntity;
	const source = event.damageSource;
	world.sendMessage(`E: ${source.damagingEntity}\n P: ${source.damagingProjectile}`)
	if(event.damage < 32768)
		player.getComponent("minecraft:health").resetToMaxValue();
	const attacker = { entity: source.damagingEntity };
	if(source.damagingProjectile !== undefined) attacker.projectile = source.damagingProjectile;
	if(attacker.projectile !== undefined && attacker.entity === undefined) {
		applyKnockback(player, attacker.projectile);
		db.decValue("hp.value", event.damage, player.name);
		if(db.get("hp.value", player.name) <= 0) {
			attacker.projectile.addTag(`${player.name}:killer`);
			player.runCommand(`damage @s ${player.getComponent("minecraft:health").effectiveMax * 16} ${source.cause} entity @e[c=1,tag="${player.name}:killer"]`);
			attacker.projectile.removeTag(`${player.name}:killer`);
			db.set("hp.value", db.get("hp.max", player.name), player.name);
		};
	} else if(attacker.entity !== undefined && attacker.projectile === undefined) {
		applyKnockback(player, attacker.entity);
		db.decValue("hp.value", event.damage, player.name);
		if(db.get("hp.value", player.name) <= 0) {
			attacker.entity.addTag(`${player.name}:killer`);
			player.runCommand(`damage @s ${player.getComponent("minecraft:health").effectiveMax * 16} ${source.cause} entity @e[c=1,tag="${player.name}:killer"]`);
			attacker.entity.removeTag(`${player.name}:killer`);
			db.set("hp.value", db.get("hp.max", player.name), player.name);
		};
	} else if(attacker.entity !== undefined && attacker.projectile !== undefined) {
		applyKnockback(player, attacker.entity);
		db.decValue("hp.value", event.damage, player.name);
		if(db.get("hp.value", player.name) <= 0) {
			attacker.entity.addTag(`${player.name}:killer`);
			player.runCommand(`damage @s ${player.getComponent("minecraft:health").effectiveMax * 16} ${source.cause} entity @e[c=1,tag="${player.name}:killer"]`);
			attacker.entity.removeTag(`${player.name}:killer`);
			db.set("hp.value", db.get("hp.max", player.name), player.name);
		};
	} else {
		db.decValue("hp.value", event.damage, player.name);
		if(db.get("hp.value", player.name) <= 0) {
			player.runCommand(`damage @s ${player.getComponent("minecraft:health").effectiveMax * 16} ${source.cause}`);
			db.set("hp.value", db.get("hp.max", player.name), player.name);
		};
	}
}, {entityTypes: ["minecraft:player"]});

world.afterEvents.playerButtonInput.subscribe((event) => {
	if(event.player.isSneaking && event.player.getRotation().x >= 65) {
		try {
			event.player.getComponent("minecraft:rideable").getRiders()[0].sendMessage("§7» §cYou have been ejected");
			event.player.sendMessage("§7» §aYou ejected §2"+event.player.getComponent("minecraft:rideable").getRiders()[0].name);
			event.player.getComponent("minecraft:rideable").ejectRider(event.player.getComponent("minecraft:rideable").getRiders()[0]);
		} catch(e) {}
	}
}, {buttons: ["Sneak"], state: "Pressed"});

system.runInterval(() => {
	world.getAllPlayers().forEach(player => {
		if(db.get("player.class", player.name) !== undefined && db.get("nirvane.amount", player.name) < db.get("nirvane.maxAmount", player.name)) db.decValue("nirvane.timer", 1, player.name);
		db.decValue("playtime.local-timer", 1, player.name);
		if(db.get("nirvane.timer", player.name) <= 0) {
			db.set("nirvane.amount", Math.min(db.get("nirvane.amount", player.name) + db.get("nirvane.regenAmount", player.name), db.get("nirvane.maxAmount", player.name)), player.name);
			db.incValue("nirvane.timer", db.get("nirvane.regenTime", player.name), player.name);
		}
		if(db.get("playtime.local-timer", player.name) <= 0) {
			db.incValue("playtime.seconds", 1, player.name);
			db.incValue("playtime.local-timer", 20, player.name);
			if(db.get("playtime.seconds", player.name) >= 60) {
				db.incValue("playtime.minutes", 1, player.name);
				db.decValue("playtime.seconds", 60, player.name);
			}; if(db.get("playtime.minutes", player.name) >= 60) {
				db.incValue("playtime.hours-total", 1, player.name);
				db.incValue("playtime.hours", 1, player.name);
				db.decValue("playtime.minutes", 60, player.name);
			};
			if(!db.get("player.class", player.name)) {
				try {
					UI.selectClass(player);
				} catch(e) {}
			};
		}; if(player.onScreenDisplay.isValid) {
			try {
				const hp	 = db.get("hp.value", player.name);
				const hpMax	 = db.get("hp.max", player.name);
				const nir	 = db.get("nirvane.amount", player.name);
				const nirMax = db.get("nirvane.maxAmount", player.name);
				const regen	 = db.get("nirvane.regenAmount", player.name);
				const timer	 = (db.get("nirvane.timer", player.name) / 20).toFixed(1);
				const armor	 = player.getComponent("minecraft:equippable").totalArmor;

				const hpText	= Math.floor(hp) >= Math.floor(hpMax) ? 
					` §c${hp.toFixed(0)}` : 
					` §c${hp.toFixed(0)}§4/§c${hpMax.toFixed(0)}`;

				const nirText	= nir >= nirMax ? 
					` §b${nir}` : 
					` §b${nir}§7/§b${nirMax}`;

				player.onScreenDisplay.setActionBar({rawtext: [
					{ "text": `${hpText}` },
					{ "text": ` §8(§f:armor: §f${armor}§8 )§r` },
					{ "text": `\n${nirText}` },
					{ "text": ` §9« §2+§a${regen.toFixed(0)} §8(§7${timer}s§8) §9»§r` }
				]});
			} catch(e) {}
		}
	});
}, 1)
world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
	if(event.target.typeId === "minecraft:player") {
		if(event.itemStack) {
			if(event.itemStack.typeId === "minecraft:name_tag") event.cancel = true;
		};
		if(event.player.isSneaking) {
			event.cancel = true;
			system.runTimeout(() => {
				ui.player.profile(event.player, event.target);
			}, 1);
		};
		try {
			if(event.target.getComponent("minecraft:riding").entityRidingOn === event.player.getComponent("minecraft:rideable").getRiders()[0]) {
				event.cancel = true;
				event.player.sendMessage("§7» §cYou can\'t ride a player in this state!");
				event.player.playSound("note.bass");
			} else {
				event.cancel = false;
			}
		} catch(e) {}
	};
});
world.beforeEvents.chatSend.subscribe((event) => {
	if(event.message.startsWith(configs.commands.prefix)) {
		event.cancel = true;
	} else {
		console.info(`${event.sender.name}: ${event.message}`);
		event.cancel = true;
		event.sender.sendMessage(`§a${event.sender.name} §2» §7${event.message}`);
		world.getPlayers({excludeNames: [event.sender.name]}).forEach(recipient => {
			recipient.sendMessage(`§6${event.sender.name} §g» §7${event.message}`);
		});
	}
});
world.afterEvents.playerBreakBlock.subscribe((event) => {db.incValue("block.break", 1, event.player.name);});
world.afterEvents.playerPlaceBlock.subscribe((event) => {
	db.incValue("block.place", 1, event.player.name);
	if(event.block.typeId === "minecraft:respawn_anchor") {
		if(db.get("anchor_cooldown", event.player.name) === true) {
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} run setblock ~~~ air`);
			event.player.playSound("note.bass");
			event.player.sendMessage("§cPlease wait for a sec...");
			event.player.getComponent("minecraft:inventory").container.addItem(new ItemStack("minecraft:respawn_anchor", 1));
			return;
		};
		db.set("anchor_cooldown", true, event.player.name);
		system.runTimeout(() => {
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=0] run setblock ~~~ respawn_anchor["respawn_anchor_charge"=1]`);
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=1] run playsound respawn_anchor.charge @a ~~~`);
		}, 5);
		system.runTimeout(() => {
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=1] run setblock ~~~ respawn_anchor["respawn_anchor_charge"=2]`);
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=2] run playsound respawn_anchor.charge @a ~~~`);
		}, 10);
		system.runTimeout(() => {
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=2] run setblock ~~~ respawn_anchor["respawn_anchor_charge"=3]`);
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=3] run playsound respawn_anchor.charge @a ~~~`);
		}, 15);
		system.runTimeout(() => {
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=3] run setblock ~~~ respawn_anchor["respawn_anchor_charge"=4]`);
			event.player.runCommand(`execute positioned ${event.block.location.x} ${event.block.location.y} ${event.block.location.z} if block ~~~ respawn_anchor["respawn_anchor_charge"=4] run playsound respawn_anchor.charge @a ~~~`);
		}, 20);
		system.runTimeout(() => {
			if(event.dimension.getBlock(event.block.location).permutation.getState("respawn_anchor_charge") == 4) {
				event.dimension.setBlockType(event.block.location, "minecraft:air");
				event.dimension.createExplosion(event.block.location, 5, {
					allowUnderwater: true,
					breaksBlocks: true,
					causesFire: false,
					source: event.player
				});
				db.set("anchor_cooldown", false, event.player.name);
			} else {
				return;
			};
		}, 25);
	}
});
world.afterEvents.itemUse.subscribe((event) => {
	if(event.itemStack.typeId === "miaw:menu") {
		event.cancel = true;
		system.runTimeout(() => {
			ui.menu(event.source);
		}, 1);
	};
	if(event.itemStack.typeId.endsWith("sword")) {
		if(useNirvane(25, event.source)) {
			event.source.applyImpulse({ x: event.source.getViewDirection().x, y: 0.5, z: event.source.getViewDirection().z });
		}
	}
	if(event.itemStack.typeId === "minecraft:recovery_compass") {
		world.clearDynamicProperties();
		world.sendMessage("§cDatabase direset§7.");
	}
	if(event.itemStack.typeId === "minecraft:stick") {
		console.info(event.source.name+" §aRight Clicked§r");
		world.getDynamicPropertyIds().forEach(property => {
			if(property.endsWith("firstJoinDate")) {
				world.sendMessage(`§e${property}\n §a» §7${new Date(world.getDynamicProperty(property))}`)
			} else {
				world.sendMessage(`§e${property}\n §c» §7${world.getDynamicProperty(property)}`)
			}
		});
		world.sendMessage(`Current Nirvane: ${db.get("nirvane.amount", event.source.name)}`);
	}
})