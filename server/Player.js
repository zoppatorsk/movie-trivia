const { nanoid } = require('nanoid'); //temp dependecy so can generate users with uniqe names without me having to do any typing.. lazy, yes..!!
module.exports = class Player {
	constructor({ name = 'John Doe' + nanoid(), id = null } = {}) {
		this.playername = name;
		this.id = id;
		this.ready = false;
	}
};
