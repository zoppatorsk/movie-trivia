import { writable } from 'svelte/store';

//define up the rest of the gameProsp object later..
export const activeComponent = writable('start');
export const players = writable([]);
export const gameProps = writable({ id: '' });
export const playerId = writable('');
