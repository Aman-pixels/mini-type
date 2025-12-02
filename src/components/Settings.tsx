import React, { useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import type { Theme } from '../context/ThemeContext';
import type { Language } from '../utils/languages';
import { soundManager } from '../utils/sound';

interface SettingsProps {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
}

const themeLabels: Record<Theme, string> = {
    serika_dark: 'Serika Dark',
    dracula: 'Dracula',
    cyberpunk: 'Cyberpunk',
    light: 'Light',
    nord: 'Nord',
    monokai: 'Monokai',
    gruvbox: 'Gruvbox',
    solarized_dark: 'Solarized Dark',
    tokyo_night: 'Tokyo Night'
};

const Settings: React.FC<SettingsProps> = ({ currentLanguage, setLanguage }) => {
    const { theme, setTheme } = useTheme();
    const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        soundManager.setEnabled(newValue);
        if (newValue) {
            soundManager.playKeyPress();
        }
    };

    return (
        <div className="settings-container">
            <div className="setting-section">
                <h3>Theme</h3>
                <div className="theme-grid">
                    {(Object.keys(themes) as Theme[]).map((t) => (
                        <button
                            key={t}
                            className={`theme-btn ${theme === t ? 'active' : ''}`}
                            onClick={() => setTheme(t)}
                            style={{
                                background: themes[t]['--bg-color'],
                                color: themes[t]['--main-color'],
                                border: `2px solid ${theme === t ? themes[t]['--main-color'] : themes[t]['--sub-color']}`
                            }}
                        >
                            {themeLabels[t]}
                        </button>
                    ))}
                </div>
            </div>

            <div className="setting-section">
                <h3>Language</h3>
                <div className="language-selector">
                    {(['english', 'spanish', 'french', 'german'] as Language[]).map((lang) => (
                        <button
                            key={lang}
                            className={`lang-btn ${currentLanguage === lang ? 'active' : ''}`}
                            onClick={() => setLanguage(lang)}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            <div className="setting-section">
                <h3>Sound Effects</h3>
                <div className="toggle-container">
                    <label className="toggle-switch">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={toggleSound}
                        />
                        <span className="toggle-slider"></span>
                    </label>
                    <span className="toggle-label">{soundEnabled ? 'Enabled' : 'Disabled'}</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
