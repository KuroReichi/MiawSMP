export const configs = {
	server: {
		name: "Qyrogata",
		subname: "Beyond Magic of Nirvane",
		studio: {
			name: "Legiun Studio",
			owner: "Kuro Reichi",
			licensedWith: "Apache 2.0"
		},
		forceGamerule: true,
		gamerules: {
			commandBlocksEnabled: false,
			commandBlockOutput: true,
			doDaylightCycle: true,
			doEntityDrops: true,
			doFireTick: true,
			doImmediateRespawn: false,
			doInsomnia: true,
			doLimitedCrafting: false,
			doMobLoot: true,
			doMobSpawning: true,
			doTileDrops: true,
			doWeatherCycle: true,
			drowningDamage: true,
			fallDamage: true,
			fireDamage: true,
			freezeDamage: true,
			functionCommandLimit: 10000,
			keepInventory: false,
			maxCommandChainLength: 65536,
			mobGriefing: true,
			naturalRegeneration: true,
			pvp: true,
			randomTickSpeed: 3,
			sendCommandFeedback: true,
			showCoordinates: false,
			showDeathMessages: true,
			showTags: true,
			spawnRadius: 0,
			tntExplodes: true
		}
	},
	mobsLevelz: {
		blacklist: [
			{
				query: "family",
				name: "fish"
			},
			{
				query: "family",
				name: "inanimate"
			}
		],
		scaling: {
			growthFactor: 0.02,
			distanceFactor: 0.37
		}
	}
};