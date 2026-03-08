import { registerCommand } from "../registry/commandRegistry.js";
import database from "../@minecraft/database.js";
//===================================================================================

const id = "CommandRG";
const key = "1VXvbozwnG";
const PAGE_SIZE = 10;

//===================================================================================

/**
 *===================================================================================
 *	@name helpCommand
 *	@description - Command untuk menampilkan seluruh command yang telah diregistrasi.
 *	@function - Membagi daftar command menjadi beberapa halaman (maksimal 10 command per halaman).
 *	@param {number} [page] - Halaman yang ingin ditampilkan.
 *===================================================================================
 */

registerCommand({
	name: "help",
	description: "Show list of commands",
	permissionLevel: 0,

	build(root) {
		root.executes((ctx) => {
			showHelp(ctx, 1);
		});

		root.integer("page").executes((ctx) => {
			showHelp(ctx, ctx.args.page);
		});
	}
});

//===================================================================================

/**
 *===================================================================================
 *	@name showHelp
 *	@description - Menampilkan daftar command sesuai halaman.
 *	@function - Mengambil registry command lalu membaginya per halaman.
 *	@param {Object} ctx - Context command.
 *	@param {number} page - Halaman yang diminta.
 *===================================================================================
 */

function showHelp(ctx, page) {
	const registry = database.get(id, key) ?? [];
	
	const total = registry.length;
	const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

	page = Math.max(1, Math.min(page, maxPage));

	const start = (page - 1) * PAGE_SIZE;
	const end = start + PAGE_SIZE;

	const commands = registry.slice(start, end);

	const messages = [];

	messages.push({
		rawtext: [
			{
				translate: "commands.help.header",
				with: [String(page), String(maxPage)]
			}
		]
	});

	for (const cmd of commands) {
		messages.push({
			rawtext: [{ text: "§e/" + cmd.name }, { text: " §7- " + (cmd.description ?? "") }]
		});
	}

	// Kirim ke player
	for (const msg of messages) {
		ctx.source.sendMessage(msg);
	}
}

//===================================================================================
