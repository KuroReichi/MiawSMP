import { system } from "@minecraft/server";
import database from "./../../database.js";
//===================================================================================

/**
 *	@name commandRegistry
 *	@description - Registry penyimpanan seluruh definisi custom command.
 *	@function - Menyimpan semua command yang akan didaftarkan ke customCommandRegistry saat startup.
 **/

const id = "CommandRG";
const key = "1VXvbozwnG";

system.run(() => database.set(id, new Array(), key, false));

//===================================================================================

/**
 *	@name registerCommand
 *	@description - Menambahkan command ke dalam registry.
 *	@function - Digunakan oleh file command untuk mendaftarkan command tanpa langsung menyentuh Script API.
 *	@param {Object} command - Definisi command.
 *	@param {string} command.name - Nama command utama.
 *	@param {string} command.description - Deskripsi command.
 *	@param {number} [command.permissionLevel] - Level permission command.
 *	@param {Function} command.build - Function builder untuk membuat command tree.
 **/

export function registerCommand(command) {
	let registry = database.get(id, key) ?? [];
	registry = registry.filter((cmd) => cmd.name !== command.name);
	registry.push(command);
	registry.sort((a, b) => a.name.localeCompare(b.name));
	database.set(id, registry, key, false);
}

//===================================================================================

/**
 *	@name buildCommands
 *	@description - Mendaftarkan seluruh command yang ada di registry ke customCommandRegistry.
 *	@function - Dipanggil saat event startup sebelum world dimulai.
 *	@param {Object} registry - customCommandRegistry dari Script API.
 **/

export function CommandBuilder(registry) {
	const commandRegistry = database.get(id, key) ?? [];
	for (const command of commandRegistry) {
		registry.registerCommand(
			{
				name: command.name,
				description: command.description ?? "",
				permissionLevel: command.permissionLevel ?? 0
			},
			(root) => {
				if (typeof command.build === "function") {
					command.build(root);
				}
			}
		);
	}
}

//===================================================================================
