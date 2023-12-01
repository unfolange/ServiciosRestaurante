const amqp = require('amqplib');

async function iniciarServicioDePagos() {
  const connection = await amqp.connect('Introduce aqui tu url');
  const channel = await connection.createChannel();

  // Define el exchange y las colas necesarias
  const exchange = 'payment_exchange';
  const queuePedidoCreado = 'queue_pedido_creado';

  // Crea el exchange y la cola
  await channel.assertExchange(exchange, 'direct', { durable: true });
  await channel.assertQueue(queuePedidoCreado, { durable: true });

  // Une la cola al exchange con enrutamiento específico
  channel.bindQueue(queuePedidoCreado, exchange, 'pedido_creado');

  console.log('Servicio de Pagos esperando eventos...');

  // Escucha eventos de PedidoCreado
  channel.consume(queuePedidoCreado, (msg) => {
    const pedido = JSON.parse(msg.content.toString());
    console.log(`Recibido evento PedidoCreado: ${JSON.stringify(pedido)}`);
    
    // Lógica para procesar el pago y emitir evento PagoCompletado
    const transaccion = procesarPago(pedido);
    const eventoPagoCompletado = {
      eventType: 'PagoCompletado',
      data: {
        idPedido: pedido.data.idPedido,
        cliente: pedido.data.cliente,
        monto: pedido.data.cantidad * 1000,
        idTransaccion: transaccion.idTransaccion,
      },
    };

    // Publica el evento PagoCompletado
    channel.publish('', 'queue_pago_completado', Buffer.from(JSON.stringify(eventoPagoCompletado)));
    channel.publish('', 'queue_notificaciones', Buffer.from(JSON.stringify(eventoPagoCompletado)));
    console.log('Evento PagoCompletado emitido con éxito.');
  }, { noAck: true });
}

function procesarPago(pedido) {
  // Simulación de procesamiento de pago
  console.log('Procesando pago para el pedido:', pedido.data.idPedido);
  const idTransaccion = generarIdTransaccion();
  console.log('Pago completado. ID de transacción:', idTransaccion);
  return { idTransaccion };
}

function generarIdTransaccion() {
  // Lógica para generar un ID de transacción único
  return Math.random().toString(36).substring(2, 15);
}

iniciarServicioDePagos();
