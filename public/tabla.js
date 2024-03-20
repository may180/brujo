// scripts.js
function marcarConsultado(idConsulta) {
    fetch(`/marcarConsultado/${idConsulta}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al marcar como consultado');
        }
        location.reload(); // Recargar la página después de la actualización
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function marcarNoConsultado(idConsulta) {
    fetch(`/marcarNoConsultado/${idConsulta}`, { method: 'POST' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al marcar como no consultado');
        }
        location.reload(); // Recargar la página después de la actualización
      })
      .catch(error => {
        console.error('Error:', error);
      });
}
