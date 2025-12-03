import React, { useState } from 'react';
import { useTheme, themes } from '../context/ThemeContext';
import type { Theme } from '../context/ThemeContext';
import type { Language } from '../utils/languages';
import { soundManager } from '../utils/sound';
import { FiSearch } from 'react-icons/fi';

interface SettingsProps {
    currentLanguage: Language;
    setLanguage: (language: Language) => void;
}

const themeLabels: Record<Theme, string> = {
    serika_dark: 'serika dark',
    dracula: 'dracula',
    cyberpunk: 'cyberpunk',
    light: 'light',
    nord: 'nord',
    monokai: 'monokai',
    gruvbox: 'gruvbox',
    solarized_dark: 'solarized dark',
    tokyo_night: 'tokyo night'
};

const Settings: React.FC<SettingsProps> = ({ currentLanguage, setLanguage }) => {
    const { theme, setTheme } = useTheme();
    const [soundEnabled, setSoundEnabled] = useState(soundManager.isEnabled());
    const [searchQuery, setSearchQuery] = useState('');

    const toggleSound = () => {
        const newValue = !soundEnabled;
        setSoundEnabled(newValue);
        soundManager.setEnabled(newValue);
        if (newValue) {
            soundManager.playKeyPress();
        }
    };

    const filteredThemes = (Object.keys(themes) as Theme[]).filter(t =>
        themeLabels[t].toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="settings-container-premium">
            <div className="setting-section-premium">
                <h3>theme</h3>

                <div className="theme-search">
                    <FiSearch className="search-icon" />
                    <input
                        type="text"
                        placeholder="Search themes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="theme-search-input"
                    />
                </div>

                <div className="theme-list">
                    {filteredThemes.map((t) => (
                        <button
                            key={t}
                            className={`theme-item ${theme === t ? 'active' : ''}`}
                            onClick={() => setTheme(t)}
                        >
                            <span className="theme-name">{themeLabels[t]}</span>
                            <div className="theme-colors">
                                <span
                                    className="color-dot"
                                    style={{ backgroundColor: themes[t]['--main-color'] }}
                                    title="Main color"
                                />
                                <span
                                    className="color-dot"
                                    style={{ backgroundColor: themes[t]['--sub-color'] }}
                                    title="Sub color"
                                />
                                <span
                                    className="color-dot"
                                    style={{ backgroundColor: themes[t]['--text-color'] }}
                                    title="Text color"
                                />
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="setting-section-premium">
                <h3>language</h3>
                <div className="language-pills">
                    {(['english', 'spanish', 'french', 'german'] as Language[]).map((lang) => (
                        <button
                            key={lang}
                            className={`language-pill ${currentLanguage === lang ? 'active' : ''}`}
                            onClick={() => setLanguage(lang)}
                        >
                            {lang}
                        </button>
                    ))}
                </div>
            </div>

            <div className="setting-section-premium">
                <h3>sound effects</h3>
                <div className="toggle-row">
                    <label className="toggle-switch-premium">
                        <input
                            type="checkbox"
                            checked={soundEnabled}
                            onChange={toggleSound}
                        />
                        <span className="toggle-slider-premium"></span>
                    </label>
                    <span className="toggle-label-premium">{soundEnabled ? 'enabled' : 'disabled'}</span>
                </div>
            </div>
        </div>
    );
};

export default Settings;
