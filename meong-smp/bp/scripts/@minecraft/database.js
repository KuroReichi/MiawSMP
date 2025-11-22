import { world } from "@minecraft/server";

/*
	Default:
		prefix?type:key
		miawdb?global:eventCountdown
		miawdb?KuroReichi:mana
		miawdb?KuroReichi:physical_attack
		miawdb?KuroReichi:physical_defense
*/
export const db = {
	config: {
		prefix: "miawdb",
		defaultType: "global"
	}, // key = kunci/kata kunci | value = isi (string/number/object/array/null/NaN/undefined) | type = global/primary (default) | append = timpa ≠
	set(key, value, type, append = true) {
		if(!type) type = db.config.defaultType;
		if(typeof value === "object" || typeof value === "array") {
			world.setDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`, JSON.stringify(value));
		} else { // return JSON Object OR String
			world.setDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`, value);
		}; return {db};
	}, // + DB Numeric
	incValue(key, value, type) {
		if(typeof db.get(key, type) !== "number") return null;
		db.set(key, db.get(key, type) + value, type); return {db};
	}, // – DB Numeric
	decValue(key, value, type) {
		if(typeof db.get(key, type) !== "number") return null;
		db.set(key, db.get(key, type) - value, type); return {db};
	}, // getter
	get(key, type) {
		if(typeof world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`) === "object") {
			return JSON.parse(world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`));
		} else {
			if(typeof world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`) === "number") return Number(world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`));
			return world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`);
		}
	},
	list() {
		let properties = [];
		world.getDynamicPropertyIds().forEach(property => {
			properties.push({
				id: property,
				value: world.getDynamicProperty(property);
			});
		});
		return properties.sort((a, b) => a.id.localeCompare(b.id));
	},
	delete(key, type) {
		if(world.getDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`) !== undefined) {
			world.setDynamicProperty(`${db.config.prefix}?${type ? type : db.config.defaultType}:${key}`, undefined);
			return true;
		} else {
			return false;
		}
	}
}