const modules = [
	// Path Module(s)
	"../../commands/help.js",
	"../../commands/pay.js"
];

modules.forEach((m) => import(m));
