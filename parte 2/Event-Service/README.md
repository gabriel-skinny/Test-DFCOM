# Event-Service

## Requirements

User:

- Consegue listar os eventos disponiveis e ver os tickets disponiveis
- Consegue criar uma ordem de pagamento para um ticket de um evento
- Consegue ver seus tickets comprados

Admin:

- Consegue visualizar todos os eventos cadastrados com filtros
- Consegue cadastrar eventos e tickets com valores especificos
- Consegue deixar um evento disponivel para compra
- Consegue editar valores de tickets de um evento
- Consegue deixar um evento indisponivel
- Consegue deletar um evento

## Eventos - Pub

- Criar ordem de pagamento para ticket
- Evento indisponivel

## Eventos - Sub

- Ordem paga
- Ordem cancelada

## Banco de dados

Event:

- id (uuid)
- name (uuid)
- creatorId (uuid)
- ticketNumber (int)
- availableTickets (int)
- endSellingDate (date)
- publishedDate (date)
- available (boolean)

ticket:

- id
- price (int)
- eventId(uuid)
- type (string)
- buyed (boolean)
- buyerId (int)
- available: (boolean)
