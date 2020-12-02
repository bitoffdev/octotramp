/*
 * This file updates the interface of the global window object so that
 * TypeScript will recognize the methods used by P5.js in global mode.
 */
interface Window {
	draw: any;
	setup: any;
}
