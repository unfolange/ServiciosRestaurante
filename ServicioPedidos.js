const express = require('express');
const bodyParser = require('body-parser');// que sea un cuerpo con json 
const amqp = require('amqplib');

const app = express();// configuracion del servidor expreess
const PORT = 3000;

app.use(bodyParser.json());

// Configuración de RabbitMQ
const rabbitmqURL = 'Introduce aqui tu url';
const exchangeName = 'pedidos_exchange';

function generarIdPedido() {
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
    app.post('/crearPedido', (req, res) => {
        const pedido = req.body;
        console.log("🚀 ~ file: ServicioPedidos.js:29 ~ app.post ~ pedido:", pedido);
        const eventoPedidoCreado = {
            eventType: 'PedidoCreado',
            data: {
            idPedido: generarIdPedido(),
            cliente: pedido.cliente,
            comida: pedido.comida,
            cantidad: pedido.cantidad
            },
        };
      console.log("🚀 ~ file: ServicioPedidos.js:38 ~ app.post ~ eventoPedidoCreado:", eventoPedidoCreado)

      // Publicar el evento "PedidoCreado" en RabbitMQ
      channel.publish('', 'queue_pedido_creado', Buffer.from(JSON.stringify(eventoPedidoCreado)));
      channel.publish('', 'queue_notificaciones', Buffer.from(JSON.stringify(eventoPedidoCreado)));
      res.json({ mensaje: 'Pedido creado exitosamente' });
    });
  })
  .catch((error) => console.error('Error al conectar con RabbitMQ:', error));

app.listen(PORT, () => {
  console.log(`Servicio de Pedidos escuchando en http://localhost:${PORT}`);
});
