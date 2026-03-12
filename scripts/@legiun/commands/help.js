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
	name: "help",
	aliases: ["?"],
	description: "Show list of commands within a page"
	
});

//===================================================================================