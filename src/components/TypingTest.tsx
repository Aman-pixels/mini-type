import React, { useEffect, useRef, useState } from 'react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import ConfigBar from './ConfigBar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MdRestartAlt } from 'react-icons/md';

interface TypingTestProps {
    engine: ReturnType<typeof useTypingEngine>;
}

const TypingTest: React.FC<TypingTestProps> = ({ engine }) => {
    const {
        words, cursor, status, reset, handleInput, startTime, endTime,
        mode, config, timeRemaining, setMode, setConfig, wpmHistory
    } = engine;

    const [showLiveWPM, setShowLiveWPM] = useState(false);
    const [liveWPM, setLiveWPM] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const currentWordRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (status !== 'finished') {
            inputRef.current?.focus();
        }
    }, [status]);

    // Calculate live WPM
    useEffect(() => {
        if (status === 'running' && startTime) {
            const interval = setInterval(() => {
                const correctChars = words.reduce((acc, word) =>
                    acc + word.letters.filter(l => l.status === 'correct').length, 0
                );
                const timeInMinutes = (Date.now() - startTime) / 60000;
                const wpm = Math.round((correctChars / 5) / timeInMinutes);
                setLiveWPM(isNaN(wpm) ? 0 : wpm);
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [status, startTime, words]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            reset();
            return;
        }
        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.key.length === 1 || e.key === 'Backspace' || e.key === ' ') {
            e.preventDefault();
            handleInput(e.key);
        }
    };

    // Calculate Stats
    const calculateStats = () => {
        const correctChars = words.reduce((acc, word) => acc + word.letters.filter(l => l.status === 'correct').length, 0);
        const incorrectChars = words.reduce((acc, word) => acc + word.letters.filter(l => l.status === 'incorrect').length, 0);
        const extraChars = words.reduce((acc, word) => acc + word.letters.filter(l => l.status === 'extra').length, 0);
        const totalTyped = correctChars + incorrectChars + extraChars;

        const timeInMinutes = (endTime! - startTime!) / 60000;
        const wpm = Math.round((correctChars / 5) / timeInMinutes);
        const rawWpm = Math.round((totalTyped / 5) / timeInMinutes);
        const accuracy = totalTyped > 0 ? Math.round((correctChars / totalTyped) * 100) : 0;

        // Calculate consistency (standard deviation of WPM)
        const wpmValues = wpmHistory.map(h => h.wpm);
        const avgWpm = wpmValues.reduce((a, b) => a + b, 0) / wpmValues.length;
        const variance = wpmValues.reduce((sum, val) => sum + Math.pow(val - avgWpm, 2), 0) / wpmValues.length;
        const stdDev = Math.sqrt(variance);
        const consistency = Math.max(0, Math.round(100 - (stdDev / avgWpm) * 100));

        return { wpm, rawWpm, accuracy, correctChars, incorrectChars, extraChars, consistency };
    };

    if (status === 'finished') {
        const { wpm, rawWpm, accuracy, correctChars, incorrectChars, extraChars, consistency } = calculateStats();

        return (
            <div className="result-screen-new">
                <div className="result-top">
                    <div className="result-main-stats">
                        <div className="main-stat">
                            <div className="stat-label">wpm</div>
                            <div className="stat-value-large">{isNaN(wpm) ? 0 : wpm}</div>
                        </div>
                        <div className="main-stat">
                            <div className="stat-label">acc</div>
                            <div className="stat-value-large">{isNaN(accuracy) ? 0 : accuracy}%</div>
                        </div>
                    </div>

                    <div className="result-graph">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={wpmHistory}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2c2e31" />
                                <XAxis
                                    dataKey="time"
                                    stroke="#646669"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#646669"
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#2c2e31',
                                        border: 'none',
                                        borderRadius: '4px',
                                        color: '#d1d0c5'
                                    }}
                                    itemStyle={{ color: '#e2b714' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="wpm"
                                    stroke="#e2b714"
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 4, fill: '#e2b714' }}
                                    name="wpm"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="result-details">
                    <div className="detail-item">
                        <div className="detail-label">test type</div>
                        <div className="detail-value">{mode} {config}</div>
                        <div className="detail-sublabel">{engine.language}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">raw</div>
                        <div className="detail-value">{isNaN(rawWpm) ? 0 : rawWpm}</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">characters</div>
                        <div className="detail-value">{correctChars}/{incorrectChars}/{extraChars}/0</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">consistency</div>
                        <div className="detail-value">{isNaN(consistency) ? 0 : consistency}%</div>
                    </div>
                    <div className="detail-item">
                        <div className="detail-label">time</div>
                        <div className="detail-value">{Math.round((endTime! - startTime!) / 1000)}s</div>
                    </div>
                </div>

                <div className="result-actions">
                    <button className="action-btn" onClick={reset} title="Restart test">
                        <MdRestartAlt />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="typing-wrapper">
            <ConfigBar mode={mode} config={config} setMode={setMode} setConfig={setConfig} />

            <div className="live-stats">
                {mode === 'time' ? (
                    <div className="timer">{timeRemaining}</div>
                ) : mode === 'zen' ? (
                    <div className="counter">∞</div>
                ) : (
                    <div className="counter">{cursor.wordIndex + 1}/{config}</div>
                )}
                {showLiveWPM && status === 'running' && (
                    <div className="live-wpm">{liveWPM} wpm</div>
                )}
            </div>

            <div
                className="typing-test"
                onClick={() => inputRef.current?.focus()}
                ref={containerRef}
            >
                <input
                    ref={inputRef}
                    className="hidden-input"
                    type="text"
                    onKeyDown={handleKeyDown}
                    autoFocus
                    onBlur={(e) => e.target.focus()}
                />

                <div className="words-container" style={{ maxHeight: '150px', overflow: 'hidden' }}>
                    {words.map((word, wIndex) => {
                        if (wIndex < cursor.wordIndex - 20 || wIndex > cursor.wordIndex + 50) return null;

                        return (
                            <div
                                key={wIndex}
                                className={`word ${wIndex === cursor.wordIndex ? 'active' : ''}`}
                                ref={wIndex === cursor.wordIndex ? currentWordRef : null}
                            >
                                {word.letters.map((letter, lIndex) => {
                                    const isCursor = wIndex === cursor.wordIndex && lIndex === cursor.letterIndex;
                                    return (
                                        <span key={lIndex} className={`letter ${letter.status} ${isCursor ? 'cursor' : ''}`}>
                                            {letter.char}
                                        </span>
                                    );
                                })}
                                {wIndex === cursor.wordIndex && cursor.letterIndex === word.letters.length && (
                                    <span className="letter cursor">&nbsp;</span>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="restart-hint">Press Tab to restart</div>
            </div>

            <footer className="app-footer">
                <div className="footer-section">
                    <span className="footer-label">shortcuts</span>
                    <span className="footer-item">tab - restart test</span>
                    <span className="footer-item">esc - close modal</span>
                </div>
                <div className="footer-section">
                    <span className="footer-label">info</span>
                    <span className="footer-item" onClick={() => setShowLiveWPM(!showLiveWPM)} style={{ cursor: 'pointer' }}>
                        {showLiveWPM ? 'hide' : 'show'} live wpm
                    </span>
                </div>
            </footer>
        </div>
    );
};

export default TypingTest;
