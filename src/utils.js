import { NUM_ROWS, NUM_COLS, CELL, GUTTER, PAD } from './config.js';


export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
export const uid = (() => { let n = 0; return () => `id_${++n}`; })();

// Creates a r×c matrix filled with 1..r*c
export function makeMatrix(r, c) {
    const m = [];
    for (let i = 0; i < r; i++) {
        const row = [];
        for (let j = 0; j < c; j++) row.push(i * c + j + 1);
        m.push(row);
    }
    return m;
}

// Given SVG coords, returns {r,c} of cell under point (clamped to grid)
export function cellFromPoint(x, y) {
    const gx = x - (PAD + GUTTER);
    const gy = y - (PAD + GUTTER);
    const c = clamp(Math.floor(gx / CELL), 0, NUM_COLS - 1);
    const r = clamp(Math.floor(gy / CELL), 0, NUM_ROWS - 1);
    return { r, c };
}

// Given SVG coords, returns row index of nearest boundary (clamped to 1..N-1)
export function boundaryFromTopGutter(x) {
    const gx = x - (PAD + GUTTER);
    const t = gx / CELL; // 0..NUM_COLS
    return clamp(Math.round(t), 1, NUM_COLS - 1);
}

// Given SVG coords, returns column index of nearest boundary (clamped to 1..N-1)
export function boundaryFromLeftGutter(y) {
    const gy = y - (PAD + GUTTER);
    const t = gy / CELL; // 0..NUM_ROWS
    return clamp(Math.round(t), 1, NUM_ROWS - 1);
}

// Converts cuts {rows:Set, columns:Set} into sorted edge arrays including 0 and max
export function edgeArrays(cuts) {
    const rows = [0, ...Array.from(cuts.rows).sort((a,b)=>a-b), NUM_ROWS];
    const cols = [0, ...Array.from(cuts.columns).sort((a,b)=>a-b), NUM_COLS];
    return { rows, cols };
}

// Snaps a rect {r0,c0,r1,c1} to nearest edges defined by cuts; clamps to grid
export function snapRectToCuts(rect, cuts) {
    const { rows, cols } = edgeArrays(cuts);
    const snap = (v, arr) => arr.reduce((best, cur) => Math.abs(cur - v) < Math.abs(best - v) ? cur : best, arr[0]);
    let top = snap(rect.r0, rows), bottom = snap(rect.r1 + 1, rows);
    let left = snap(rect.c0, cols), right = snap(rect.c1 + 1, cols);
    return { r0: clamp(top, 0, NUM_ROWS - 1), c0: clamp(left, 0, NUM_COLS - 1), r1: clamp(bottom - 1, 0, NUM_ROWS - 1), c1: clamp(right - 1, 0, NUM_COLS - 1) };
}

// Given {r0,c0,r1,c1}, returns normalized version with r0<=r1 and c0<=c1
export const normalizedRect = ({ r0, c0, r1, c1 }) => ({ r0: Math.min(r0, r1), c0: Math.min(c0, c1), r1: Math.max(r0, r1), c1: Math.max(c0, c1) });