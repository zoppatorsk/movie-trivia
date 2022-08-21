const { nanoid } = require('nanoid'); //temp dependecy so can generate users with uniqe names without me having to do any typing.. lazy, yes..!!

//add more stuff to player class later when needed.. score maybe.. heeh...
module.exports = class Player {
	constructor({ name = 'John Doe' + nanoid(), id = null, avatar = 'https://avatars.dicebear.com/api/avataaars/:keff.svg' } = {}) {
		this.name = name;
		this.id = id;
		this.ready = false;
		this.avatar = avatar;
		this.answers = [];
	}
};
