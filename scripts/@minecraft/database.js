import { system, world } from "@minecraft/server";

const database = {
	/**
	 * @name - prefix
	 * @description - Prefix unik untuk semua dynamic property yang dibuat oleh database ini.
	 * @purpose - Mencegah konflik data dengan Add-On lain yang juga menggunakan Dynamic Properties.
	 * @type {string}
	 */
	prefix: "MiawDB",

	/**
	 * @name - query
	 * @description - Separator antara prefix dan key database.
	 * @purpose - Membuat struktur ID dynamic property lebih kompleks dan mudah difilter.
	 * @type {string}
	 */
	query: "?",

	/**
	 * @name - set()
	 * @description - Menyimpan data ke Dynamic Property world database.
	 * @function - Membuat atau memperbarui data berdasarkan id dan key.
	 *
	 * @param {string|Object} id
	 * Jika string → menyimpan satu data.
	 * Jika object → menyimpan beberapa data sekaligus (bulk insert).
	 *
	 * @param {string|number|boolean|Object} value
	 * Nilai data yang akan disimpan.
	 *
	 * @param {string} key
	 * Namespace database untuk memisahkan kategori data.
	 * Default: "global".
	 *
	 * @param {boolean} overwrite
	 * Jika false maka data lama tidak akan ditimpa.
	 *
	 * @returns {Object|boolean}
	 * Mengembalikan nilai yang disimpan atau true jika bulk insert.
	 */
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

	/**
	 * @name - get()
	 * @description - Mengambil data dari database Dynamic Property.
	 * @function - Mengambil data berdasarkan id dan key namespace.
	 *
	 * @param {string} id
	 * ID data yang ingin diambil.
	 *
	 * @param {string} key
	 * Namespace database.
	 *
	 * @returns {any}
	 * Nilai data yang tersimpan.
	 */
	get: function (id, key = "global") {
		try {
			return JSON.parse(world.getDynamicProperty(db.prefix + db.query + key + ":" + id));
		} catch (e) {
			return world.getDynamicProperty(db.prefix + db.query + key + ":" + id);
		}
	},

	/**
	 * @name - getAllBy()
	 * @description - Mengambil semua data dari namespace tertentu.
	 * @function - Melakukan filter berdasarkan key namespace.
	 *
	 * @param {string} key
	 * Namespace database yang ingin diambil.
	 *
	 * @returns {Array<{id:string,data:any}>}
	 */
	getAllBy: function (key = "global") {
		return world
			.getDynamicPropertyIds()
			.filter((propertyID) => propertyID.startsWith(db.prefix + db.query + key + ":"))
			.map((propertyID) => ({
				id: propertyID.replace(db.prefix + db.query + key + ":", ""),
				data: db.get(propertyID.replace(db.prefix + db.query + key + ":", ""), key)
			}));
	},

	/**
	 * @name - getAll()
	 * @description - Mengambil semua ID database yang tersimpan oleh prefix ini.
	 * @function - Digunakan untuk debugging atau scanning seluruh data database.
	 *
	 * @returns {Array<{id:string,source:string}>}
	 */
	getAll: function () {
		return world
			.getDynamicPropertyIds()
			.filter((propertyID) => propertyID.startsWith(db.prefix + db.query))
			.map((propertyID) => ({
				id: propertyID.substr(propertyID.lastIndexOf(":") + 1),
				source: propertyID.slice(propertyID.indexOf(db.query) + 1, propertyID.lastIndexOf(":"))
			}));
	},

	/**
	 * @name - delete()
	 * @description - Menghapus data dari database.
	 * @function - Menghapus dynamic property berdasarkan id dan key namespace.
	 *
	 * @param {string} id
	 * ID data yang ingin dihapus.
	 *
	 * @param {string} key
	 * Namespace database.
	 *
	 * @returns {boolean}
	 * True jika data berhasil dihapus.
	 */
	delete: function (id, key = "global") {
		if (world.getDynamicProperty(db.prefix + db.query + key + ":" + id) === undefined) return false;
		world.setDynamicProperty(db.prefix + db.query + key + ":" + id, undefined);
		return true;
	},

	/**
	 * @name - add()
	 * @description - Menambahkan nilai numerik pada data database.
	 * @function - Mengambil nilai lama lalu menambahkan angka baru.
	 *
	 * @param {string} id
	 * ID data.
	 *
	 * @param {string} key
	 * Namespace database.
	 *
	 * @param {number} value
	 * Nilai yang akan ditambahkan.
	 *
	 * @returns {number}
	 */
	add: function (id, key = "global", value = 0) {
		if (typeof value !== "number") throw new ReferenceError(`Unexpected type at » db.add(...) «, value must be a number, but it present ${typeof value}`);
		return db.set(id, db.get(id, key) + value, key, true);
	},

	/**
	 * @name - remove()
	 * @description - Mengurangi nilai numerik pada data database.
	 * @function - Mengambil nilai lama lalu menguranginya.
	 *
	 * @param {string} id
	 * ID data.
	 *
	 * @param {string} key
	 * Namespace database.
	 *
	 * @param {number} value
	 * Nilai yang akan dikurangi.
	 *
	 * @returns {number}
	 */
	remove: function (id, key = "global", value = 0) {
		if (typeof value !== "number") throw new ReferenceError(`Unexpected type at » db.remove(...) «, value must be a number, but it present ${typeof value}`);
		return db.set(id, db.get(id, key) - value, key, true);
	},

	/**
	 * @name - player()
	 * @description - Membuat wrapper database khusus untuk player.
	 * @function - Menggunakan nama player sebagai namespace key.
	 *
	 * @param {Player} player
	 * Player Minecraft.
	 *
	 * @returns {Object}
	 * Object database dengan method set/get/delete/add/remove khusus player tersebut.
	 */
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

export default database;