import React from 'react';
import type { GameMode } from '../hooks/useTypingEngine';
import { MdTimer, MdTextFields, MdFormatQuote } from 'react-icons/md';
import { TbNumbers, TbCode, TbInfinity } from 'react-icons/tb';

interface ConfigBarProps {
    mode: GameMode;
    config: number;
    setMode: (mode: GameMode) => void;
    setConfig: (config: number) => void;
}

const modeIcons: Record<GameMode, React.ReactNode> = {
    time: <MdTimer />,
    words: <MdTextFields />,
    quote: <MdFormatQuote />,
    numbers: <TbNumbers />,
    code: <TbCode />,
    zen: <TbInfinity />,
    custom: <MdTextFields />
};

const ConfigBar: React.FC<ConfigBarProps> = ({ mode, config, setMode, setConfig }) => {
    return (
        <div className="config-bar">
            <div className="config-group">
                {(['time', 'words', 'quote', 'numbers', 'code', 'zen'] as GameMode[]).map(m => (
                    <button
                        key={m}
                        className={`config-btn ${mode === m ? 'active' : ''}`}
                        onClick={() => setMode(m)}
                        title={m}
                    >
                        <span className="mode-icon">{modeIcons[m]}</span>
                        <span className="mode-label">{m}</span>
                    </button>
                ))}
            </div>

            {(mode === 'time' || mode === 'words' || mode === 'numbers') && (
                <>
                    <div className="divider"></div>
                    <div className="config-group">
                        {mode === 'time' ? (
                            <>
                                <button className={`config-btn ${config === 15 ? 'active' : ''}`} onClick={() => setConfig(15)}>15</button>
                                <button className={`config-btn ${config === 30 ? 'active' : ''}`} onClick={() => setConfig(30)}>30</button>
                                <button className={`config-btn ${config === 60 ? 'active' : ''}`} onClick={() => setConfig(60)}>60</button>
                                <button className={`config-btn ${config === 120 ? 'active' : ''}`} onClick={() => setConfig(120)}>120</button>
                            </>
                        ) : (
                            <>
                                <button className={`config-btn ${config === 10 ? 'active' : ''}`} onClick={() => setConfig(10)}>10</button>
                                <button className={`config-btn ${config === 25 ? 'active' : ''}`} onClick={() => setConfig(25)}>25</button>
                                <button className={`config-btn ${config === 50 ? 'active' : ''}`} onClick={() => setConfig(50)}>50</button>
                                <button className={`config-btn ${config === 100 ? 'active' : ''}`} onClick={() => setConfig(100)}>100</button>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default ConfigBar;
