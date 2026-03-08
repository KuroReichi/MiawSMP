//===================================================================================
/**
 *	@name commandBuilder
 *	@description - Utility builder untuk mempermudah pembuatan command tree pada
 *	customCommandRegistry Script API. Builder ini membungkus node bawaan seperti
 *	string, integer, number, dan playerSelector agar bisa digunakan dengan pola
 *	chaining sehingga definisi command menjadi lebih rapi dan konsisten.
 */
//===================================================================================

export class CommandBuilder {
	constructor(root) {
		this.node = root;
	}
	string(name) {
		this.node = this.node.string(name);
		return this;
	}
	integer(name) {
		this.node = this.node.integer(name);
		return this;
	}
	number(name) {
		this.node = this.node.number(name);
		return this;
	}
	player(name) {
		this.node = this.node.playerSelector(name);
		return this;
	}
	executes(callback) {
		this.node.executes(callback);
		return this;
	}
}
//===================================================================================
