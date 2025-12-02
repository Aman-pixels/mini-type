import { languages } from './languages';
import type { Language } from './languages';

export type ContentType = 'words' | 'numbers' | 'quote' | 'code' | 'zen' | 'custom';

export const generateWords = (count: number, language: Language = 'english'): string[] => {
    const wordList = languages[language];
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    return res;
};

export const generateNumbers = (count: number): string[] => {
    const res = [];
    for (let i = 0; i < count; i++) {
        res.push(Math.floor(Math.random() * 1000).toString());
    }
    return res;
};

export const getQuote = (language: Language = 'english'): string[] => {
    const quotes = {
        english: [
            "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle.",
            "Innovation distinguishes between a leader and a follower. Stay hungry, stay foolish.",
            "The future belongs to those who believe in the beauty of their dreams and work hard to achieve them.",
            "Success is not final, failure is not fatal: it is the courage to continue that counts in life.",
            "The only impossible journey is the one you never start. Take the first step today.",
            "Believe you can and you're halfway there. Your attitude determines your altitude in life.",
            "The best time to plant a tree was twenty years ago. The second best time is now.",
            "Don't watch the clock; do what it does. Keep going and never give up on your dreams."
        ],
        spanish: [
            "El único modo de hacer un gran trabajo es amar lo que haces. Si no lo has encontrado todavía, sigue buscando.",
            "La innovación distingue entre un líder y un seguidor. Mantente hambriento, mantente tonto.",
            "El futuro pertenece a aquellos que creen en la belleza de sus sueños y trabajan duro para lograrlos."
        ],
        french: [
            "La seule façon de faire du bon travail est d'aimer ce que vous faites. Si vous ne l'avez pas encore trouvé, continuez à chercher.",
            "L'innovation distingue un leader d'un suiveur. Restez affamé, restez fou.",
            "L'avenir appartient à ceux qui croient en la beauté de leurs rêves et travaillent dur pour les réaliser."
        ],
        german: [
            "Der einzige Weg, großartige Arbeit zu leisten, ist zu lieben, was man tut. Wenn Sie es noch nicht gefunden haben, suchen Sie weiter.",
            "Innovation unterscheidet einen Anführer von einem Anhänger. Bleib hungrig, bleib verrückt.",
            "Die Zukunft gehört denen, die an die Schönheit ihrer Träume glauben und hart daran arbeiten, sie zu verwirklichen."
        ]
    };
    const quoteList = quotes[language] || quotes['english'];
    const selectedQuote = quoteList[Math.floor(Math.random() * quoteList.length)];
    return selectedQuote.split(' ');
};

export const getCodeSnippet = (): string[] => {
    const snippets = [
        // JavaScript/TypeScript
        "const [state, dispatch] = useReducer(reducer, initialState); const handleClick = () => { dispatch({ type: 'INCREMENT' }); };",
        "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n - 1) + fibonacci(n - 2); }",
        "const fetchData = async () => { try { const response = await fetch(url); const data = await response.json(); return data; } catch (error) { console.error(error); } };",
        "class Rectangle { constructor(width, height) { this.width = width; this.height = height; } getArea() { return this.width * this.height; } }",
        "const numbers = [1, 2, 3, 4, 5]; const doubled = numbers.map(n => n * 2); const sum = numbers.reduce((acc, n) => acc + n, 0);",

        // React
        "import React, { useState, useEffect } from 'react'; const Counter = () => { const [count, setCount] = useState(0); return <div onClick={() => setCount(count + 1)}>{count}</div>; };",
        "useEffect(() => { const timer = setInterval(() => { setTime(new Date()); }, 1000); return () => clearInterval(timer); }, []);",
        "const TodoList = ({ items }) => { return <ul>{items.map(item => <li key={item.id}>{item.text}</li>)}</ul>; };",

        // Python
        "def quick_sort(arr): if len(arr) <= 1: return arr; pivot = arr[len(arr) // 2]; left = [x for x in arr if x < pivot]; middle = [x for x in arr if x == pivot]; right = [x for x in arr if x > pivot]; return quick_sort(left) + middle + quick_sort(right);",
        "class BankAccount: def __init__(self, balance=0): self.balance = balance; def deposit(self, amount): self.balance += amount; def withdraw(self, amount): if amount <= self.balance: self.balance -= amount; return True; return False;",

        // General algorithms
        "function binarySearch(arr, target) { let left = 0; let right = arr.length - 1; while (left <= right) { const mid = Math.floor((left + right) / 2); if (arr[mid] === target) return mid; if (arr[mid] < target) left = mid + 1; else right = mid - 1; } return -1; }",
        "const mergeSort = (arr) => { if (arr.length <= 1) return arr; const mid = Math.floor(arr.length / 2); const left = mergeSort(arr.slice(0, mid)); const right = mergeSort(arr.slice(mid)); return merge(left, right); };",

        // CSS/Styling
        "const styles = { container: { display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px' }, button: { backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' } };",

        // API/Async
        "async function getUserData(userId) { const response = await fetch(`/api/users/${userId}`); if (!response.ok) throw new Error('User not found'); const user = await response.json(); return user; }",
        "Promise.all([fetchUsers(), fetchPosts(), fetchComments()]).then(([users, posts, comments]) => { console.log('All data loaded'); }).catch(error => { console.error('Error loading data:', error); });",

        // Data structures
        "class LinkedList { constructor() { this.head = null; this.size = 0; } add(value) { const node = { value, next: null }; if (!this.head) { this.head = node; } else { let current = this.head; while (current.next) { current = current.next; } current.next = node; } this.size++; } }",

        // Utility functions
        "const debounce = (func, delay) => { let timeoutId; return (...args) => { clearTimeout(timeoutId); timeoutId = setTimeout(() => func(...args), delay); }; };",
        "const throttle = (func, limit) => { let inThrottle; return function() { const args = arguments; const context = this; if (!inThrottle) { func.apply(context, args); inThrottle = true; setTimeout(() => inThrottle = false, limit); } }; };",

        // Modern JS
        "const { name, age, ...rest } = user; const newUser = { ...user, email: 'new@email.com' }; const array = [1, 2, 3]; const [first, second, ...others] = array;",
        "const pipe = (...fns) => (x) => fns.reduce((v, f) => f(v), x); const compose = (...fns) => (x) => fns.reduceRight((v, f) => f(v), x);"
    ];

    const selectedSnippet = snippets[Math.floor(Math.random() * snippets.length)];
    return selectedSnippet.split(' ');
};
