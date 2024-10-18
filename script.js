async function leerLogins() {
    const response = await fetch('logins.txt');
    const text = await response.text();
    const logins = {};
    const lineas = text.split('\n');
    
    lineas.forEach(linea => {
        const partes = linea.split(':');
        if (partes.length >= 2) {
            const [codigo, info] = partes[1].trim().split(' dp:');
            logins[codigo.trim()] = parseInt(info.trim());
        }
    });
    return logins;
}

async function entrar() {
    const phoneNumber = document.getElementById('phoneInput').value.trim();

    // Leer los logins desde el archivo logins.txt
    const logins = await leerLogins();

    // Comprobar si el número ingresado está en el archivo
    if (logins[phoneNumber]) {
        // Si es válido, redirigir a imagen.html
        window.location.href = 'imagen.html';
    } else {
        alert('Número incorrecto.');
    }
}
