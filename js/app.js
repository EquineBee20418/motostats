import { loadTransactions } from './storage.js';
import { showScreen } from './ui.js';

document.getElementById('fab').addEventListener('click', () => {
    showScreen('add');
});

function init() {
    loadTransactions();
    showScreen('dashboard');
    
    console.log('%c🚀 MotoStats v2 cargado correctamente', 'color:#f59e0b; font-size:14px');
}

window.onload = init;