import { loadTransactions, addTransaction } from './storage.js';
import { calculateCPK, getPeriodTotal } from './calculations.js';

const categories = [
    {name:"Gasolina", icon:"⛽"}, 
    {name:"Mantenimiento", icon:"🔧"},
    {name:"Aceite", icon:"🛢️"}, 
    {name:"Llantas", icon:"🛞"},
    {name:"Seguro", icon:"🛡️"}, 
    {name:"Accesorios", icon:"🛠️"},
    {name:"Otro", icon:"📌"}
];

let selectedCategory = null;

export function showScreen(screen) {
    const main = document.getElementById('main-content');
    
    if (screen === 'add') {
        main.innerHTML = createAddForm();
        renderCategoryButtons();           // ← Nueva línea importante
    } else if (screen === 'dashboard') {
        main.innerHTML = createDashboard();
    } else if (screen === 'history') {
        main.innerHTML = createHistory();
    }
}

function renderCategoryButtons() {
    const container = document.getElementById('cat-grid');
    if (!container) return;
    
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'category-btn';
        btn.dataset.name = cat.name;
        btn.innerHTML = `
            <span style="font-size:28px">${cat.icon}</span>
            <span>${cat.name}</span>
        `;
        btn.onclick = () => selectCategory(cat.name, btn);
        container.appendChild(btn);
    });
}

function selectCategory(name, element) {
    selectedCategory = name;
    
    // Quitar active a todos
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Activar el seleccionado
    element.classList.add('active');
}

function createAddForm() {
    return `
        <div class="card">
            <h2 style="margin-bottom:24px; text-align:center; font-size:22px">Nuevo Registro</h2>
            
            <input type="date" id="fecha" class="input" value="${new Date().toISOString().split('T')[0]}">
            
            <div style="margin:24px 0 16px 0">
                <label style="display:block; margin-bottom:12px; color:#a1a1aa; font-size:15px">Categoría</label>
                <div class="category-grid" id="cat-grid"></div>
            </div>
            
            <input type="number" id="monto" class="input" placeholder="Monto en MXN" step="0.01" style="font-size:20px">
            
            <input type="text" id="descripcion" class="input" style="margin-top:12px" placeholder="Descripción (Tanque lleno, etc)">
            
            <input type="number" id="km" class="input" style="margin-top:12px" placeholder="Kilometraje actual (opcional)">
            
            <button onclick="saveNewTransaction()" class="btn-primary">Guardar Registro</button>
        </div>
        
        <div style="text-align:center; margin-top:20px; color:#71717a; font-size:14px">
            Registro rápido • Máximo 15 segundos
        </div>
    `;
}

function createDashboard() {
    const trans = loadTransactions();
    const monthly = getPeriodTotal(trans, 'month');
    const weekly = getPeriodTotal(trans, 'week');
    const cpk = calculateCPK(trans);

    return `
        <h2 style="margin-bottom:20px; font-size:22px">Dashboard</h2>
        
        <div class="card">
            <p style="color:#f59e0b; font-size:14px">Este mes</p>
            <p style="font-size:42px; font-weight:700; margin:8px 0">\[ {monthly.toFixed(0)}</p>
        </div>
        
        <div class="card">
            <p style="color:#f59e0b; font-size:14px">Semana actual</p>
            <p style="font-size:42px; font-weight:700; margin:8px 0"> \]{weekly.toFixed(0)}</p>
        </div>
        
        <div class="card">
            <p style="color:#f59e0b; font-size:14px">Costo por km</p>
            <p style="font-size:42px; font-weight:700; margin:8px 0">\[ {cpk}</p>
        </div>
        
        <button onclick="showScreen('history')" style="width:100%; padding:16px; background:#27272a; border:none; border-radius:16px; color:white; margin-top:16px">
            Ver Historial Completo
        </button>
    `;
}

function createHistory() {
    const trans = loadTransactions();
    
    if (trans.length === 0) {
        return `<div class="card" style="text-align:center; padding:60px 20px; color:#71717a">Aún no tienes registros.<br><br>Presiona + para agregar el primero.</div>`;
    }
    
    let html = `<h2 style="margin-bottom:20px">Historial</h2>`;
    
    trans.forEach(t => {
        html += `
            <div class="card" style="display:flex; justify-content:space-between; align-items:start">
                <div style="flex:1">
                    <div style="font-size:18px; font-weight:600">${t.categoria}</div>
                    <div style="color:#a1a1aa; font-size:14px">${t.fecha}</div>
                    \( {t.descripcion ? `<div style="margin-top:8px"> \){t.descripcion}</div>` : ''}
                </div>
                <div style="text-align:right">
                    <div style="font-size:20px; font-weight:700"> \]{t.monto}</div>
                    \( {t.km ? `<div style="font-size:13px; color:#71717a"> \){t.km} km</div>` : ''}
                </div>
            </div>
        `;
    });
    
    return html;
}

// Hacer funciones accesibles desde HTML
window.saveNewTransaction = function() {
    const fecha = document.getElementById('fecha').value;
    const montoInput = document.getElementById('monto').value;
    
    if (!selectedCategory) {
        alert("❌ Por favor selecciona una categoría");
        return;
    }
    if (!montoInput || parseFloat(montoInput) <= 0) {
        alert("❌ Ingresa un monto válido");
        return;
    }

    addTransaction({
        fecha: fecha,
        categoria: selectedCategory,
        monto: montoInput,
        descripcion: document.getElementById('descripcion').value,
        km: document.getElementById('km').value
    });

    selectedCategory = null; // Reset
    alert("✅ Registro guardado correctamente");
    showScreen('dashboard');
};

window.selectCategory = selectCategory;   // Para onclick si fuera necesario
window.showScreen = showScreen;