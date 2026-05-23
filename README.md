# División de Polinomios – Método de Horner General

## Descripción

Este proyecto es una aplicación web interactiva desarrollada con **HTML, CSS y JavaScript** que permite realizar divisiones de polinomios utilizando el **Método de Horner Generalizado**.

La aplicación admite divisores de cualquier grado:

- `x - 2`
- `2x² - x + 1`
- `x³ + 2`

Además, muestra:

- Procedimiento paso a paso
- Tabla visual de Horner
- Cociente
- Residuo
- Productos acumulados
- Polinomios ordenados

---

# Tecnologías Utilizadas

- HTML5
- CSS3
- JavaScript Vanilla
- Google Fonts (Poppins)

---

# Estructura del Proyecto

```text
proyecto/
│
├── index.html
├── style.css
└── script.js
```

---

# Funcionamiento General

El usuario ingresa:

1. Un polinomio dividendo
2. Un polinomio divisor

La aplicación:

1. Interpreta los polinomios
2. Obtiene los coeficientes completos
3. Ejecuta el algoritmo de Horner
4. Genera la tabla visual
5. Calcula:
    - Cociente
    - Residuo
6. Muestra el procedimiento paso a paso

---

# Interfaz Principal

## Campo Dividendo

Ejemplo:

```text
2x^4-x^3+4x^2+5x-1
```

## Campo Divisor

Ejemplo:

```text
2x^2-x+1
```

---

# Algoritmo Utilizado

## Método de Horner General

El algoritmo funciona para divisores de grado mayor que 1.

### Procedimiento

1. Se toma el coeficiente principal del divisor (`b0`)
2. Se cambian de signo los demás coeficientes
3. Se realizan multiplicaciones acumuladas
4. Se generan sumas por columnas
5. Se obtiene:
    - Cociente
    - Residuo

---

# Funciones Principales

---

# resolverDivision()

## Descripción

Función principal de la aplicación.

## Responsabilidades

- Leer entradas
- Validar datos
- Convertir polinomios
- Ejecutar Horner
- Mostrar resultados

---

# hornerGeneral(A, B)

## Parámetros

| Parámetro | Descripción |
|---|---|
| A | Coeficientes del dividendo |
| B | Coeficientes del divisor |

## Retorno

```javascript
{
  sumasBrutas,
  cociente,
  residuo,
  filasProducto,
  Bmod,
  b0,
  pasos
}
```

## Descripción

Implementa el algoritmo principal del Método de Horner Generalizado.

---

# generarTablaHorner()

## Descripción

Genera la tabla visual del procedimiento.

## Contenido de la Tabla

- Coeficientes originales
- Productos acumulados
- Cocientes
- Residuos

---

# convertirPolinomio()

## Descripción

Convierte un polinomio escrito en texto a objetos JavaScript.

## Ejemplo

### Entrada

```text
2x^3-x+5
```

### Salida

```javascript
[
  { coeficiente: 2, exponente: 3 },
  { coeficiente: -1, exponente: 1 },
  { coeficiente: 5, exponente: 0 }
]
```

---

# obtenerCoeficientesCompletos()

## Descripción

Completa coeficientes faltantes con cero.

## Ejemplo

### Entrada

```text
2x^3+5
```

### Salida

```javascript
[2,0,0,5]
```

---

# polinomioHTML()

## Descripción

Renderiza el polinomio utilizando estilos y colores visuales.

---

# coeficientesAPolinomio()

## Descripción

Convierte coeficientes a expresión algebraica.

## Ejemplo

### Entrada

```javascript
[2,-1,4]
```

### Salida

```text
2x² - x + 4
```

---

# Diseño Visual

## Características

- Tema oscuro moderno
- Glassmorphism
- Gradientes dinámicos
- Animaciones hover
- Responsive Design
- Tabla interactiva

---

# Responsive Design

La aplicación se adapta automáticamente a:

- PC
- Tablets
- Smartphones

Mediante:

```css
@media(max-width:768px)
```

---

# Validaciones

La aplicación valida:

- Campos vacíos
- Polinomios inválidos
- Divisor de grado mayor
- Coeficiente principal igual a cero

---

# Ejemplo de Uso

## Entrada

### Dividendo

```text
4x^6-3x^5+2x^3-7x+9
```

### Divisor

```text
2x^2-x+1
```

---

## Resultado

La aplicación mostrará:

- Tabla de Horner
- Pasos detallados
- Cociente
- Residuo

---

# Clases CSS Importantes

| Clase | Función |
|---|---|
| `.contenedor` | Contenedor principal |
| `.card-formulario` | Tarjeta del formulario |
| `.resultado-card` | Tarjeta de resultados |
| `.tabla-horner-final` | Tabla principal |
| `.cuadro` | Celdas |
| `.superior` | Coeficientes dividendo |
| `.medio` | Productos |
| `.inferior` | Cociente y residuo |

---

# Características Especiales

## Compatible con:

- Divisores de cualquier grado
- Coeficientes negativos
- Coeficientes decimales
- Polinomios incompletos
- Visualización paso a paso

---

# Complejidad Computacional

## Complejidad Temporal

```text
O(n × m)
```

Donde:

- `n` = grado del dividendo
- `m` = grado del divisor

---

# Mejoras Futuras

- Exportar PDF
- Animaciones del procedimiento
- Historial de operaciones
- Gráficas matemáticas
- Modo claro/oscuro
- Compatibilidad con fracciones

---

# Autor

Proyecto educativo desarrollado para el aprendizaje del:

## Método de Horner Generalizado

---

# Licencia

Proyecto de uso educativo.
