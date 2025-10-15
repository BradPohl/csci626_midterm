// Centralized sizing & counts
// Place all constants here to keep them in sync
export const NUM_ROWS = 20;
export const NUM_COLS = 25;
export const CELL = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell'));
export const GUTTER = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--gutter'));
export const PAD = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--pad'));


export const GRID_W = NUM_COLS * CELL;
export const GRID_H = NUM_ROWS * CELL;
export const SVG_W = PAD + GUTTER + GRID_W + PAD;
export const SVG_H = PAD + GUTTER + GRID_H + PAD;