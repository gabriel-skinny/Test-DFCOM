# Teste DFCom

Resolução para os 3 testes para a DFCom

## Parte 1

### Cenário

Você foi contratado para desenvolver um sistema de bilheteria para um cassino que opera 24/7. O sistema atual é caótico: os dados de vendas de ingressos estão inconsistentes, há frequentes quedas de sistema durante períodos de alta demanda, e os clientes estão insatisfeitos com a lentidão do processo de compra de ingressos.

O novo sistema deve:

- Permitir a compra de ingressos para diferentes eventos, com preços dinâmicos baseados na demanda.
- Gerenciar a lotação máxima dos eventos, evitando overbooking.
- Processar grandes volumes de transações simultâneas sem perda de dados ou degradação de desempenho.
- Oferecer um painel de controle em tempo real para os administradores monitorarem as vendas e ajustarem preços.

### Desafios Específicos:

- **Alta Confiabilidade**: O sistema deve funcionar sem interrupções, mesmo durante os picos de acesso.
- **Escalabilidade**: A solução precisa escalar horizontalmente para lidar com picos de demanda, como em shows populares ou eventos de grande porte.
- **Consistência de Dados**: Deve garantir que todos os ingressos vendidos sejam corretamente contabilizados, sem inconsistências ou duplicações.

## Solução

### High Level Architecure

Serviços:

- Event-Service: Serviço para mostrar, cadastrar, editar eventos e seus ingressos
- Booking-Service: Serviço para lidar com a compra e venda de ingressos
- Payment-Service: Serviço para lidar com os pagamentos
- Dashboard-Service: Serviço para mostrar o dashboard para administradores e alterar preços dos tickets

Comunicação entre serviços:

- Message Broker: Kafka

Databases

- Event Cache: Redis
- Event Database: MongoDb
- Booking Database: MongoDb
- Payment Database: MongoDb
- Dashboard Database: Mysql e replica dos 3 databases acima.

### Numeros do negocio

Media do sistema:

- 1 evento tem em media 200 ingressos
- 1 ingresso é buscado em media por 100 pessoas
- 10 eventos por mês
- Temos que aguentar 200 mil requisições por mês e 5 requisições por minutos 24/7 por serviço

Pico do sistema

- 1 evento pode chegar a ter até 10.000 ingressos
- 1 ingresso pode ser procurado por mais de 10.000 pessoas
- Podemos ter 30 eventos por mês
- 300mil compras realizadas por mês
- 300M de requisições de compra por mês e 157req/s
- 80% dos ingressos são comprados nos primeiros 5 dias.
- 240M de requisições no fluxo de compra nos primeiros 5 dias: 555 req/s

Requisitos:

- Registro e Atualização de Dados são mais importantes que Leitura
- Database:
  - 1KB por registro dado uma tabela com em media 10 campos
  - Registros de eventos e tickes: 300Mil/mes -> 1KB \* 300mil = 300MB/mês
  - Registros de ordens: 500mil/mes -> 1KB \* 500mil = 500MB/mês
  - Registro de pagamentos: 400mil/mes -> 1KB \* 400mil = 400MB/mês
  - Cada database precisará aguentar 400 mil Writes por mês e 500 writes por segundo em dias de pico
  - Cada database precisará aguentar 1500 mil Updates por mês e 2000 updates por segundo em dias de pico
- Aplicação:
  - Precisa ter um tempo de resposta medio de 200ms processando 30 requisições em paralelo para suportar 157 req/s
  - Em dia de pico um tempo de resposta medio de 200ms processando 100 requisições em paralelo para suportar 555 req/s

### Soluções Técnicas

- Criar clusters da aplicação conforme o número de CPUS da maquina
- Isolar os serviços e seus databases para diluir o processamento entre eles
- Criar instancias dos serviços conforme aumente a demanda e colocar um NGNIX como LoadBalancer para decidir qual serviço lidará com a requisição
- Executar as regras de negocio de modo assincrono, não deixando travar as requisições por processamentos que não precisam ser retornados em realtime.
- Habilitar autoescalling do MongoDb para criar mais nós conforma a demanda
- Podemos fazer uma estrategia de Shardring do database para criar um novo database a cada 50 eventos. Isso melhorará muito a performance da aplicação. Já que não precisamos pegar dados de eventos antigos e eles pararão de atarapalhar a performance da aplicação. Podemos até criar um database dedicado para um evento muito grande
- Habilita autoescalling no kafka para criar mais nós conforme a demanda
- Salvar em cache todas as requisições GET para pegar detalhes do evento para aliviar o banco de dados nos reads

Bancos: MongoDb e Mysql
MessageBroker: Kafka
Cache: Redis

### Rotas

#### Requisitar compra de ticket

- Cliente: HTTP
- Api: requestBuyTicket(ticketId)
  - Verifica se o ticket existe e está disponivel no Event-Service
  - Verifica se existe uma ordem em andamento para esse ticket
  - Cria uma ordem de ticket "Em pagamento"
  - Envia evento de ticket "Em pagamento"
- Database: MongoDb
- Message Broker: Kafka

Problema: Usuarios podem conseguir criar uma ordem ao mesmo tempo, ainda mais quanto se tem duas instancias rodando a mesma aplicação. Podemos ter uma trava no banco de dados para validar isso. Ou validar na hora da compra se existe mais de um usuario com uma ordem aberta.

#### Comprar ticket de evento

- Client: Http
- Api: buyTicket(orderId, paymentInformation, userId)

  - Verifica se essa ordem está "Em pagamento" e se tem o mesmo userId do token
  - Validar as informações de pagamento
  - Salva as informações de pagamento no banco
  - Envia ao provedor externo que lida com os métodos de pagamento

- Provedor externo: Http
- Api: webhookPaymentConfirmation()

  - Encontra o pagamento refente no banco
  - Atualiza o registro para pago
  - Emite evento com o pagamento e o orderId

- Event: Pagamento confirmado
- Api: confirmBuyOfTicket(ticketId, userId)
  - Verifica se existe uma ordem de "Em pagamento" para esse ticket
  - Altera ordem para paga
  - Envia evento de ticket pago

#### Alterar preço dos tickets

- Service: DashBoard-Service
- Client: Http
- Api: updateTicketsPriceByEvent(employeeId, addingPorcentage, eventId)
  - Altera todos os tickets daquele evento que não estão "Em pagamento" ou "Pago"
- Emite evento de Alteração de Preço de Ticket

- Service: Event-Service
- Evento: Alteração de Preço
- Api: updateTicketsPrice
  - Altera todos os tickets daquele evento que não estão "Em pagamento" ou "Pago"

### Eventos

#### Ticket em pagamento

DashBoard-Service

- Registra ticket sendo processado

Event-Service:

- Registra ticket sendo processado no banco

#### Ticket comprado

DashBoard-Service

- Registra pagamento no banco

Event-Service:

- Registra o pagamento no banco

#### Preço de Ticket Alterado

Event-Service:

- Apaga o cache daquele ticket
- Atualiza o banco de dados com o novo preço

### Banco de dados

Evento

- id (uuid)
- nome (varchar)
- ticketNumber (int)
- publishedDate (DateTime)
- endSellingDate (DateTime)

Ticket:

- id (uuid)
- price (int)
- buyed (boolean)
- buyer_id (user_id FK)
- is_available (boolean)

Order:

- id (uuid)
- ticket_id (uuid)
- status (on_payment | payed | expired | canceled )
- expire_time (DateTime)

Payment

- id (uuid)
- order_id (uuid)
- status (waiting confirmation | payed)
- webhook_url (varchar)
- external_id (uuid)

User:

- id
- name
- email
- password
