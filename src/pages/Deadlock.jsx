import React, { useState, useEffect, useRef } from 'react';
import BankersAlgorithm from '../utils/Banker';
import RAGraph from '../utils/RAGraph';
import './Deadlock.css';

const Deadlock = () => {
    const [activeTab, setActiveTab] = useState('banker'); // 'banker' | 'rag'

    // Banker's State
    const [numProc, setNumProc] = useState(5);
    const [numRes, setNumRes] = useState(3);
    const [bankerData, setBankerData] = useState(null); // { alloc, max, avail }
    const [bankerResult, setBankerResult] = useState(null);
    const [requestResult, setRequestResult] = useState(null);

    // RAG State
    const ragCanvasRef = useRef(null);
    const ragRef = useRef(null);
    const [ragNodes, setRagNodes] = useState([]); // For dropdowns
    const [isDrawing, setIsDrawing] = useState(false);
    const [ragResult, setRagResult] = useState(null);

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(false);
    const [showHelp, setShowHelp] = useState(false);

    // Initialize Tutorial
    useEffect(() => {
        const seen = sessionStorage.getItem('tutorialSeen');
        if (!seen) setShowTutorial(true);
    }, []);

    // Initialize RAG
    useEffect(() => {
        if (activeTab === 'rag' && ragCanvasRef.current) {
            if (!ragRef.current) {
                ragRef.current = new RAGraph(ragCanvasRef.current);
                // Hook into add/remove checks to update React state for dropdowns?
                // Since RAGraph manages its own nodes array, we need a way to sync or just manually refresh dropdowns when we click buttons.
                // Be lazy: Just manually create a refresh function React side that reads from ragRef.
            } else {
                ragRef.current.resize();
            }
        }
    }, [activeTab]);

    // Refresh dropdowns helper
    const refreshRagDropdowns = () => {
        if (ragRef.current) {
            setRagNodes([...ragRef.current.nodes]);
        }
    };

    // ================= BANKER FUNCTIONS =================
    const handleGenerate = () => {
        // Create empty matrices
        const alloc = Array(numProc).fill().map(() => Array(numRes).fill(0));
        const max = Array(numProc).fill().map(() => Array(numRes).fill(0));
        const avail = Array(numRes).fill(0);
        setBankerData({ alloc, max, avail });
        setBankerResult(null);
        setRequestResult(null);
    };

    const updateMatrix = (type, i, j, val) => {
        const newData = { ...bankerData };
        if (type === 'alloc') newData.alloc[i][j] = parseInt(val) || 0;
        if (type === 'max') newData.max[i][j] = parseInt(val) || 0;
        if (type === 'avail') newData.avail[j] = parseInt(val) || 0;
        setBankerData(newData);
    };

    const runSafety = () => {
        if (!bankerData) return;
        const ba = new BankersAlgorithm(numProc, numRes);
        ba.setData(bankerData.alloc, bankerData.max, bankerData.avail);
        const res = ba.checkSafety();
        setBankerResult(res);
    };

    const handleRequest = (e) => {
        e.preventDefault();
        const pid = parseInt(e.target.pid.value);
        const req = [];
        for (let i = 0; i < numRes; i++) req.push(parseInt(e.target[`r${i}`].value) || 0);

        const ba = new BankersAlgorithm(numProc, numRes);
        ba.setData(bankerData.alloc, bankerData.max, bankerData.avail);
        const res = ba.requestResources(pid, req);
        setRequestResult(res);

        // Update UI if granted
        if (res.granted) {
            const newAlloc = ba.allocation;
            const newAvail = ba.available;
            setBankerData(prev => ({ ...prev, alloc: newAlloc, avail: newAvail }));
        }
    };

    const loadBankerExample = () => {
        setNumProc(5); setNumRes(3);
        const alloc = [[0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2]];
        const max = [[7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3]];
        const avail = [3, 3, 2];
        setBankerData({ alloc, max, avail });
        setBankerResult(null);
    };

    // ================= RAG FUNCTIONS =================
    const handleRagAction = (action, payload) => {
        if (!ragRef.current) return;
        const rag = ragRef.current; // shorthand

        if (action === 'addProc') rag.addProcess();
        if (action === 'addRes') rag.addResource();
        if (action === 'addEdge') rag.addEdge(payload.from, payload.to);
        if (action === 'removeNode') rag.removeNode(payload.id);
        if (action === 'clear') rag.clear();
        if (action === 'loadDeadlock') rag.loadExample('deadlock');
        if (action === 'detect') {
            const res = rag.detectDeadlock();
            setRagResult(res);
        }
        if (action === 'toggleDraw') {
            rag.isDrawingMode = !rag.isDrawingMode;
            setIsDrawing(rag.isDrawingMode);
        }

        refreshRagDropdowns();
    };


    return (
        <div className="container deadlock-container">
            <h1 className="title">Deadlock Detection & Avoidance Simulator</h1>

            <div className="tab-bar">
                <button className={`tab-btn ${activeTab === 'banker' ? 'active' : ''}`} onClick={() => setActiveTab('banker')}>
                    🛡️ Banker's Algorithm
                </button>
                <button className={`tab-btn ${activeTab === 'rag' ? 'active' : ''}`} onClick={() => setActiveTab('rag')}>
                    🔍 Resource Allocation Graph
                </button>
            </div>

            {/* BANKER TAB */}
            {activeTab === 'banker' && (
                <div className="fade-in">
                    <div className="card">
                        <h2>Configuration</h2>
                        <div className="input-row">
                            <label>Processes (N):</label>
                            <input type="number" value={numProc} onChange={e => setNumProc(parseInt(e.target.value))} min="1" />
                            <label>Resources (M):</label>
                            <input type="number" value={numRes} onChange={e => setNumRes(parseInt(e.target.value))} min="1" />
                        </div>
                        <div className="btn-row">
                            <button className="btn btn-primary" onClick={handleGenerate}>Generate Tables</button>
                            <button className="btn btn-secondary" onClick={loadBankerExample}>Load Example</button>
                        </div>
                    </div>

                    {bankerData && (
                        <>
                            <div className="card">
                                <h2>System State</h2>
                                <div className="matrices-row">
                                    <div className="matrix-wrapper">
                                        <h3>Allocation</h3>
                                        <table className="matrix-table">
                                            <thead><tr><th></th>{Array(numRes).fill().map((_, j) => <th key={j}>R{j}</th>)}</tr></thead>
                                            <tbody>
                                                {bankerData.alloc.map((row, i) => (
                                                    <tr key={i}><td><b>P{i}</b></td>{row.map((val, j) => (
                                                        <td key={j}><input type="number" value={val} onChange={e => updateMatrix('alloc', i, j, e.target.value)} /></td>
                                                    ))}</tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="matrix-wrapper">
                                        <h3>Max</h3>
                                        <table className="matrix-table">
                                            <thead><tr><th></th>{Array(numRes).fill().map((_, j) => <th key={j}>R{j}</th>)}</tr></thead>
                                            <tbody>
                                                {bankerData.max.map((row, i) => (
                                                    <tr key={i}><td><b>P{i}</b></td>{row.map((val, j) => (
                                                        <td key={j}><input type="number" value={val} onChange={e => updateMatrix('max', i, j, e.target.value)} /></td>
                                                    ))}</tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="matrices-row" style={{ marginTop: '10px' }}>
                                    <div className="matrix-wrapper">
                                        <h3>Need <span style={{ fontSize: '12px', color: '#888' }}>(Max − Alloc)</span></h3>
                                        <table className="matrix-table">
                                            <thead><tr><th></th>{Array(numRes).fill().map((_, j) => <th key={j}>R{j}</th>)}</tr></thead>
                                            <tbody>
                                                {bankerData.max.map((row, i) => (
                                                    <tr key={i}><td><b>P{i}</b></td>{row.map((val, j) => (
                                                        <td key={j} style={{ background: '#f9fafb' }}>{val - bankerData.alloc[i][j]}</td>
                                                    ))}</tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="matrix-wrapper">
                                        <h3>Available</h3>
                                        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                                            {bankerData.avail.map((val, j) => (
                                                <div key={j}>
                                                    <b>R{j}:</b> <input type="number" value={val} onChange={e => updateMatrix('avail', 0, j, e.target.value)} style={{ width: '60px' }} />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card">
                                <h2>Safety Check</h2>
                                <button className="btn btn-primary" onClick={runSafety}>Run Safety Algorithm</button>
                                {bankerResult && (
                                    <div className="result-box">
                                        <div className={`badge ${bankerResult.safe ? 'safe' : 'unsafe'}`}>
                                            {bankerResult.safe ? 'SAFE STATE' : 'UNSAFE STATE'}
                                        </div>
                                        <div className="step-log">
                                            {bankerResult.steps.map((s, i) => (
                                                <div key={i} className={`log-item ${s.includes('✅') ? 'safe' : (s.includes('❌') ? 'unsafe' : '')}`}>{s}</div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="card">
                                <h2>Make Request</h2>
                                <form onSubmit={handleRequest} className="input-row">
                                    <select name="pid">{Array(numProc).fill().map((_, i) => <option key={i} value={i}>P{i}</option>)}</select>
                                    {Array(numRes).fill().map((_, j) => <input key={j} name={`r${j}`} placeholder={`R${j}`} type="number" required />)}
                                    <button className="btn btn-success">Submit</button>
                                </form>
                                {requestResult && (
                                    <div className="step-log">
                                        {requestResult.steps.map((s, i) => (
                                            <div key={i} className={`log-item ${s.includes('✅') ? 'safe' : (s.includes('❌') ? 'unsafe' : '')}`}>{s}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* RAG TAB */}
            {activeTab === 'rag' && (
                <div className="fade-in">
                    <div className="card">
                        <h2>Resource Allocation Graph</h2>
                        <div className="rag-controls">
                            <button className="btn btn-primary" onClick={() => handleRagAction('addProc')}>+ Process</button>
                            <button className="btn btn-success" onClick={() => handleRagAction('addRes')}>+ Resource</button>
                            <div style={{ borderLeft: '1px solid #ccc', margin: '0 10px' }}></div>
                            <button className="btn btn-secondary" onClick={() => handleRagAction('toggleDraw')}
                                style={isDrawing ? { background: '#3f5ed7', color: '#fff' } : {}}>
                                ✏️ Draw Edge {isDrawing ? '(On)' : '(Off)'}
                            </button>
                        </div>
                        <div className="rag-controls">
                            {/* Simplified edge adding via dropdowns backup */}
                            <button className="btn btn-danger" onClick={() => handleRagAction('clear')}>Clear All</button>
                            <button className="btn btn-secondary" onClick={() => handleRagAction('loadDeadlock')}>Load Deadlock Example</button>
                        </div>

                        <div className="canvas-wrapper">
                            <canvas ref={ragCanvasRef} style={{ width: '100%', display: 'block' }}></canvas>
                        </div>

                        <div className="btn-row">
                            <button className="btn btn-danger" onClick={() => handleRagAction('detect')}>🔍 Detect Deadlock</button>
                        </div>

                        {ragResult && (
                            <div className="step-log">
                                {ragResult.steps.map((s, i) => (
                                    <div key={i} className={`log-item ${s.includes('🔴') ? 'unsafe' : 'safe'}`}>{s}</div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TUTORIAL MODAL */}
            {showTutorial && (
                <div className="tutorial-overlay">
                    <div className="tutorial-box">
                        <h2>Welcome to Deadlock Sim! 🎓</h2>
                        <p>Ready to learn about Deadlock Avoidance vs Detection?</p>
                        <div className="btn-row" style={{ justifyContent: 'center' }}>
                            <button className="btn btn-primary" onClick={() => { setShowTutorial(false); sessionStorage.setItem('tutorialSeen', 'true'); setShowHelp(true); }}>Yes, Show Me</button>
                            <button className="btn btn-secondary" onClick={() => { setShowTutorial(false); sessionStorage.setItem('tutorialSeen', 'true'); }}>Skip</button>
                        </div>
                    </div>
                </div>
            )}

            {/* HELP FAB */}
            <button className="help-fab" onClick={() => setShowHelp(!showHelp)}>?</button>
            {showHelp && (
                <div className="help-panel">
                    <h4>💡 How to Use</h4>
                    {activeTab === 'banker' ? (
                        <ul>
                            <li>Set Config & Generate Tables</li>
                            <li>Fill in Allocation & Max matrices</li>
                            <li>Run Safety Algorithm to check state</li>
                        </ul>
                    ) : (
                        <ul>
                            <li>Add Processes & Resources</li>
                            <li>Use 'Draw Edge' to drag solid lines</li>
                            <li>Red = Deadlock Cycle detected</li>
                        </ul>
                    )}
                </div>
            )}

        </div>
    );
};

export default Deadlock;
