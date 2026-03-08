import { system } from "@minecraft/server";

//===================================================================================

/**
 *	@name commandRegistry
 *	@description - Registry penyimpanan seluruh definisi custom command.
 *	@function - Menyimpan semua command yang akan didaftarkan ke customCommandRegistry saat startup.
 **/
const commandRegistry = [];

//===================================================================================

/**
 *	@name registerCommand
 *	@description - Menambahkan command ke dalam registry.
 *	@function - Digunakan oleh file command untuk mendaftarkan command tanpa langsung menyentuh Script API.
 *		@param {Object} command - Definisi command.
 *		@param {string} command.name - Nama command utama.
 *		@param {string} command.description - Deskripsi command.
 *		@param {number} [command.permissionLevel] - Level permission command.
 *		@param {Function} command.build - Function builder untuk membuat command tree.
 **/
export function registerCommand(command) {
	commandRegistry.push(command);
}

//===================================================================================

/**
 *	@name buildCommands
 *	@description - Mendaftarkan seluruh command yang ada di registry ke customCommandRegistry.
 *	@function - Dipanggil saat event startup sebelum world dimulai.
 *		@param {Object} registry - customCommandRegistry dari Script API.
 **/
function buildCommands(registry) {

	for (const command of commandRegistry) {

		registry.registerCommand({
			name: command.name,
			description: command.description ?? "",
			permissionLevel: command.permissionLevel ?? 0
		}, (root) => {

			if (typeof command.build === "function") {
				command.build(root);
			}

		});

	}

}

//===================================================================================

/**
 *	@name startupCommandRegistry
 *	@description - Menginisialisasi registry command saat server startup.
 *	@function - Mengambil customCommandRegistry dari event startup lalu membangun seluruh command.
 **/
system.beforeEvents.startup.subscribe((event) => {

	buildCommands(event.customCommandRegistry);

});

//===================================================================================