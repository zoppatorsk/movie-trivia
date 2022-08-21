import { writable } from 'svelte/store';

//define up the rest of the gameProsp object later..
export const activeComponent = writable('start');
//export const activeComponent = writable('lobby');
export const players = writable([
	// { name: 'connt med det länsge naments', avatar: 'https://avatars.dicebear.com/api/avataaars/:Player1.svg' },
	// { name: 'Player 2', avatar: 'https://avatars.dicebear.com/api/avataaars/:Player2.svg' },
	// { name: 'Player 4', avatar: 'https://avatars.dicebear.com/api/avataaars/:Playsdfsdfer2.svg' },
	// { name: 'Benke bananen', avatar: 'https://avatars.dicebear.com/api/avataaars/:Pladddyer2.svg' },
]);
export const gameProps = writable({ id: '', waitBetweenRound: 5, roundTime: 30 });
export const playerId = writable('');
