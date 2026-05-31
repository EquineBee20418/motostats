export let transactions = [];

export function loadTransactions() {
    const saved = localStorage.getItem('motostats_v2');
    if (saved) transactions = JSON.parse(saved);
    return transactions;
}

export function saveTransactions() {
    localStorage.setItem('motostats_v2', JSON.stringify(transactions));
}

export function addTransaction(data) {
    const transaction = {
        id: 'trans_' + Date.now(),
        fecha: data.fecha,
        categoria: data.categoria,
        monto: parseFloat(data.monto),
        descripcion: data.descripcion || '',
        km: data.km ? parseFloat(data.km) : null
    };
    transactions.unshift(transaction); // Nuevo al inicio
    saveTransactions();
    return transaction;
}

export function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    saveTransactions();
}

export function updateTransaction(id, newData) {
    const index = transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        transactions[index] = { ...transactions[index], ...newData };
        saveTransactions();
    }
}