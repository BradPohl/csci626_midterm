// App state container (import and mutate in a controlled way)
export const state = {
    matrix: [], // filled in main.js
    cuts: { rows: new Set(), columns: new Set() },
    hover: { type: null, index: null },
    drag: { active: false, r0: null, c0: null, r1: null, c1: null, shift: false },
    extracted: [],
    selectedExtractedId: null
};