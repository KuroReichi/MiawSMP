import { system, world } from "@minecraft/server";

//  Syntax prefix:query:key:id
//  Expected Output : MiawDB?global:uptime        <- Global Data
//                    MiawDB?KuroReichii:aspd     <- Object/Entity Data

export const db = {
	prefix: "MiawDB",
	query: "?",
	set: function (id, value, key = "global", overwrite = true) {
		if (typeof id === "object" && id !== null && !Array.isArray(id)) {
			const entries = Object.entries(id);
			const bulkData = {};
			for (const [bulkId, bulkValue] of entries) {
				if (/:/.test(key)) throw new Error("The character ':' is not allowed in (key) database!.");
				const fullKey = db.prefix + db.query + key + ":" + bulkId;
				if (!overwrite && world.getDynamicProperty(fullKey) !== undefined) continue;
				bulkData[fullKey] = typeof bulkValue === "object" ? JSON.stringify(bulkValue) : bulkValue;
			}
			world.setDynamicProperties(bulkData);
			return true;
		}
		if (/:/.test(key)) throw new Error("The character ':' is not allowed in (key) database!.");
		const fullKey = db.prefix + db.query + key + ":" + id;
		if (world.getDynamicProperty(fullKey) === undefined || overwrite) {
			world.setDynamicProperty(fullKey, typeof value === "object" ? JSON.stringify(value) : value);
		}
		return world.getDynamicProperty(fullKey);
	},
	get: function (id, key = "global") {
		try {
			return JSON.parse(world.getDynamicProperty(db.prefix + db.query + key + ":" + id));
		} catch (e) {
			return world.getDynamicProperty(db.prefix + db.query + key + ":" + id);
		}
	},
	getAllBy: function (key = "global") {
		return world
			.getDynamicPropertyIds()
			.filter((propertyID) => propertyID.startsWith(db.prefix + db.query + key + ":"))
			.map((propertyID) => ({
				id: propertyID.replace(db.prefix + db.query + key + ":", ""),
				data: db.get(propertyID.replace(db.prefix + db.query + key + ":", ""), key)
			}));
	},
	getAll: function () {
		return world
			.getDynamicPropertyIds()
			.filter((propertyID) => propertyID.startsWith(db.prefix + db.query))
			.map((propertyID) => ({
				id: propertyID.substr(propertyID.lastIndexOf(":") + 1),
				source: propertyID.slice(propertyID.indexOf(db.query) + 1, propertyID.lastIndexOf(":"))
			}));
	},
	delete: function (id, key = "global") {
		if (world.getDynamicProperty(db.prefix + db.query + key + ":" + id) === undefined) return false;
		world.setDynamicProperty(db.prefix + db.query + key + ":" + id, undefined);
		return true;
	},
	add: function (id, key = "global", value = 0) {
		if (typeof value !== "number")
			throw new ReferenceError(
				`Unexpected type at » db.add(...) «, value must be a number, but it present ${typeof value}`
			);
		return db.set(id, db.get(id, key) + value, key, true);
	},
	remove: function (id, key = "global", value = 0) {
		if (typeof value !== "number")
			throw new ReferenceError(
				`Unexpected type at » db.remove(...) «, value must be a number, but it present ${typeof value}`
			);
		return db.set(id, db.get(id, key) - value, key, true);
	},
	// db.player => { db } + "key" = player.name
	player(player) {
		const key = player.name;
		return {
			set: (id, value, overwrite = true) => db.set(id, value, key, overwrite),
			get: (id) => db.get(id, key),
			delete: (id) => db.delete(id, key),
			add: (id, value) => db.add(id, key, value),
			remove: (id, value) => db.remove(id, key, value),
			getAll: () => db.getAll(key)
		};
	}
};
