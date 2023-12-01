const amqp = require('amqplib');

const rabbitmqURL = 'Introduce aqui tu url';
const exchangeName = 'notificaciones_exchange';
const queueName = 'queue_notificaciones';

async function iniciarServicioDeNotificaciones() {
  const connection = await amqp.connect(rabbitmqURL);
  const channel = await connection.createChannel();

  // Crear el exchange y la cola
  await channel.assertExchange(exchangeName, 'fanout', { durable: false });
  await channel.assertQueue(queueName, { durable: false });
  channel.bindQueue(queueName, exchangeName, '');

  console.log('Servicio de Notificaciones esperando eventos...');

  // Escuchar eventos de todos los demás microservicios
  channel.consume(queueName, (msg) => {
    const evento = JSON.parse(msg.content.toString());
    procesarEvento(evento);
  }, { noAck: true });
}

function procesarEvento(evento) {
  // Lógica para procesar el evento y enviar notificaciones
  const mensajeNotificacion = generarMensajeNotificacion(evento);
  if(evento.eventType=='RestauranteActualizado')
  {
    const actualizacion = obtenerIdActualizacionDesdeEvento(evento);
    console.log("🚀 ~ file: ServicioNotificaciones.js:28 ~ procesarEvento ~ evento:", evento)
    enviarNotificacion(actualizacion, mensajeNotificacion, true);
  }else {
    const cliente = obtenerIdClienteDesdeEvento(evento);
    console.log("🚀 ~ file: ServicioNotificaciones.js:28 ~ procesarEvento ~ evento:", evento)
    enviarNotificacion(cliente, mensajeNotificacion, false);
}
}
function obtenerIdClienteDesdeEvento(evento) {
  // Lógica para obtener el ID del cliente desde el evento
  return evento.data.cliente;
}
function obtenerIdActualizacionDesdeEvento(evento) {
    // Lógica para obtener el ID del cliente desde el evento
    return evento.data.idActualizacion;
  }

function generarMensajeNotificacion(evento) {
  // Lógica para generar el mensaje de notificación basado en el evento
  if(evento.eventType=='RestauranteActualizado')
  {
    return `Se ha actualizado el estado del restaurante ${evento.data.idActualizacion},estado: ${evento.eventType}`;
  }else {
    return `Se ha actualizado el estado del pedido ${evento.data.idPedido}, estado: ${evento.eventType}`;
  }
}

function enviarNotificacion(id, mensaje, restaurante) {
  console.log("🚀 ~ file: ServicioNotificaciones.js:59 ~ enviarNotificacion ~ mensaje:", mensaje)
  // Lógica para enviar la notificación al cliente (simulado aquí)
  if(restaurante)
  {
    console.log(`Enviando notificación al restaurante ${id}: ${mensaje}`);
  }else {
    console.log(`Enviando notificación al cliente ${id}: ${mensaje}`);
  }
}

iniciarServicioDeNotificaciones();
