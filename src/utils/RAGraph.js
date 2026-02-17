/**
 * Resource Allocation Graph — Deadlock Detection
 * Ported to ES6 Module for React
 */

export default class RAGraph {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];      // { id, type: 'process'|'resource', x, y, label }
        this.edges = [];      // { from, to, type: 'request'|'assignment' }
        this.deadlockCycle = [];
        this.dragging = null;
        this.dragOffset = { x: 0, y: 0 };

        this.isDrawingMode = false;
        this.drawingLine = null;

        this.processCount = 0;
        this.resourceCount = 0;

        this.NODE_RADIUS = 28;
        this.COLORS = {
            process: '#3f5ed7',
            resource: '#f59e0b',
            request: '#6b7280',
            assignment: '#10b981',
            deadlock: '#ef4444',
            text: '#fff',
            bg: '#ffffff'
        };

        this._bindEvents();
        this.resize();
    }

    resize() {
        if (!this.canvas) return;
        const parent = this.canvas.parentElement;
        if (parent) {
            this.canvas.width = parent.clientWidth;
            this.canvas.height = 450;
        }
        this.render();
    }

    destroy() {
        window.removeEventListener('resize', this.resize);
    }

    _bindEvents() {
        this.canvas.addEventListener('mousedown', (e) => this._onMouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this._onMouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this._onMouseUp(e));
        this.canvas.addEventListener('mouseleave', (e) => this._onMouseUp(e));

        this.resize = this.resize.bind(this);
        window.addEventListener('resize', this.resize);
    }

    _getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left) * (this.canvas.width / rect.width),
            y: (e.clientY - rect.top) * (this.canvas.height / rect.height)
        };
    }

    _onMouseDown(e) {
        const pos = this._getMousePos(e);
        let clickedNode = null;
        for (const node of this.nodes) {
            const dx = pos.x - node.x;
            const dy = pos.y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) <= this.NODE_RADIUS) {
                clickedNode = node;
                break;
            }
        }

        if (this.isDrawingMode && clickedNode) {
            this.drawingLine = { startNode: clickedNode, endX: pos.x, endY: pos.y };
        } else if (clickedNode) {
            this.dragging = clickedNode;
            this.dragOffset = { x: pos.x - clickedNode.x, y: pos.y - clickedNode.y };
            this.canvas.style.cursor = 'grabbing';
        }
    }

    _onMouseMove(e) {
        const pos = this._getMousePos(e);

        if (this.drawingLine) {
            this.drawingLine.endX = pos.x;
            this.drawingLine.endY = pos.y;
            this.render();
            return;
        }

        if (this.dragging) {
            this.dragging.x = pos.x - this.dragOffset.x;
            this.dragging.y = pos.y - this.dragOffset.y;
            this.render();
            return;
        }

        let overNode = false;
        for (const node of this.nodes) {
            const dx = pos.x - node.x;
            const dy = pos.y - node.y;
            if (Math.sqrt(dx * dx + dy * dy) <= this.NODE_RADIUS) {
                overNode = true;
                break;
            }
        }

        this.canvas.style.cursor = this.isDrawingMode ? (overNode ? 'crosshair' : 'default') : (overNode ? 'grab' : 'default');
    }

    _onMouseUp(e) {
        if (this.drawingLine) {
            const pos = this._getMousePos(e);
            for (const node of this.nodes) {
                const dx = pos.x - node.x;
                const dy = pos.y - node.y;
                if (Math.sqrt(dx * dx + dy * dy) <= this.NODE_RADIUS) {
                    if (node !== this.drawingLine.startNode) {
                        this.addEdge(this.drawingLine.startNode.id, node.id);
                    }
                    break;
                }
            }
            this.drawingLine = null;
            this.render();
        }
        this.dragging = null;
        if (!this.isDrawingMode) this.canvas.style.cursor = 'default';
    }

    addProcess() {
        const id = `P${this.processCount}`;
        const angle = (this.processCount / 6) * Math.PI * 2;
        const cx = this.canvas.width * 0.35;
        const cy = this.canvas.height * 0.5;
        const r = Math.min(this.canvas.width, this.canvas.height) * 0.25;
        this.nodes.push({ id, type: 'process', label: id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        this.processCount++;
        this.deadlockCycle = [];
        this.render();
        return id;
    }

    addResource() {
        const id = `R${this.resourceCount}`;
        const angle = (this.resourceCount / 6) * Math.PI * 2 + Math.PI / 6;
        const cx = this.canvas.width * 0.65;
        const cy = this.canvas.height * 0.5;
        const r = Math.min(this.canvas.width, this.canvas.height) * 0.25;
        this.nodes.push({ id, type: 'resource', label: id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) });
        this.resourceCount++;
        this.deadlockCycle = [];
        this.render();
        return id;
    }

    addEdge(fromId, toId) {
        const from = this.nodes.find(n => n.id === fromId);
        const to = this.nodes.find(n => n.id === toId);
        if (!from || !to) return false;

        let type;
        if (from.type === 'process' && to.type === 'resource') type = 'request';
        else if (from.type === 'resource' && to.type === 'process') type = 'assignment';
        else return false;

        if (this.edges.some(e => e.from === fromId && e.to === toId)) return false;

        this.edges.push({ from: fromId, to: toId, type });
        this.deadlockCycle = [];
        this.render();
        return true;
    }

    removeNode(nodeId) {
        this.edges = this.edges.filter(e => e.from !== nodeId && e.to !== nodeId);
        this.nodes = this.nodes.filter(n => n.id !== nodeId);
        this.deadlockCycle = [];
        this.render();
    }

    removeEdge(fromId, toId) {
        this.edges = this.edges.filter(e => !(e.from === fromId && e.to === toId));
        this.deadlockCycle = [];
        this.render();
    }

    clear() {
        this.nodes = [];
        this.edges = [];
        this.deadlockCycle = [];
        this.processCount = 0;
        this.resourceCount = 0;
        this.render();
    }

    detectDeadlock() {
        const steps = [];
        const adj = {};
        const allProcesses = this.nodes.filter(n => n.type === 'process').map(n => n.id);

        allProcesses.forEach(p => adj[p] = []);

        steps.push('🔧 Building wait-for graph...');
        for (const reqEdge of this.edges.filter(e => e.type === 'request')) {
            const process = reqEdge.from;
            const resource = reqEdge.to;
            const assignEdges = this.edges.filter(e => e.type === 'assignment' && e.from === resource);
            for (const asgn of assignEdges) {
                const holder = asgn.to;
                if (holder !== process) {
                    adj[process].push(holder);
                    steps.push(`   ${process} waits for ${holder} (both need ${resource})`);
                }
            }
        }

        steps.push('🔍 Running DFS cycle detection...');
        const WHITE = 0, GRAY = 1;
        const color = {};
        const parent = {};
        allProcesses.forEach(p => { color[p] = WHITE; parent[p] = null; });

        let cycle = [];
        let foundCycle = false;

        const dfs = (u) => {
            if (foundCycle) return;
            color[u] = GRAY;
            for (const v of (adj[u] || [])) {
                if (foundCycle) return;
                if (color[v] === GRAY) {
                    steps.push(`   ⚠️ Back edge found: ${u} → ${v} (cycle detected!)`);
                    cycle = [v];
                    let curr = u;
                    while (curr !== v) {
                        cycle.push(curr);
                        curr = parent[curr];
                    }
                    cycle.push(v);
                    cycle.reverse();
                    foundCycle = true;
                    return;
                } else if (color[v] === WHITE) {
                    parent[v] = u;
                    dfs(v);
                }
            }
        };

        for (const p of allProcesses) {
            if (color[p] === WHITE && !foundCycle) dfs(p);
        }

        if (foundCycle) {
            this.deadlockCycle = cycle;
            steps.push(`🔴 DEADLOCK DETECTED! Cycle: ${cycle.join(' → ')}`);
        } else {
            this.deadlockCycle = [];
            steps.push(`🟢 No deadlock detected. System is safe.`);
        }

        this.render();
        return { hasDeadlock: foundCycle, cycle, steps };
    }

    loadExample(name) {
        this.clear();
        if (name === 'deadlock') {
            this.addProcess(); this.addProcess();
            this.addResource(); this.addResource();
            const w = this.canvas.width, h = this.canvas.height;
            this.nodes[0].x = w * 0.2; this.nodes[0].y = h * 0.3;
            this.nodes[1].x = w * 0.2; this.nodes[1].y = h * 0.7;
            this.nodes[2].x = w * 0.7; this.nodes[2].y = h * 0.3;
            this.nodes[3].x = w * 0.7; this.nodes[3].y = h * 0.7;
            this.addEdge('R0', 'P0'); this.addEdge('P0', 'R1');
            this.addEdge('R1', 'P1'); this.addEdge('P1', 'R0');
        } else if (name === 'safe') {
            this.addProcess(); this.addProcess(); this.addResource();
            const w = this.canvas.width, h = this.canvas.height;
            this.nodes[0].x = w * 0.2; this.nodes[0].y = h * 0.5;
            this.nodes[1].x = w * 0.5; this.nodes[1].y = h * 0.5;
            this.nodes[2].x = w * 0.8; this.nodes[2].y = h * 0.5;
            this.addEdge('R0', 'P0'); this.addEdge('P1', 'R0');
        }
        this.render();
    }

    render() {
        const ctx = this.ctx;
        const w = this.canvas.width;
        const h = this.canvas.height;
        ctx.clearRect(0, 0, w, h);
        for (const edge of this.edges) this._drawEdge(edge);
        for (const node of this.nodes) this._drawNode(node);
        if (this.drawingLine) this._drawTempLine();
    }

    _drawNode(node) {
        const ctx = this.ctx;
        const r = this.NODE_RADIUS;
        const inCycle = this.deadlockCycle.includes(node.id);
        ctx.save();
        ctx.beginPath();
        if (node.type === 'process') ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        else ctx.rect(node.x - r, node.y - r, r * 2, r * 2);
        ctx.fillStyle = inCycle ? this.COLORS.deadlock : (node.type === 'process' ? this.COLORS.process : this.COLORS.resource);
        ctx.fill();
        ctx.strokeStyle = inCycle ? '#b91c1c' : (node.type === 'process' ? '#2d4bd3' : '#d97706');
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = this.COLORS.text;
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(node.label, node.x, node.y);
        ctx.restore();
    }

    _drawEdge(edge) {
        const ctx = this.ctx;
        const from = this.nodes.find(n => n.id === edge.from);
        const to = this.nodes.find(n => n.id === edge.to);
        if (!from || !to) return;
        const dx = to.x - from.x, dy = to.y - from.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist === 0) return;
        const ux = dx / dist, uy = dy / dist;
        const r = this.NODE_RADIUS;
        const startX = from.x + ux * r;
        const startY = from.y + uy * r;
        const endX = to.x - ux * r;
        const endY = to.y - uy * r;

        let inCycle = false;
        if (this.deadlockCycle.length > 0) {
            if (this.deadlockCycle.includes(edge.from) && this.deadlockCycle.includes(edge.to)) inCycle = true;
        }

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = inCycle ? this.COLORS.deadlock : (edge.type === 'request' ? this.COLORS.request : this.COLORS.assignment);
        ctx.lineWidth = inCycle ? 4 : 2.5;
        if (edge.type === 'request') ctx.setLineDash([8, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        const arrowLen = 12;
        const angle = Math.atan2(endY - startY, endX - startX);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowLen * Math.cos(angle - Math.PI / 7), endY - arrowLen * Math.sin(angle - Math.PI / 7));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowLen * Math.cos(angle + Math.PI / 7), endY - arrowLen * Math.sin(angle + Math.PI / 7));
        ctx.stroke();
        ctx.restore();
    }

    _drawTempLine() {
        if (!this.drawingLine) return;
        const ctx = this.ctx;
        const start = this.drawingLine.startNode;
        const endX = this.drawingLine.endX;
        const endY = this.drawingLine.endY;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = '#6b7280';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.stroke();

        // Draw arrowhead at end
        const arrowLen = 10;
        const angle = Math.atan2(endY - start.y, endX - start.x);
        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowLen * Math.cos(angle - Math.PI / 6), endY - arrowLen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - arrowLen * Math.cos(angle + Math.PI / 6), endY - arrowLen * Math.sin(angle + Math.PI / 6));
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();
    }
}
