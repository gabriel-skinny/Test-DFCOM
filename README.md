# Teste DFCom

Resolução para os 3 testes para a DFCom

- [Parte 1](#parte-1)
- [Parte 2](https://github.com/gabriel-skinny/Test-DFCOM/tree/master/parte%202)
- [Parte 3](https://github.com/gabriel-skinny/Test-DFCOM/tree/master/parte%203)

## Parte 1

Tabela de conteúdos

- [Proposta](#proposta)
- [Solução](#solução)
- [Numeros do Negocio](#numeros-do-negocio)
- [Soluções tecnicas](#soluções-técnicas)
- [High Level Architecure](#high_level_architecure)
- [Funcionalidades](#funcionalidades)
  - [Requisitar compra de ticket](#Requisitar-compra-de-ticket)
  - [Comprar ticket de evento](#Comprar-ticket-de-evento)
  - [Alterar preço dos tickets](#Alterar-preço-dos-tickets)
  - [Visualizar eventos](#visualizar-eventos)
- [Banco de Dados](banco-de-dados)

## Proposta

### Cenario

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

### Numeros do negocio

Media do sistema:

- 1 evento tem em media 1000 ingressos
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

Performance da Aplicação:

- Criar clusters da aplicação conforme o número de CPUS da maquina
- Isolar os serviços em maquina proprias e seus databases para diluir o processamento entre eles
- Criar instancias dos serviços conforme aumente a demanda e colocar um NGNIX como LoadBalancer para decidir qual serviço lidará com a requisição
- Executar as regras de negocio e fazer comunicação entre serviços de modo assincrono, não deixando travar as requisições por processamentos que não precisam ser retornados em realtime.

Performance do Banco e outros Serviços:

- Habilitar autoescalling do MongoDb para criar mais nós conforma a demanda
- Criar um Database dedicado para Eventos muito grandes
- Podemos fazer uma estrategia de replicar os dados para um banco de dados de Histórico e deixar o banco da aplicação apenas com os eventos que estão ativos, isso melhorará muito a performance da aplicação.
- Habilita autoescalling no kafka para criar mais nós conforme a demanda
- Salvar em cache todas as requisições GET para pegar detalhes do evento para aliviar o banco de dados nos reads

Bancos: MongoDb e Mysql
MessageBroker: Kafka
Cache: Redis
Fila: SQS

### High Level Architecure

Serviços:

- Event-Service: Serviço para mostrar, cadastrar, editar eventos e seus ingressos
- Order-Service: Serviço para lidar com a compra e venda de ingressos
- Payment-Service: Serviço para lidar com os pagamentos
- Dashboard-Service: Serviço para mostrar o dashboard para administradores e alterar preços dos tickets

Comunicação entre serviços:

- Fila: Sqs
- Message Broker: Kafka

Databases

- Event Cache: Redis
- Event Database: MongoDb
- Booking Database: MongoDb
- Payment Database: MongoDb
- Dashboard Database: Mysql e replica dos 3 databases acima atualizado em RealTime com Kafka Connect.

### Funcionalidades

#### Requisitar compra de ticket

- Service: Event-Service
- Cliente: Http
- Api: requestBuyTicket(eventId)

  - Seleciona um ticketId que está disponivel para aquele evento
  - Envia o ticketId para uma fila que não permite mensagens duplicadas para criar a ordem
  - Marca ticket como indisponivel se foi enviada com sucesso

- Database: MongoDb
- Fila: SQS

- Service: Order-Service
- Qeueu: Fila de ordens para criar
- Api: createOrder(ticketId)

  - Verifica se existe uma ordem em andamento para esse ticket
  - Cria uma ordem de ticket "Em pagamento"

- Database: Mongo

#### Comprar ticket de evento

- Service: Order-Service
- Client: Http
- Api: confirmPayment(orderId, userId)

  - Verifica se essa ordem está "Em pagamento"
  - Chama rota para fazer pagamento do Payment-Service

- Service: Payment-Service
- Client: Http
- Api: makePayment(orderId, paymentInformation, userId)

  - Validar as informações de pagamento
  - Salva as informações de pagamento no banco
  - Envia ao provedor externo que lida com os métodos de pagamento

- Service: Payment-Service
- Provedor externo: Http
- Api: webhookPaymentConfirmation(externalId)

  - Atualiza o registro pendente para pago
  - Emite evento com o pagamento e o orderId

- Service: Order-Service
- Event: Pagamento confirmado
- Api: handlePayedOrderEvent(orderId, userId)

  - Verifica se existe status da ordem
  - Altera ordem para paga

- Service: Event-Service
- Event: Pagamento confirmado
- Api: handleTicketPayedEvent(ticketId, userId)
  - Verifica status atual do Ticket
  - Se já estiver pago emitir um log de erro avisando a duplicação
  - Altera ticket para pago com o buyerId
  - Envia um Server-Side-Event para o FrontEnd

#### Alterar preço dos tickets

- Service: DashBoard-Service
- Client: Http
- Api: updateTicketsPriceByEvent(employeeId, addingPorcentage, eventId)

  - Altera todos os tickets daquele evento que estão available
  - Emite evento de Alteração de Preço de Ticket

- Service: Event-Service
- Evento: Alteração de Preço
- Api: updateTicketsPrice
  - Altera todos os tickets daquele evento que não estão "Em pagamento" ou "Pago"

#### Visualizar eventos

- Service: Event-Service
- Client: HTTP
- Api: getEvents(page, perPage): Event[]
  - Lista os eventos registrados no banco dado a paginação

### Banco de dados

Evento

- id (uuid)
- name (varchar)
- ticketNumber (int)
- publishedDate (DateTime)
- endSellingDate (DateTime)

Ticket:

- id (uuid)
- price (int)
- buyed (boolean)
- buyer_id (user_id FK)
- event_id (uuid)
- is_available (boolean)

Order:

- id (uuid)
- ticket_id (uuid)
- value (int)
- status (on_payment | payed | expired | canceled )
- expire_time (DateTime)

Payment

- id (uuid)
- order_id (uuid)
- user_id (uuid)
- external_id (uuid)
- value (int)
- status (waiting confirmation | payed)
- webhook_url (varchar)
- creditCardNumber (varchar)
- securityNumber (vachar)
- expirationDate (varchar)

User:

- id
- name
- email
- password
