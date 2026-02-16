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

export const configs = {
	server: {
		name: "Qyrogata",
		subname: "Beyond Magic of Nirvane"
	},
	mobsLevelz: {
		blacklist: [
			// Cuma entity sing mlebu list "mobs" family
			// sing bakal keitung sebagai target ber-level.
			{
				query: "family", // <family|typeId>
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

export function PlayerClass(void) {
	const classes = [
		{
			name: {
				uri: "aether_vanguard",
				display: "Aether Vanguard",
				color: "c"
			},
			description: "",
			attributes: {
				hp: [100, 100],
				pA: [13, 21],
				pD: [7, 14],
				mA: [0, 0],
				mD: [2, 2],
				type: "energy",
				energy: {
					range: [80, 120],
					regenAmount: 5,
					regenTime: 100
				},
				factorMultiplier: [-0.22, 0.43]
			},
			roles: ["Fighter"]
		},
		{
			name: {
				uri: "lunaris_arcanist",
				display: "Lunaris Arcanist",
				color: "b"
			},
			description: "",
			attributes: {
				pA: [1, 1],
				pD: [2, 3],
				mA: [19, 32],
				mD: [4, 7],
				type: "nirvane",
				nirvane: {
					range: [92, 183],
					regenAmount: 13,
					regenTime: 100
				},
				factorMultiplier: [-0.24, 0.31]
			},
			roles: ["Mage"]
		},
		{
			name: {
				uri: "seraphine_warden",
				display: "Seraphine Warden",
				color: "a"
			},
			description: "",
			attributes: {
				pA: [2, 3],
				pD: [4, 7],
				mA: [14, 23],
				mD: [6, 11],
				type: "nirvane",
				nirvane: {
					range: [85, 130],
					regenAmount: 7,
					regenTime: 30
				},
				factorMultiplier: [-0.29, 0.37]
			},
			roles: ["Support"]
		}
	];
	return classes;
}
