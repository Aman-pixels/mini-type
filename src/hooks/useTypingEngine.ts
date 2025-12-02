import { useReducer, useCallback, useEffect, useRef } from 'react';
import { generateWords, generateNumbers, getQuote, getCodeSnippet } from '../utils/content';
import type { Language } from '../utils/languages';

export type LetterStatus = 'correct' | 'incorrect' | 'extra' | 'pending';
export type GameMode = 'time' | 'words' | 'quote' | 'zen' | 'custom' | 'numbers' | 'code';

export interface LetterState {
    char: string;
    status: LetterStatus;
}

export interface WordState {
    letters: LetterState[];
}

interface State {
    words: WordState[];
    cursor: { wordIndex: number; letterIndex: number };
    status: 'idle' | 'running' | 'finished';
    startTime: number | null;
    endTime: number | null;
    mode: GameMode;
    config: number;
    timeRemaining: number;
    wpmHistory: { time: number; wpm: number }[];
    language: Language;
    customText: string;
}

type Action =
    | { type: 'RESET' }
    | { type: 'SET_MODE'; payload: GameMode }
    | { type: 'SET_CONFIG'; payload: number }
    | { type: 'SET_LANGUAGE'; payload: Language }
    | { type: 'SET_CUSTOM_TEXT'; payload: string }
    | { type: 'START' }
    | { type: 'FINISH' }
    | { type: 'TYPE_CHAR'; payload: string }
    | { type: 'BACKSPACE' }
    | { type: 'SPACE' }
    | { type: 'TICK' }
    | { type: 'APPEND_WORDS' };

const INITIAL_WORD_COUNT = 50;

const initialState: State = {
    words: [],
    cursor: { wordIndex: 0, letterIndex: 0 },
    status: 'idle',
    startTime: null,
    endTime: null,
    mode: 'time',
    config: 30,
    timeRemaining: 30,
    wpmHistory: [],
    language: 'english',
    customText: '',
};

const generateContent = (mode: GameMode, config: number, language: Language, customText?: string): string[] => {
    switch (mode) {
        case 'time':
        case 'words':
        case 'zen':
            return generateWords(mode === 'words' ? config : INITIAL_WORD_COUNT, language);
        case 'numbers':
            return generateNumbers(config);
        case 'quote':
            return getQuote(language);
        case 'code':
            return getCodeSnippet();
        case 'custom':
            return customText ? customText.split(' ') : ["Click", "custom", "mode", "to", "enter", "your", "text"];
        default:
            return generateWords(INITIAL_WORD_COUNT, language);
    }
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'RESET':
            return {
                ...state,
                words: generateContent(state.mode, state.config, state.language, state.customText).map(word => ({
                    letters: word.split('').map(char => ({ char, status: 'pending' as LetterStatus }))
                })),
                cursor: { wordIndex: 0, letterIndex: 0 },
                status: 'idle',
                startTime: null,
                endTime: null,
                timeRemaining: state.mode === 'time' ? state.config : 0,
                wpmHistory: [],
            };
        case 'SET_MODE':
            return { ...state, mode: action.payload, config: action.payload === 'time' ? 30 : 25 };
        case 'SET_CONFIG':
            return { ...state, config: action.payload };
        case 'SET_LANGUAGE':
            return { ...state, language: action.payload };
        case 'SET_CUSTOM_TEXT':
            return { ...state, customText: action.payload };
        case 'START':
            return {
                ...state,
                status: 'running',
                startTime: Date.now(),
                wpmHistory: [],
            };
        case 'FINISH':
            return {
                ...state,
                status: 'finished',
                endTime: Date.now(),
            };
        case 'TICK':
            if (state.status !== 'running') return state;

            const now = Date.now();
            const timeElapsed = (now - (state.startTime || now)) / 1000 / 60;
            const correctChars = state.words.reduce((acc, word) => acc + word.letters.filter(l => l.status === 'correct').length, 0);
            const currentWpm = timeElapsed > 0 ? Math.round((correctChars / 5) / timeElapsed) : 0;

            const newHistory = [...state.wpmHistory, { time: Math.round((now - (state.startTime || now)) / 1000), wpm: currentWpm }];

            if (state.mode === 'time') {
                if (state.timeRemaining <= 1) {
                    return { ...state, timeRemaining: 0, status: 'finished', endTime: Date.now(), wpmHistory: newHistory };
                }
                return { ...state, timeRemaining: state.timeRemaining - 1, wpmHistory: newHistory };
            } else {
                return { ...state, wpmHistory: newHistory };
            }
        case 'APPEND_WORDS':
            if (['time', 'zen'].includes(state.mode)) {
                return {
                    ...state,
                    words: [
                        ...state.words,
                        ...generateWords(25, state.language).map(word => ({
                            letters: word.split('').map(char => ({ char, status: 'pending' as LetterStatus }))
                        }))
                    ]
                };
            }
            return state;
        case 'BACKSPACE': {
            if (state.status === 'finished') return state;
            const { cursor, words } = state;
            const newWords = [...words];

            if (cursor.letterIndex > 0) {
                const currentWord = { ...newWords[cursor.wordIndex] };
                currentWord.letters = [...currentWord.letters];

                const prevLetter = currentWord.letters[cursor.letterIndex - 1];
                if (prevLetter.status === 'extra') {
                    currentWord.letters.splice(cursor.letterIndex - 1, 1);
                } else {
                    currentWord.letters[cursor.letterIndex - 1] = { ...prevLetter, status: 'pending' };
                }
                newWords[cursor.wordIndex] = currentWord;

                return {
                    ...state,
                    words: newWords,
                    cursor: { ...cursor, letterIndex: cursor.letterIndex - 1 },
                };
            } else if (cursor.wordIndex > 0) {
                const prevWordIndex = cursor.wordIndex - 1;
                const prevWord = newWords[prevWordIndex];
                return {
                    ...state,
                    cursor: { wordIndex: prevWordIndex, letterIndex: prevWord.letters.length },
                };
            }
            return state;
        }
        case 'SPACE': {
            if (state.status === 'finished') return state;
            const { cursor, words } = state;

            if (cursor.wordIndex === words.length - 1) {
                if (['words', 'quote', 'code', 'custom', 'numbers'].includes(state.mode)) {
                    return {
                        ...state,
                        status: 'finished',
                        endTime: Date.now(),
                    };
                } else {
                    return { ...state, status: 'finished', endTime: Date.now() };
                }
            }
            return {
                ...state,
                cursor: { wordIndex: cursor.wordIndex + 1, letterIndex: 0 },
            };
        }
        case 'TYPE_CHAR': {
            if (state.status === 'finished') return state;
            const key = action.payload;
            const { cursor, words } = state;
            const newWords = [...words];
            const currentWord = { ...newWords[cursor.wordIndex] };
            currentWord.letters = [...currentWord.letters];

            if (cursor.letterIndex < currentWord.letters.length) {
                const currentLetter = currentWord.letters[cursor.letterIndex];
                currentWord.letters[cursor.letterIndex] = {
                    ...currentLetter,
                    status: key === currentLetter.char ? 'correct' : 'incorrect'
                };
                newWords[cursor.wordIndex] = currentWord;
                return {
                    ...state,
                    words: newWords,
                    cursor: { ...cursor, letterIndex: cursor.letterIndex + 1 }
                };
            } else {
                if (currentWord.letters.length < 20) {
                    currentWord.letters.push({ char: key, status: 'extra' });
                    newWords[cursor.wordIndex] = currentWord;
                    return {
                        ...state,
                        words: newWords,
                        cursor: { ...cursor, letterIndex: cursor.letterIndex + 1 }
                    };
                }
            }
            return state;
        }
        default:
            return state;
    }
};

export const useTypingEngine = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const timerRef = useRef<number | null>(null);

    const reset = useCallback(() => {
        dispatch({ type: 'RESET' });
    }, []);

    const setMode = useCallback((mode: GameMode) => {
        dispatch({ type: 'SET_MODE', payload: mode });
        setTimeout(() => dispatch({ type: 'RESET' }), 0);
    }, []);

    const setConfig = useCallback((config: number) => {
        dispatch({ type: 'SET_CONFIG', payload: config });
        setTimeout(() => dispatch({ type: 'RESET' }), 0);
    }, []);

    const setLanguage = useCallback((language: Language) => {
        dispatch({ type: 'SET_LANGUAGE', payload: language });
        setTimeout(() => dispatch({ type: 'RESET' }), 0);
    }, []);

    const setCustomText = useCallback((text: string) => {
        dispatch({ type: 'SET_CUSTOM_TEXT', payload: text });
    }, []);

    useEffect(() => {
        reset();
    }, [reset]);

    useEffect(() => {
        if (state.status === 'running') {
            timerRef.current = window.setInterval(() => {
                dispatch({ type: 'TICK' });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [state.status]);

    useEffect(() => {
        if (['time', 'zen'].includes(state.mode) && state.words.length - state.cursor.wordIndex < 10) {
            dispatch({ type: 'APPEND_WORDS' });
        }
    }, [state.mode, state.words.length, state.cursor.wordIndex]);

    const handleInput = useCallback((key: string) => {
        if (state.status === 'finished') return;

        if (state.status === 'idle') {
            dispatch({ type: 'START' });
        }

        if (key === 'Backspace') {
            dispatch({ type: 'BACKSPACE' });
        } else if (key === ' ') {
            dispatch({ type: 'SPACE' });
        } else if (key.length === 1) {
            dispatch({ type: 'TYPE_CHAR', payload: key });
        }
    }, [state.status]);

    return {
        ...state,
        reset,
        handleInput,
        setMode,
        setConfig,
        setLanguage,
        setCustomText,
    };
};
