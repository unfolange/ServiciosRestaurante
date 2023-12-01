const express = require('express');
const bodyParser = require('body-parser');// que sea un cuerpo con json 
const amqp = require('amqplib');

const app = express();// configuracion del servidor expreess
const PORT = 4000;

app.use(bodyParser.json());

// Configuración de RabbitMQ
const rabbitmqURL = 'amqps://qsqgdfrj:3E7OUdwFRktAmV6LrMnxVgwUbYwLuocN@prawn.rmq.cloudamqp.com/qsqgdfrj';
const exchangeName = 'restaurante_exchange';

function generarIdActualizacion() {
    // Lógica para generar un ID de transacción único
    return Math.random().toString(36).substring(2, 15);
  }

// Conexión a RabbitMQ y creación de canal
amqp.connect(rabbitmqURL)
  .then((connection) => connection.createChannel())
  .then((channel) => {
    // Crear el exchange si no existe
    channel.assertExchange(exchangeName, 'fanout', { durable: false });

    // Manejar solicitudes de pedidos
    app.post('/crearActualizacion', (req, res) => {
        const actualizacion = req.body;
        const eventoActualizacionRestaurante  = {
            eventType: 'RestauranteActualizado',
            data: {
            idActualizacion: generarIdActualizacion(),
            nuevoMenu: actualizacion.nuevoMenu,
            estadoDisponibilidad: actualizacion.disponibilidad
            },
        };
        console.log("🚀 ~ file: Restaurante.js:37 ~ app.post ~ eventoActualizacionRestaurante:", eventoActualizacionRestaurante)

      // Publicar el evento "eventoActualizacionRestaurante" en RabbitMQ
      channel.publish('', 'queue_actualizacion_resturante', Buffer.from(JSON.stringify(eventoActualizacionRestaurante)));
      channel.publish('', 'queue_notificaciones', Buffer.from(JSON.stringify(eventoActualizacionRestaurante)));
      res.json({ mensaje: 'Restaurante actualizado exitosamente' });
    });
  })
  .catch((error) => console.error('Error al conectar con RabbitMQ:', error));

app.listen(PORT, () => {
  console.log(`Servicio de Restaurante escuchando en http://localhost:${PORT}`);
});
