# Generalidades

### Tecnologías Utilizadas
- Node.js
- RabbitMQ

## Cómo Correr el Proyecto
1. Clona este repositorio: `git clone https://github.com/tu-usuario/tu-repositorio.git`
2. Instala las dependencias: `npm install`
3. Configura las variables de entorno en un archivo `.env`.
4. Ejecuta el servicio siguiendo las instrucciones de cada servicio.

# Servicio de Restaurante

## Solución
El Servicio de Restaurante es responsable de gestionar la información asociada a los restaurantes, como la actualización del menú y el estado de disponibilidad.

## Documentación del Servicio
### Funcionalidad
- Recepción de actualizaciones de restaurantes.
- Emisión de eventos "RestauranteActualizado" al recibir actualizaciones.

### Ejecutar el servicio

node .\Restaurante.js

### Comunicación con Otros Servicios
Este servicio emite eventos "RestauranteActualizado" que pueden ser consumidos por el Servicio de Notificaciones.


### APIs Expuestas
- **Crear Actualización:** `POST /crearActualizacion`
  - Crea una actualización de restaurante y emite el evento "RestauranteActualizado".
  -Esta configurado para el puerto 4000
  -Aqui dejo un ejemplo de como podria ser consumido en postman: 
    url: localhost:4000/crearActualizacion
    body:  
    {  
        "nuevoMenu": "Comida Rapida",
        "estadoDisponibilidad": "abierto"
        },

# Servicio de Pedidos
## Solución
El Servicio de Pedidos es responsable de recibir y gestionar los pedidos de comida de los clientes en nuestro sistema de entrega de comida en línea.

## Documentación del Servicio
### Funcionalidad
- Recepción y gestión de pedidos de comida.
- Emisión de eventos "PedidoCreado" al recibir nuevos pedidos.

### Ejecutar el servicio

node ServicioPedidos.js

### Comunicación con Otros Servicios
Este servicio emite eventos "PedidoCreado" que pueden ser consumidos por el Servicio de Notificaciones.

### APIs Expuestas
- **Crear Pedido:** `POST /crearPedido`
  - Crea un nuevo pedido y emite el evento "PedidoCreado".
  -Esta configurado para el puerto 3000
  -Aqui dejo un ejemplo de como podria ser consumido en postman: 
   
   url: localhost:3000/crearPedido 
   body:  
   {
        "cliente": "July",
        "comida":"sushi",
        "cantidad":"13"
    }

# Servicio de Notificaciones

## Solución
El Servicio de Notificaciones se encarga de enviar notificaciones a los clientes sobre el estado de sus pedidos y a los restaurantes sobre actualizaciones relevantes.

## Documentación del Servicio
### Funcionalidad
- Escucha eventos de otros microservicios.
- Procesa eventos y envía notificaciones correspondientes.

### Comunicación con Otros Servicios
Este servicio escucha eventos de otros microservicios, como el Servicio de Pedidos y el Servicio de Restaurantes.

### Tecnologías Utilizadas
- Node.js
- RabbitMQ

## Cómo Correr el Proyecto
1. Clona este repositorio: `git clone https://github.com/tu-usuario/tu-repositorio.git`
2. Navega al directorio del servicio: `cd servicio-de-notificaciones`
3. Instala las dependencias: `npm install`
4. Configura las variables de entorno en un archivo `.env`.
5. Ejecuta el servicio: `npm start`


# Servicio de Pagos

## Solución
El Servicio de Pagos maneja las transacciones de pago para los pedidos realizados en nuestro sistema de entrega de comida en línea.

## Documentación del Servicio
### Funcionalidad
- Escucha eventos de PedidoCreado.
- Procesa el pago y emite eventos PagoCompletado.
- Publica eventos en colas específicas.

### Comunicación con Otros Servicios
Este servicio escucha eventos de PedidoCreado y emite eventos PagoCompletado. Además, publica eventos en la cola compartida 'queue_notificaciones'.


# Servicio de Entrega

## Solución
El Servicio de Entrega se encarga de asignar entregadores a los pedidos y rastrear su estado en nuestro sistema de entrega de comida en línea.

## Documentación del Servicio
### Funcionalidad
- Escucha eventos de PagoCompletado.
- Asigna un entregador al pedido y emite eventos EntregadorAsignado.
- Publica eventos en colas específicas.

### Comunicación con Otros Servicios
Este servicio escucha eventos de PagoCompletado y emite eventos EntregadorAsignado. Además, publica eventos en la cola compartida 'queue_notificaciones'.

