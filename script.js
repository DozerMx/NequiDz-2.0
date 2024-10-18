// Función para obtener la IP pública del dispositivo
async function obtenerIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP:', error);
        return null;
    }
}

// Función para leer el archivo logins.txt
async function leerLogins() {
    try {
        const response = await fetch('logins.txt');
        const loginsText = await response.text();
        return loginsText.split('\n').map(line => line.trim()).filter(line => line);
    } catch (error) {
        console.error('Error al leer logins.txt:', error);
        return [];
    }
}

// Función para verificar si el login es válido
async function verificarLogin(nombre, codigo) {
    const ip = await obtenerIP();
    const logins = await leerLogins();

    if (!ip || logins.length === 0) {
        alert('No se pudo completar la verificación.');
        return;
    }

    let usuarioEncontrado = false;
    
    logins.forEach(linea => {
        const [usuario, loginData] = linea.split(':').map(part => part.trim());
        const [codigoAcceso, dispositivos] = loginData.split('dp:').map(part => part.trim());
        const maxDispositivos = parseInt(dispositivos);

        if (usuario === nombre && codigoAcceso === codigo) {
            usuarioEncontrado = true;

            // Obtener o inicializar el historial de acceso desde el almacenamiento local
            let historial = JSON.parse(localStorage.getItem('historialAccesos')) || {};

            if (!historial[usuario]) {
                historial[usuario] = [];
            }

            // Verificar si la IP ya está en la lista de dispositivos permitidos
            if (historial[usuario].includes(ip)) {
                alert(`Bienvenido de nuevo, ${nombre}!`);
                window.location.href = 'imagen.html'; // Redirigir a la página de imagen
            } else if (historial[usuario].length < maxDispositivos) {
                // Agregar la IP a la lista si aún no ha alcanzado el límite de dispositivos
                historial[usuario].push(ip);
                localStorage.setItem('historialAccesos', JSON.stringify(historial));
                alert(`Acceso permitido, ${nombre}!`);
                window.location.href = 'imagen.html'; // Redirigir a la página de imagen
            } else {
                alert('Límite de dispositivos alcanzado para este usuario.');
            }
        }
    });

    if (!usuarioEncontrado) {
        alert('Login incorrecto.');
    }
}

// Función de inicio de sesión al hacer clic en el botón
async function entrar() {
    const nombre = prompt('Introduce tu nombre de usuario:');
    const codigo = document.getElementById('phoneInput').value.trim();

    if (nombre && codigo) {
        await verificarLogin(nombre, codigo);
    } else {
        alert('Por favor, introduce un nombre de usuario y código válidos.');
    }
}