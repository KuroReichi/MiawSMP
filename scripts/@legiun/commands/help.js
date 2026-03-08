import { registerCommand, getCommands } from "../frameworks/commands/registry.js";

//===================================================================================
/**
 *	@name helpCommand
 *	@description - Menampilkan seluruh command yang telah diregistrasi dengan sistem
 *	pagination maksimal 10 command per halaman.
 */
//===================================================================================

const PAGE_SIZE = 10;

registerCommand({
	name: "q:help",
	description: "Show list of commands",
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

function showHelp(ctx, page) {
	const commands = getCommands();
	const total = commands.length;
	const maxPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

	page = Math.max(1, Math.min(page, maxPage));

	const start = (page - 1) * PAGE_SIZE;
	const end = start + PAGE_SIZE;

	const list = commands.slice(start, end);
	ctx.source.sendMessage({
		rawtext: [
			{
				translate: "commands.help.header",
				with: [String(page), String(maxPage)]
			}
		]
	});

	for (const cmd of list) {
		ctx.source.sendMessage({
			rawtext: [{ text: "§e/" + cmd.name }, { text: " §7- " + (cmd.description ?? "") }]
		});
	}
}
