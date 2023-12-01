const amqp = require('amqplib');

function asignarEntregador(){
    entregador_id = Math.floor(Math.random() * (5 - 1 + 1) + 1) - 1
    entregadores = ['Jupiter','Annie','Sammy','Sarabi','Mufasa']
    return entregadores[entregador_id]
}
    

async function iniciarServicioDeEntrega() {
  const connection = await amqp.connect('amqps://qsqgdfrj:3E7OUdwFRktAmV6LrMnxVgwUbYwLuocN@prawn.rmq.cloudamqp.com/qsqgdfrj');
  const channel = await connection.createChannel();

  // Define el exchange y las colas necesarias
  const exchange = 'delivery_exchange';
  const queuePagoCompletado = 'queue_pago_completado';

  // Crea el exchange y las colas
  await channel.assertExchange(exchange, 'direct', { durable: true });
  await channel.assertQueue(queuePagoCompletado, { durable: true });

  // Une las colas al exchange con enrutamiento específico
  channel.bindQueue(queuePagoCompletado, exchange, 'pago_completado');

  console.log('Servicio de Entrega esperando eventos...');

  // Escucha eventos de PagoCompletado
  channel.consume(queuePagoCompletado, (msg) => {
    const pago = JSON.parse(msg.content.toString());
    
    console.log(`Recibido evento PagoCompletado: ${JSON.stringify(pago)}`);
    const eventoEntregadorAsignado = {
        eventType: 'EntregadorAsignado',
        data: {
          idPedido: pago.data.idPedido,
          cliente: pago.data.cliente,
          entregador: asignarEntregador()
        },
      };

    channel.publish('', 'queue_entregador_asignado', Buffer.from(JSON.stringify(eventoEntregadorAsignado)));
    channel.publish('', 'queue_notificaciones', Buffer.from(JSON.stringify(eventoEntregadorAsignado)));
    console.log(`Entregador ${eventoEntregadorAsignado.data.entregador} asignado para el pedido ${eventoEntregadorAsignado.data.idPedido}...`);
  }, { noAck: true });
}

iniciarServicioDeEntrega();
