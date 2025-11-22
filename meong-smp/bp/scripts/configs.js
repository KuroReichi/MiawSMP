export const configs = {
	version: "1.0.0-alpha",
	server: {
		name: "Meong SMP",
		subname: "α: The Covenant of Past",
		season: 1,
		difficulty: "hard",
		themes: [
			"magic", "mmorpg"
		]
	},
	commands: {
		maxPages: 5
	},
	gameplay: {
		enableHostileClass: true,
		daily: {
			rewards: [
				{
					type: "balance",
					value: 5000
				},
				{
					type: "item",
					id: "minecraft:iron_ingot",
					min: 2,
					max: 5
				},
				{
					type: "item",
					id: "minecraft:diamond",
					min: 0,
					max: 2
				},
				{
					type: "item",
					id: "minecraft:bread",
					min: 16,
					max: 16
				},
				{
					type: "item",
					id: "minecraft:cooked_beef",
					min: 2,
					max: 6
				},
				{
					type: "item",
					id: "minecraft:gold_ingot",
					min: 4,
					max: 7
				}
			]
		},
		bonusRewards: [
			{
				type: "playtime",
				value: 3600, // 1 jam
				rewards: [
					{
						type: "balance",
						value: 25000
					}
				]
			},
			{
				type: "playtime",
				value: 28800, // 8 jam
				rewards: [
					{
						type: "balance",
						value: 125000
					},
					{
						type: "experience",
						value: 5000
					}
				]
			}
		],
		nirvane: {
			initial: 500,   // Nirvane awal
			regenAmount: 2, // Jumlah regen
			regenTime: 25,  // Waktu regen
			reduction: 0    // Pengurangan pemakaian mana
		},	                //   maks 25% (fair-gameplay buat grinding)
		class: [
			{
				name: "Aether Vanguard",
				type: "melee",
				stats: {
					base: {
						hp: 30,
						physical_atk: 4,
						physical_def: 7,
						magical_def:  0
					},
					nirvaneMultiplier: -60
				},
				evo: [
					{
						name: "",
						tier: 0,
						display: {
							
						}
					}
				]
			},
			{
				name: "Lunaris Arcanist",
				type: "ranged",
				stats: {
					base: {
						hp: 20,
						physical_atk: 1,
						physical_def: 0,
						magical_def:  7
					},
					nirvaneMultiplier: 45
				}
			},
			{
				name: "Seraphine Warden",
				type: "ranged",
				stats: {
					base: {
						hp: 20,
						physical_atk: 0.7,
						physical_def: 0,
						magical_def:  5
					},
					nirvaneMultiplier: 30
				}
			}
		]
	}
}