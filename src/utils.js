import { NUM_ROWS, NUM_COLS, CELL, GUTTER, PAD } from './config.js';


export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const uid = (() => { let n = 0; return () => `id_${++n}`; })();

/**
 * Creates a r×c matrix filled with 1..r*c
 * 
 * @param r Rows in the matrix.
 * @param c Columns in the matrix.
 * @returns A 2D array containing the values in the matrix.
 */
export function makeMatrix(r, c) {
    const m = [];
    for (let i = 0; i < r; i++) {
        const row = [];
        for (let j = 0; j < c; j++) row.push(i * c + j + 1);
        m.push(row);
    }
    return m;
}

/**
 * Given SVG coords, returns {r,c} of cell under point (clamped to grid)
 * 
 * @param x SVG x coordinate.
 * @param y SVG y coordinate.
 * @returns An object with the appopriate row and column from the matrix. 
 */
export function cellFromPoint(x, y) {
    const gx = x - (PAD + GUTTER);
    const gy = y - (PAD + GUTTER);
    const c = clamp(Math.floor(gx / CELL), 0, NUM_COLS - 1);
    const r = clamp(Math.floor(gy / CELL), 0, NUM_ROWS - 1);
    return { r, c };
}

/**
 * Given SVG coords, fetches row index of nearest boundary (clamped to 1..N-1)
 * @param x SVG x coordinate.
 * @returns The clamped row index from the matrix.
 */
export function boundaryFromTopGutter(x) {
    const gx = x - (PAD + GUTTER);
    const t = gx / CELL; // 0..NUM_COLS
    return clamp(Math.round(t), 1, NUM_COLS - 1);
}

/**
 * Given SVG coords, fetches column index of nearest boundary (clamped to 1..N-1)
 * @param y SVG y coordinate.
 * @returns The clamped column index from the matrix.
 */
export function boundaryFromLeftGutter(y) {
    const gy = y - (PAD + GUTTER);
    const t = gy / CELL; // 0..NUM_ROWS
    return clamp(Math.round(t), 1, NUM_ROWS - 1);
}

/**
 * Converts cuts {rows:Set, columns:Set} into sorted edge arrays including 0 and max
 * @param cuts An object containing rows and columns.
 * @returns An object containing sorted rows and sorted columns.
 */
export function edgeArrays(cuts) {
    const rows = [0, ...Array.from(cuts.rows).sort((a,b)=>a-b), NUM_ROWS];
    const cols = [0, ...Array.from(cuts.columns).sort((a,b)=>a-b), NUM_COLS];
    return { rows, cols };
}

/**
 * Snaps a rect {r0,c0,r1,c1} to nearest edges defined by cuts; clamps to grid
 * @param rect A rectangle defined as an object with all four corners.
 * @param cuts An object containing rows and columns.
 * @returns The original rectangle with the corners moved to snap it to edges defined by cuts.
 */
export function snapRectToCuts(rect, cuts) {
    const { rows, cols } = edgeArrays(cuts);
    const snap = (v, arr) => arr.reduce((best, cur) => Math.abs(cur - v) < Math.abs(best - v) ? cur : best, arr[0]);
    let top = snap(rect.r0, rows), bottom = snap(rect.r1 + 1, rows);
    let left = snap(rect.c0, cols), right = snap(rect.c1 + 1, cols);

    // Keeps the selection on one side of the cut.
    if(left == right) {
        left--;
    }
    if(bottom == top) {
        top--;
    }

    return { r0: clamp(top, 0, NUM_ROWS - 1), c0: clamp(left, 0, NUM_COLS - 1), r1: clamp(bottom - 1, 0, NUM_ROWS - 1), c1: clamp(right - 1, 0, NUM_COLS - 1) };
}

/**
 * Given {r0,c0,r1,c1}, returns normalized version with r0<=r1 and c0<=c1
 * @param {*} param0 A rectangle object in {row, column, row, column} form.
 * @returns The rectangle object such that the first row/column is less than the second row/column.
 */
export const normalizedRect = ({ r0, c0, r1, c1 }) => ({ r0: Math.min(r0, r1), c0: Math.min(c0, c1), r1: Math.max(r0, r1), c1: Math.max(c0, c1) });