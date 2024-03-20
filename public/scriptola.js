function verificarEdad(respuesta) {
    if (respuesta === 'si') {
      alert('¡Bienvenido! ');
     
      window.location.href = 'index.ejs'
    } else if (respuesta === 'no') {
      alert('Lo siento, no puedes acceder si no eres mayor de edad.');
    }
  }
  