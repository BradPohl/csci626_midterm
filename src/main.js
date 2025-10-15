import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { SVG_W, SVG_H, PAD, GUTTER, GRID_W, GRID_H } from './config.js';
import { state } from './state.js';
import { makeMatrix, uid } from './utils.js';
import { renderGrid } from './renderGrid.js';
import { renderCuts } from './renderCuts.js';
import { renderHover } from './renderHover.js';
import { renderSelection } from './renderSelection.js';
import { attachGutterInteractions, makeDragHandlers } from './interactions.js';
import { renderExtracted } from './renderExtracted.js';


// Initialize matrix
state.matrix = makeMatrix(20, 25);

// Root SVG
const svg = d3.select('#grid-wrap')
    .append('svg')
    .attr('width', SVG_W)
    .attr('height', SVG_H)
    .attr('role', 'img')
    .attr('aria-label', '20 by 25 matrix with interactive split controls in margins');


// Layers
const gRoot = svg.append('g');
const gGrid = gRoot.append('g').attr('transform', `translate(${PAD + GUTTER}, ${PAD + GUTTER})`);
const gCuts = gRoot.append('g').attr('transform', `translate(${PAD + GUTTER}, ${PAD + GUTTER})`);
const gHover = gRoot.append('g').attr('transform', `translate(${PAD + GUTTER}, ${PAD + GUTTER})`);
const gSel = gRoot.append('g').attr('transform', `translate(${PAD + GUTTER}, ${PAD + GUTTER})`);


// Gutters
const topGutter = gRoot.append('rect')
    .attr('x', PAD + GUTTER).attr('y', PAD)
    .attr('width', GRID_W).attr('height', GUTTER)
    .attr('fill', 'transparent').style('cursor', 'ns-resize');
    const leftGutter = gRoot.append('rect')
    .attr('x', PAD).attr('y', PAD + GUTTER)
    .attr('width', GUTTER).attr('height', GRID_H)
    .attr('fill', 'transparent').style('cursor', 'ew-resize');


// Renderers & interactions
const { startDrag, updateDrag, endDrag } = makeDragHandlers(svg, state, {
    renderSelection: () => renderSelection(gSel, state),
    onExtract: (rect) => {
        const data = [];
        for (let r = rect.r0; r <= rect.r1; r++) data.push(state.matrix[r].slice(rect.c0, rect.c1 + 1));
        state.extracted.push({ id: uid(), rect: { ...rect }, data });
        renderExtracted('#extracted', state);
    }
});


attachGutterInteractions(svg, gRoot, topGutter, leftGutter, state, {
    renderHover: () => renderHover(gHover, state),
    renderCuts: () => renderCuts(gCuts, state)
});


renderGrid(gGrid, state, { onMouseDown: startDrag, onMouseMove: updateDrag, onMouseUp: endDrag });
renderCuts(gCuts, state);
renderHover(gHover, state);
renderExtracted('#extracted', state);

// Keyboard interaction for deleting extracted sections
window.addEventListener('keydown', (ev) => {
    if (ev.key !== 'Delete' && ev.key !== 'Backspace') return;
    const id = state.selectedExtractedId;
    if (!id) return;
    const idx = state.extracted.findIndex(e => e.id === id);
    if (idx >= 0) {
        state.extracted.splice(idx, 1);
        state.selectedExtractedId = null;
        renderExtracted('#extracted', state);
    }
});