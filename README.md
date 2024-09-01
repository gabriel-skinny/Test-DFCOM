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

### Serviços

- Event-Service: Serviço para mostrar, cadastrar, editar eventos e seus ingressos
- Booking-Service: Serviço para lidar com a compra e venda de ingressos
- Waiting-Queue: Fila de espera para comprar ingressos
- Dashboard-Service: Serviço para mostrar o dashboard para administradores e alterar preços dos tickets

### Numeros

- 1 evento pode ter mais de 10.000 ingressos
- 1 ingresso é buscado em media por 10 pessoas
- 1 ingresso pode ter mais de 1000 pessoas o procurando
- No maior evento teremos 1000 requisições por ingresso, ou seja, 10M de requisições
- A venda de um evento dura 1 mês, teremos 10M/Mês, 4 Req/S
- O pico será nos primeiros 4 dias, que ficará com 70% das requisições, 17,5M/Dia e 50 Req/S

### Rotas

#### Comprar ticket de evento

- Cliente: HTTP
- Api: buyTicket(ticketId, userId)

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
- isOnqueue (boolean)

User:

- id
- name
- email
- password
