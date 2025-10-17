import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { CELL, GRID_W, GRID_H, PAD, GUTTER } from './config.js';

/**
 * Draws cells & outer border; attaches basic pointer handlers on cells
 * @param gGrid D3 selector for the grid layer g element for the app.
 * @param state JS object with the current state information for the app.
 * @param {*} param2 The event handler functions to use for the grid.
 */
export function renderGrid(gGrid, state, { onMouseDown, onMouseMove, onMouseUp }) {
    const cellData = [];
    const rows = state.matrix.length;
    const cols = state.matrix[0].length;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cellData.push({ r, c, v: state.matrix[r][c] });


    const cells = gGrid.selectAll('rect.cell').data(cellData, d => `${d.r}-${d.c}`);
    cells.enter().append('rect')
        .attr('class', 'cell')
        .attr('x', d => d.c * CELL)
        .attr('y', d => d.r * CELL)
        .attr('width', CELL)
        .attr('height', CELL)
        .attr('fill', '#fff')
        .attr('stroke', getComputedStyle(document.documentElement).getPropertyValue('--grid-stroke'))
        .attr('stroke-width', 1)
        .on('mousedown', onMouseDown)
        .on('mousemove', onMouseMove)
        .on('mouseup', onMouseUp);

    gGrid.selectAll('rect.border').data([0]).join('rect')
        .attr('class', 'border')
        .attr('x', 0).attr('y', 0)
        .attr('width', GRID_W).attr('height', GRID_H)
        .attr('fill', 'none')
        .attr('stroke', '#9ca3af')
        .attr('stroke-width', 1.5);
}