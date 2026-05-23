/* =========================================================
   División de Polinomios – Método de Horner General
   Fiel al esquema del video Profeacademic:
   - Fila inferior muestra las SUMAS BRUTAS de cada columna
   - El cociente real = sumasBrutas[0..numCoefs-1] / b0
   - Residuo = sumasBrutas[numCoefs..]
   ========================================================= */

/* ----------------------------------------------------------
   ENTRADA PRINCIPAL
   ---------------------------------------------------------- */
function resolverDivision() {
    const dividendoTexto = document.getElementById("dividendo").value.replace(/\s+/g, '');
    const divisorTexto   = document.getElementById("divisor").value.replace(/\s+/g, '');

    if (!dividendoTexto || !divisorTexto) {
        mostrarError("Ingrese ambos polinomios."); return;
    }

    const dividendo = convertirPolinomio(dividendoTexto);
    const divisor   = convertirPolinomio(divisorTexto);

    if (!dividendo) { mostrarError("No se pudo interpretar el dividendo.\nEjemplo: 4x^5+8x^4+3x^3-6x^2+1"); return; }
    if (!divisor)   { mostrarError("No se pudo interpretar el divisor.\nEjemplo: 2x^3-2x^2+2x-2  o  x-2"); return; }

    const A = obtenerCoeficientesCompletos(dividendo);
    const B = obtenerCoeficientesCompletos(divisor);

    const gradoA = A.length - 1;
    const gradoB = B.length - 1;

    if (gradoB > gradoA) { mostrarError("El grado del divisor no puede ser mayor que el del dividendo."); return; }
    if (gradoB < 1)      { mostrarError("El divisor debe tener al menos grado 1."); return; }
    if (B[0] === 0)      { mostrarError("El coeficiente principal del divisor no puede ser cero."); return; }

    const resultado = hornerGeneral(A, B);
    mostrarResultados(dividendo, divisor, A, B, resultado, gradoA, gradoB);
}

/* ----------------------------------------------------------
   ALGORITMO DE HORNER GENERAL
   Devuelve:
     sumasBrutas[i]  = suma acumulada de la columna i (lo que va en fila inferior)
     cociente        = sumasBrutas[0..numCoefs-1] / b0
     residuo         = sumasBrutas[numCoefs..]
     filasProducto   = cada fila de multiplicaciones (para dibujar la tabla)
     Bmod            = coefs del divisor con signo cambiado (excepto b0)
   ---------------------------------------------------------- */
function hornerGeneral(A, B) {
    const n      = A.length;
    const gradoB = B.length - 1;
    const b0     = B[0];
    const Bmod   = B.slice(1).map(v => -v);   // signo cambiado
    const numCoefs = n - gradoB;              // columnas del cociente

    let trabajo = [...A];                     // acumulado por columna
    const filasProducto = [];                 // cada iteración genera una fila de productos
    const pasos = [];

    for (let i = 0; i < numCoefs; i++) {
        const suma = trabajo[i];
        const coef = redondear(suma / b0);    // divide entre b0

        // Multiplicar coef × Bmod y acumular en columnas siguientes
        const prods = new Array(n).fill(null);
        for (let j = 0; j < Bmod.length; j++) {
            const val = redondear(coef * Bmod[j]);
            prods[i + 1 + j] = val;
            trabajo[i + 1 + j] = redondear(trabajo[i + 1 + j] + val);
        }
        filasProducto.push(prods);

        pasos.push({ numero: i + 1, sumaColumna: suma, coef, prods: [...prods] });
    }

    // sumasBrutas: lo que se muestra en la fila inferior
    const sumasBrutas = trabajo.map(v => redondear(v));

    const cociente = sumasBrutas.slice(0, numCoefs).map(v => redondear(v / b0));
    const residuo  = sumasBrutas.slice(numCoefs);

    return { sumasBrutas, cociente, residuo, filasProducto, Bmod, b0, pasos };
}

/* ----------------------------------------------------------
   MOSTRAR RESULTADOS
   ---------------------------------------------------------- */
function mostrarResultados(dividendo, divisor, A, B, resultado, gradoA, gradoB) {
    const seccion = document.getElementById("seccionResultados");
    seccion.style.display = "block";

    const { sumasBrutas, cociente, residuo, filasProducto, Bmod, b0, pasos } = resultado;
    const gradoCociente = gradoA - gradoB;
    const numCoefs = A.length - gradoB;

    let html = '';

    // Polinomios ordenados
    html += `
        <div class="ordenado">
            <div class="titulo-ordenado">DIVIDENDO ORDENADO</div>
            <div class="ecuacion-box">${polinomioHTML(dividendo)}</div>
        </div>
        <div class="ordenado">
            <div class="titulo-ordenado">DIVISOR ORDENADO</div>
            <div class="ecuacion-box">${polinomioHTML(divisor)}</div>
        </div>
    `;

    // Tabla
    html += generarTablaHorner(A, B, Bmod, b0, filasProducto, sumasBrutas, numCoefs);

    // Pasos
    html += '<div class="pasos-container">';
    html += `<div class="paso">
        <strong>Preparación:</strong><br>
        Coeficiente principal del divisor: <em>b₀ = ${b0}</em>.<br>
        Resto de coeficientes con signo cambiado (Bmod): 
        [${Bmod.map(v => v >= 0 ? '+'+v : v).join(', ')}]
    </div>`;

    pasos.forEach(p => {
        const prodsValidos = p.prods.filter(v => v !== null);
        html += `
            <div class="paso">
                <strong>Paso ${p.numero}:</strong>
                Suma columna = <em>${p.sumaColumna}</em> ÷ ${b0} = <strong>${p.coef}</strong>
                &nbsp;→ productos: [${prodsValidos.map(v => v>=0?'+'+v:v).join(', ')}]
            </div>
        `;
    });

    for (let i = numCoefs; i < A.length; i++) {
        html += `<div class="paso paso-residuo">
            <strong>Residuo col ${i - numCoefs + 1}:</strong>
            Solo suma de columna → <strong>${sumasBrutas[i]}</strong>
        </div>`;
    }
    html += '</div>';

    // Bloques resultado
    const residuoEsCero = residuo.every(v => v === 0);
    html += `
        <div class="resultado-bloques">
            <div class="bloque-resultado">
                <div class="titulo-resultado verde">COCIENTE</div>
                <div class="contenido-resultado verde-texto">
                    ${coeficientesAPolinomio(cociente, gradoCociente)}
                </div>
            </div>
            <div class="bloque-resultado">
                <div class="titulo-resultado rojo">RESIDUO</div>
                <div class="contenido-resultado rojo-texto">
                    ${residuoEsCero ? '0' : coeficientesAPolinomio(residuo, gradoB - 1)}
                </div>
            </div>
        </div>
    `;

    document.getElementById("tablaHorner").innerHTML = html;

    const divisorTexto = polinomioTexto(divisor);
    document.getElementById("resultadoFinal").innerHTML = `
        <span class="verde-texto">${coeficientesAPolinomio(cociente, gradoCociente)}</span>
        ${!residuoEsCero
        ? `&nbsp;+&nbsp;<span class="rojo-texto">(${coeficientesAPolinomio(residuo, gradoB-1)}) / (${divisorTexto})</span>`
        : ''}
    `;

    seccion.scrollIntoView({ behavior: "smooth" });
}

/* ----------------------------------------------------------
   GENERAR TABLA VISUAL DE HORNER
   Estructura (fiel a la imagen):

   ┌──────────┬────┬────┬────┬──────┬──────┬──────┐
   │  ÷ b0    │ x⁵ │ x⁴ │ x³ │  x²  │  x¹  │  x⁰  │
   │          │Bmod│    │ +1 │  -2  │  +1  │      │
   ├──────────┼────┼────┼────┼──────┼──────┼──────┤
   │ (lado)   │  4 │  8 │  3 │  -6  │   0  │   1  │  ← dividendo (azul)
   │          │    │ +2 │ -4 │  +2  │      │      │  ← prods iter 1
   │          │    │    │ +5 │ -10  │  +5  │      │  ← prods iter 2
   │          │    │    │    │  +2  │  -4  │  +2  │  ← prods iter 3
   ├──────────┼────┼────┼────┼──────┼──────┼──────┤
   │ (lado)   │  4 │ 10 │  4 │ -12  │   1  │   3  │  ← sumas brutas
   └──────────┴────┴────┴────┴──────┴──────┴──────┘

   Los primeros numCoefs valores de la fila inferior son el cociente×b0.
   Los últimos gradoB valores son el residuo directo.
   ---------------------------------------------------------- */
function generarTablaHorner(A, B, Bmod, b0, filasProducto, sumasBrutas, numCoefs) {
    const n      = A.length;
    const gradoB = B.length - 1;

    // ── Encabezado de exponentes ──
    let encHeader = `<th class="lado-x">÷ ${b0}</th>`;
    for (let i = 0; i < n; i++) {
        const exp = n - 1 - i;
        encHeader += `<th class="${i < numCoefs ? 'th-cociente' : 'th-residuo'}">x<sup>${exp}</sup></th>`;
    }

    // Columna izquierda del cuerpo:
    // Fila 0 → b0  (primer coef del divisor)
    // Fila k → Bmod[k-1]  (coefs con signo cambiado, uno por fila de productos)
    const lateralValores = [b0, ...Bmod];   // longitud = 1 + Bmod.length = 1 + gradoB

    // ── Fila dividendo (azul) — celda lateral solo para esta fila ──
    let fila1 = `<td class="lado-x lado-divisor-val">${lateralValores[0]}</td>`;
    A.forEach(c => { fila1 += `<td class="cuadro superior">${c}</td>`; });

    // ── Filas de productos (amarillo) — cada una muestra su valor de Bmod en la lateral ──
    let filasHTML = '';
    filasProducto.forEach((prods, idx) => {
        const latVal = lateralValores[idx + 1] !== undefined ? lateralValores[idx + 1] : '';
        const latStr = latVal !== '' ? (latVal > 0 ? '+'+latVal : latVal) : '';
        let fila = `<td class="lado-x lado-divisor-val bmod-lateral">${latStr}</td>`;
        for (let i = 0; i < n; i++) {
            const v = prods[i];
            if (v !== null) {
                fila += `<td class="cuadro medio">${v >= 0 ? '+'+v : v}</td>`;
            } else {
                fila += `<td class="cuadro medio vacio"></td>`;
            }
        }
        filasHTML += `<tr>${fila}</tr>`;
    });

    // ── Línea separadora ──
    const lineaHTML = `<tr><td colspan="${n+1}" class="linea-horizontal"></td></tr>`;

    // ── Fila inferior: cociente (ya dividido entre b0) + residuo ──
    // Los primeros numCoefs valores son sumasBrutas[i]/b0 (cociente real)
    // Los últimos gradoB son el residuo directo
    let fila3 = `<td class="lado-x lado-resultado"></td>`;
    for (let i = 0; i < n; i++) {
        if (i < numCoefs) {
            const val = redondear(sumasBrutas[i] / b0);   // ← dividido entre b0
            fila3 += `<td class="cuadro inferior">${val}</td>`;
        } else {
            const val = sumasBrutas[i];                    // residuo directo
            fila3 += `<td class="cuadro inferior residuo-zona">${val}</td>`;
        }
    }

    return `
        <div class="valor-x">Esquema de Horner</div>
        <div class="horner-container">
            <table class="tabla-horner-final">
                <thead>
                    <tr>${encHeader}</tr>
                </thead>
                <tbody>
                    <tr>${fila1}</tr>
                    ${filasHTML}
                    ${lineaHTML}
                    <tr>${fila3}</tr>
                </tbody>
            </table>
        </div>
        <div class="leyenda-tabla">
            <span class="leyenda-item superior-leyenda">■ Coeficientes dividendo</span>
            <span class="leyenda-item medio-leyenda">■ Productos acumulados</span>
            <span class="leyenda-item inferior-leyenda">■ Cociente</span>
            <span class="leyenda-item residuo-leyenda">■ Residuo</span>
        </div>
    `;
}

/* ----------------------------------------------------------
   PARSEO DE POLINOMIOS
   ---------------------------------------------------------- */
function convertirPolinomio(expresion) {
    // Insertar separador "|" antes de cada + o - interno (no el primero)
    const normalizado = expresion.replace(/([+-])/g, (m, s, offset) =>
        offset === 0 ? m : '|' + m
    );
    const terminos = normalizado.split('|');
    const lista = [];

    terminos.forEach(termino => {
        if (!termino) return;
        let coef, exp;
        if (termino.includes('x^')) {
            const p = termino.split('x^');
            exp  = parseInt(p[1]);
            coef = parsearCoeficiente(p[0]);
        } else if (termino.includes('x')) {
            const p = termino.split('x');
            exp  = 1;
            coef = parsearCoeficiente(p[0]);
        } else {
            coef = parseFloat(termino);
            exp  = 0;
        }
        if (!isNaN(coef) && !isNaN(exp)) lista.push({ coeficiente: coef, exponente: exp });
    });

    if (lista.length === 0) return null;
    lista.sort((a, b) => b.exponente - a.exponente);
    return lista;
}

function parsearCoeficiente(str) {
    if (str === '' || str === '+') return 1;
    if (str === '-')               return -1;
    const v = parseFloat(str);
    return isNaN(v) ? NaN : v;
}

function obtenerCoeficientesCompletos(lista) {
    const gradoMax = lista[0].exponente;
    const coefs = [];
    for (let i = gradoMax; i >= 0; i--) {
        const t = lista.find(x => x.exponente === i);
        coefs.push(t ? t.coeficiente : 0);
    }
    return coefs;
}

/* ----------------------------------------------------------
   RENDERIZADO DE POLINOMIOS
   ---------------------------------------------------------- */
function polinomioHTML(lista) {
    let html = '';
    lista.forEach((item, index) => {
        const coef = item.coeficiente;
        const exp  = item.exponente;
        const absC = Math.abs(coef);
        const coefStr = absC === 1 && exp !== 0 ? '' : absC;
        let signo = '';
        if      (index === 0 && coef < 0) signo = '<span class="signo">−</span>';
        else if (index !== 0 && coef >= 0) signo = '<span class="signo">+</span>';
        else if (index !== 0 && coef < 0)  signo = '<span class="signo">−</span>';
        if      (exp > 1)  html += `${signo}<span class="morado">${coefStr}x<sup>${exp}</sup></span>`;
        else if (exp === 1) html += `${signo}<span class="celeste">${coefStr}x</span>`;
        else               html += `${signo}<span class="amarillo">${absC}</span>`;
    });
    return html;
}

function polinomioTexto(lista) {
    let txt = '';
    lista.forEach((item, index) => {
        const coef = item.coeficiente;
        const exp  = item.exponente;
        const absC = Math.abs(coef);
        const coefStr = absC === 1 && exp !== 0 ? '' : absC;
        const signo = index === 0 ? (coef < 0 ? '-' : '') : (coef < 0 ? ' - ' : ' + ');
        if      (exp > 1)  txt += `${signo}${coefStr}x^${exp}`;
        else if (exp === 1) txt += `${signo}${coefStr}x`;
        else               txt += `${signo}${absC}`;
    });
    return txt;
}

function coeficientesAPolinomio(lista, gradoInicial) {
    if (!lista || lista.length === 0) return '0';
    let texto = '';
    for (let i = 0; i < lista.length; i++) {
        let coef = redondear(lista[i]);
        const exponente = gradoInicial - i;
        if (coef === 0) continue;
        let signo = '';
        if (coef > 0 && texto !== '') signo = ' + ';
        else if (coef < 0) { signo = texto === '' ? '−' : ' − '; coef = Math.abs(coef); }
        const coefStr = (coef === 1 && exponente !== 0) ? '' : coef;
        if      (exponente > 1)  texto += `${signo}${coefStr}x<sup>${exponente}</sup>`;
        else if (exponente === 1) texto += `${signo}${coefStr}x`;
        else                     texto += `${signo}${coef}`;
    }
    return texto || '0';
}

function redondear(num) { return Number(num.toFixed(4)); }
function mostrarError(msg) { alert(msg); }

function limpiarCampos() {
    document.getElementById("dividendo").value = '';
    document.getElementById("divisor").value   = '';
    document.getElementById("valorX").value    = '';
    document.getElementById("tablaHorner").innerHTML = '';
    document.getElementById("resultadoFinal").innerHTML = '';
    document.getElementById("seccionResultados").style.display = 'none';
}