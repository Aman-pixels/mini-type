import { useState, useEffect } from 'react';
import TypingTest from './components/TypingTest';
import { ThemeProvider, useTheme, themes } from './context/ThemeContext';
import type { Theme } from './context/ThemeContext';
import Modal from './components/Modal';
import Settings from './components/Settings';
import About from './components/About';
import CustomTextModal from './components/CustomTextModal';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { useTypingEngine } from './hooks/useTypingEngine';
import { IoMdSettings } from 'react-icons/io';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { MdKeyboard } from 'react-icons/md';
import { BsKeyboard } from 'react-icons/bs';

function AppContent() {
  const engine = useTypingEngine();
  const { theme, setTheme } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isCustomTextOpen, setIsCustomTextOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Open custom text modal when custom mode is selected
  useEffect(() => {
    if (engine.mode === 'custom' && !engine.customText) {
      setIsCustomTextOpen(true);
    }
  }, [engine.mode, engine.customText]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K for keyboard shortcuts
      if (e.ctrlKey && e.key === 'k') {
        e.preventDefault();
        setIsShortcutsOpen(true);
      }

      // Ctrl+T for theme cycling
      if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        const themeKeys = Object.keys(themes) as Theme[];
        const currentIndex = themeKeys.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themeKeys.length;
        setTheme(themeKeys[nextIndex]);
      }

      // Esc to close modals
      if (e.key === 'Escape') {
        setIsSettingsOpen(false);
        setIsAboutOpen(false);
        setIsShortcutsOpen(false);
        setIsCustomTextOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [theme, setTheme]);

  const handleCustomTextSubmit = (text: string) => {
    engine.setCustomText(text);
    engine.reset();
  };

  return (
    <div className="app">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <MdKeyboard style={{ fontSize: '2rem', color: 'var(--main-color)' }} />
          <h1 style={{ color: 'var(--text-color)', fontSize: '1.5rem' }}>mini type</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="nav-btn" onClick={() => setIsShortcutsOpen(true)} title="Keyboard Shortcuts (Ctrl+K)">
            <BsKeyboard style={{ fontSize: '1.2rem' }} />
          </button>
          <button className="nav-btn" onClick={() => setIsSettingsOpen(true)} title="Settings">
            <IoMdSettings style={{ fontSize: '1.2rem' }} />
          </button>
          <button className="nav-btn" onClick={() => setIsAboutOpen(true)} title="About">
            <AiOutlineInfoCircle style={{ fontSize: '1.2rem' }} />
          </button>
        </div>
      </header>

      <TypingTest engine={engine} />

      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Settings">
        <Settings currentLanguage={engine.language} setLanguage={engine.setLanguage} />
      </Modal>

      <Modal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} title="About">
        <About />
      </Modal>

      <Modal isOpen={isShortcutsOpen} onClose={() => setIsShortcutsOpen(false)} title="Keyboard Shortcuts">
        <KeyboardShortcuts />
      </Modal>

      {isCustomTextOpen && (
        <CustomTextModal
          onSubmit={handleCustomTextSubmit}
          onClose={() => setIsCustomTextOpen(false)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
