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

export function playerClass() {
	return [
		{
			name: "Aether Vanguard",
			icon: "textures/qy/",
			color: "§c",
			stats: {
				hp: [180, 200],
				pA: [18, 24],
				pD: [11, 16],
				mA: [0, 0],
				mD: [0, 0],
				randFactor: [-20, 18]
			}
		},
		{
			name: "Lunaris Arcanist",
			icon: "textures/qy/",
			color: "§b",
			stats: {
				hp: [80, 100],
				pA: [8, 12],
				pD: [4, 4],
				mA: [37, 51],
				mD: [13, 17],
				randFactor: [-13, 20]
			}
		},
		{
			name: "Seraphine Warden",
			icon: "textures/qy",
			color: "§a",
			stats: {
				hp: [80, 120],
				pA: [8, 11],
				pD: [2, 6],
				mA: [19, 37],
				mD: [23, 30],
				randFactor: [-7, 23]
			}
		}
	];
}
