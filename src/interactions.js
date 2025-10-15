import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm';
import { boundaryFromLeftGutter, boundaryFromTopGutter, cellFromPoint, normalizedRect, snapRectToCuts } from './utils.js';
import { renderSelection } from './renderSelection.js';

// Attaches interactions to gutters for adding/removing cuts
export function attachGutterInteractions(svg, gRoot, topGutter, leftGutter, state, { renderHover, renderCuts }) {
    // on mousemove in gutters, update state.hover; on click, toggle cut; on mouseleave, clear hover
    topGutter.on('mousemove', (ev) => {
        const p = d3.pointer(ev, svg.node());
        state.hover.type = 'col';
        state.hover.index = boundaryFromTopGutter(p[0]);
        renderHover();
    }).on('mouseleave', () => { state.hover.type = null; state.hover.index = null; renderHover(); })
    .on('click', () => {
        if (state.hover.type === 'col' && state.hover.index != null) {
            if (state.cuts.columns.has(state.hover.index)) state.cuts.columns.delete(state.hover.index);
            else state.cuts.columns.add(state.hover.index);
            renderCuts(); renderHover();
        }
    });
    
    leftGutter.on('mousemove', (ev) => {
        const p = d3.pointer(ev, svg.node());
        state.hover.type = 'row';
        state.hover.index = boundaryFromLeftGutter(p[1]);
        renderHover();
    })
    .on('mouseleave', () => { state.hover.type = null; state.hover.index = null; renderHover(); })
    .on('click', () => {
        if (state.hover.type === 'row' && state.hover.index != null) {
            if (state.cuts.rows.has(state.hover.index)) state.cuts.rows.delete(state.hover.index);
            else state.cuts.rows.add(state.hover.index);
            renderCuts(); renderHover();
        }
    });

    // keyboard
    window.addEventListener('keydown', (ev) => {
        if ((ev.key === 'Delete' || ev.key === 'Backspace') && state.hover.type && state.hover.index != null) {
            if (state.hover.type === 'row') {
                if (state.cuts.rows.has(state.hover.index)) state.cuts.rows.delete(state.hover.index);
            } else if (state.hover.type === 'col') {
                if (state.cuts.columns.has(state.hover.index)) state.cuts.columns.delete(state.hover.index);
            }
            renderCuts(); renderHover();
        }
    });
}

// Creates drag handlers for selection; returns {startDrag, updateDrag, endDrag}
export function makeDragHandlers(svg, state, { renderSelection, onExtract }) {

    // on mousedown in grid, start drag; on mousemove, update drag; on mouseup, end drag
    function startDrag(ev) {
        const p = d3.pointer(ev, svg.node());
        const { r, c } = cellFromPoint(p[0], p[1]);
        state.drag.active = true;
        state.drag.r0 = state.drag.r1 = r;
        state.drag.c0 = state.drag.c1 = c;
        state.drag.shift = ev.shiftKey;
        window.addEventListener('mousemove', updateDrag);
        window.addEventListener('mouseup', endDrag);
        renderSelection();
    }
    // on mousemove, update state.drag {r1,c1}; if shift, snap to cuts; call renderSelection
    function updateDrag(ev) {
        if (!state.drag.active) return;
        const p = d3.pointer(ev, svg.node());
        const { r, c } = cellFromPoint(p[0], p[1]);
        state.drag.r1 = r; state.drag.c1 = c; state.drag.shift = ev.shiftKey;


        let rect = normalizedRect({ r0: state.drag.r0, c0: state.drag.c0, r1: state.drag.r1, c1: state.drag.c1 });
        if (state.drag.shift) rect = snapRectToCuts(rect, state.cuts);


        const prev = { ...state.drag };
        state.drag.r0 = rect.r0; state.drag.c0 = rect.c0; state.drag.r1 = rect.r1; state.drag.c1 = rect.c1;
        renderSelection();
        state.drag = { ...prev, active: true };
    }

    // on mouseup, finalize state.drag; if shift, snap to cuts; call onExtract with final rect; clear drag state; call renderSelection
    function endDrag(ev) {
        if (!state.drag.active) return;
        const p = d3.pointer(ev, svg.node());
        const { r, c } = cellFromPoint(p[0], p[1]);
        state.drag.r1 = r; state.drag.c1 = c; state.drag.shift = ev.shiftKey;


        let rect = normalizedRect(state.drag);
        if (state.drag.shift) rect = snapRectToCuts(rect, state.cuts);


        onExtract(rect);
        state.drag.active = false;
        renderSelection();
        window.removeEventListener('mousemove', updateDrag);
        window.removeEventListener('mouseup', endDrag);
    }

    return { startDrag, updateDrag, endDrag };
}