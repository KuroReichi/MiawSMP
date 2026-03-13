const modules = ["../../commands/help.js", "../../commands/pay.js"];

modules.forEach((m) => import(m));
