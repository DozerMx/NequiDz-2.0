async function obtenerIPPublica() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    } catch (error) {
        console.error('Error al obtener la IP pública:', error);
        return null;
    }
}

function leerLogins() {
    return fetch('logins.txt')
        .then(response => response.text())
        .then(text => {
            const logins = {};
            const lineas = text.split('\n');
            lineas.forEach(linea => {
                const partes = linea.split(':');
                if (partes.length >= 2) {
                    const nombre = partes[0].trim(); // Este es solo para referencia
                    const [codigo, dispositivos] = partes[1].trim().split(' dp:');
                    logins[codigo.trim()] = parseInt(dispositivos.trim());
                }
            });
            return logins;
        });
}

async function entrar() {
    const phoneNumber = document.getElementById('phoneInput').value.trim();
    const ipPublica = await obtenerIPPublica();

    if (!ipPublica) {
        alert('No se pudo obtener la IP pública. Inténtalo de nuevo.');
        return;
    }

    leerLogins().then(logins => {
        if (logins[phoneNumber]) {
            const maxDispositivos = logins[phoneNumber];
            let dispositivosUsados = localStorage.getItem('dispositivos-' + phoneNumber) || 0;

            if (dispositivosUsados < maxDispositivos) {
                // Guarda el dispositivo como usado
                dispositivosUsados++;
                localStorage.setItem('dispositivos-' + phoneNumber, dispositivosUsados);

                // Redirige a la imagen
                window.location.href = 'imagen.html';
            } else {
                alert('Límite de dispositivos alcanzado para este código.');
            }
        } else {
            alert('Código incorrecto.');
        }
    });
}
