
// === Config ===
const API_BASE = 'http://localhost:5050';
const withCreds = { credentials: 'include' };

// === Helpers ===
const q = (s) => document.querySelector(s);

// === Elements ===
const formLogin = q('#loginForm');
const btnMe = q('#btnMe');
const btnRefresh = q('#btnRefresh');
const btnLogout = q('#btnLogout');
const btnABM = q('#btnABM');
const pre = q('#me');
const abm = q('#abmInstrumentos');

// ABM elements
const tableBody = q('#tblInstrumentos tbody');
const formInst = q('#formInstrumento');
const btnNuevo = q('#btnNuevo');
const btnCancelar = q('#btnCancelar');

function setSesionActiva (activa) {
    btnMe.disabled = !activa; // * comentar la linea para ver que pasa con me cuando no estas logueado Y sacar el disabled de tesLogin.html
    btnRefresh.disabled = !activa; // * comentar la linea para ver que pasa con me cuando no estas logueado Y sacar el disabled de tesLogin.html
    btnLogout.disabled = !activa; // * comentar la linea para ver que pasa con me cuando no estas logueado Y sacar el disabled de tesLogin.html
    btnABM.disabled = !activa;
    if (!activa) {
        pre.textContent = 'Sesión cerrada.';
        if (abm) abm.hidden = true;
    }
}

// === Login & Session ===
formLogin?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formLogin).entries());
    try {
        const loginRes = await fetch(`${API_BASE}/api/usuarios/login`, {
            method: 'POST',
            ...withCreds,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!loginRes.ok) throw await loginRes.json();
        setSesionActiva(true);
        pre.textContent = 'Login exitoso. Ahora podés obtener roles y derechos.';
    } catch (err) {
        setSesionActiva(false);
        pre.textContent = 'Login falló: ' + (err?.message || 'Error');
    }
});

btnMe?.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_BASE}/api/usuarios/me`, withCreds);
        if (!res.ok) throw await res.json();
        pre.textContent = '/me = \n' + JSON.stringify(await res.json(), null, 2);
    } catch (err) {
        pre.textContent = 'Error al obtener /me: ' + (err?.message || 'Error');
    }
});

btnRefresh?.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_BASE}/api/usuarios/refresh`, {
            method: 'POST',
            ...withCreds
        });
        if (!res.ok) throw await res.json();
        pre.textContent = 'Token renovado correctamente.';
    } catch (err) {
        setSesionActiva(false);
        pre.textContent = 'Error al renovar token: ' + (err?.message || 'Error');
    }
});

btnLogout?.addEventListener('click', async () => {
    try {
        const res = await fetch(`${API_BASE}/api/usuarios/logout`, {
            method: 'POST',
            ...withCreds
        });
        if (!res.ok) throw await res.json();
        setSesionActiva(false);
        pre.textContent = 'Sesión cerrada exitosamente.';
    } catch (err) {
        pre.textContent = 'Error al cerrar sesión: ' + (err?.message || 'Error');
    }
});

// === ABM Instrumentos ===
btnABM?.addEventListener('click', () => {
    if (!abm) return;
    abm.hidden = !abm.hidden;
    if (!abm.hidden) loadInstrumentos();
});

function rowActions (inst) {
    const wrap = document.createElement('div');
    wrap.className = 'actions';
    const edit = document.createElement('button');
    edit.className = 'ghost';
    edit.type = 'button';
    edit.textContent = 'Editar';
    edit.onclick = () => fillForm(inst);
    const del = document.createElement('button');
    del.className = 'muted';
    del.type = 'button';
    del.textContent = 'Borrar';
    del.onclick = () => borrarInstrumento(inst.id);
    wrap.append(edit, del);
    return wrap;
}

async function loadInstrumentos () {
    if (!tableBody) return;
    tableBody.innerHTML = "<tr><td colspan='6'>Cargando...</td></tr>";
    try {
        const res = await fetch(`${API_BASE}/api/instrumentos/`, withCreds);
        if (!res.ok) throw await res.json();
        const result = await res.json();
        console.log('GET /instrumentos ->', result);
        const items = result.data || [];
        renderRows(items);
        pre.textContent = `${result.totalCount} registros leidos`;
    } catch (err) {
        tableBody.innerHTML = `<tr><td colspan='6'>Error: ${err?.message || 'No se pudo cargar'}</td></tr>`;
    }
}

function renderRows (items) {
    if (!items?.length) {
        tableBody.innerHTML = "<tr><td colspan='6'>Sin resultados</td></tr>";
        return;
    }
    tableBody.innerHTML = '';
    items.forEach(inst => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td><span class="badge">#${inst.id}</span></td>
      <td>${inst.ticker ?? ''}</td>
      <td>${inst.notas ?? ''}</td>
      <td>${inst.tipoInstrumentoId ?? ''}</td>
      <td>${inst.emisorId ?? ''}</td>
      <td></td>
    `;
        tr.children[5].appendChild(rowActions(inst));
        tableBody.appendChild(tr);
    });
}

function fillForm (inst) {
    formInst.id.value = inst.id || '';
    formInst.ticker.value = inst.ticker ?? '';
    formInst.notas.value = inst.notas ?? '';
    formInst.tipoInstrumentoId.value = inst.tipoInstrumentoId ?? '';
    formInst.emisorId.value = inst.emisorId ?? '';
    formInst.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

btnNuevo?.addEventListener('click', () => {
    formInst.reset();
    formInst.id.value = '';
    formInst.ticker.focus();
});

btnCancelar?.addEventListener('click', () => {
    formInst.reset();
});

formInst?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        ticker: formInst.ticker.value?.trim(),
        notas: formInst.notas.value?.trim(),
        tipoInstrumentoId: Number(formInst.tipoInstrumentoId.value || 0) || null,
        emisorId: Number(formInst.emisorId.value || 0) || null
    };
    const id = formInst.id.value?.trim();
    try {
        const res = await fetch(
            id ? `${API_BASE}/api/instrumentos/${id}` : `${API_BASE}/api/instrumentos/`,
            {
                method: id ? 'PUT' : 'POST',
                ...withCreds,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            }
        );
        if (!res.ok) throw await res.json();
        formInst.reset();
        await loadInstrumentos();
        pre.textContent = (id ? 'Actualizado' : 'Creado') + ' correctamente.';
    } catch (err) {
        pre.textContent = 'Error al guardar: ' + (err?.message || 'Error');
    }
});

async function borrarInstrumento (id) {
    if (!window.confirm(`¿Borrar instrumento #${id}?`)) return;
    try {
        const res = await fetch(`${API_BASE}/api/instrumentos/${id}`, {
            method: 'DELETE',
            ...withCreds
        });
        if (!res.ok) throw await res.json();
        await loadInstrumentos();
        pre.textContent = 'Borrado correctamente.';
    } catch (err) {
        pre.textContent = 'Error al borrar: ' + (err?.message || 'Error');
    }
}
