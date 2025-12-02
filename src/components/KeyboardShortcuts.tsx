import React from 'react';

const KeyboardShortcuts: React.FC = () => {
    return (
        <div className="shortcuts-container">
            <div className="shortcuts-section">
                <h3>During Test</h3>
                <div className="shortcut-list">
                    <div className="shortcut-item">
                        <kbd>Tab</kbd>
                        <span>Restart test</span>
                    </div>
                    <div className="shortcut-item">
                        <kbd>Esc</kbd>
                        <span>Close modal / End test</span>
                    </div>
                </div>
            </div>

            <div className="shortcuts-section">
                <h3>Navigation</h3>
                <div className="shortcut-list">
                    <div className="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>K</kbd>
                        <span>Open keyboard shortcuts</span>
                    </div>
                    <div className="shortcut-item">
                        <kbd>Ctrl</kbd> + <kbd>T</kbd>
                        <span>Cycle themes</span>
                    </div>
                </div>
            </div>

            <div className="shortcuts-section">
                <h3>Tips</h3>
                <ul className="tips-list">
                    <li>Focus is automatically set to the typing area</li>
                    <li>Click anywhere on the typing area to refocus</li>
                    <li>Your settings are saved automatically</li>
                    <li>Toggle live WPM in the footer</li>
                </ul>
            </div>
        </div>
    );
};

export default KeyboardShortcuts;
