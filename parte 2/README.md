# Parte 2

## Usuario

- `POST - /user`: Cria um usuário
- `POST - /user/login`: Faz login e recebe token de autenticação

## Rotas implementadas

- `GET - /events`: Lista todos os eventos
- `POST - /event/request-buy-order/:event_id`: Requisição para fazer uma ordem de comprar um ticket
- `POST - /order/checkout-order/:order_id`: Requisição para finalizar o pagamento

## Como rodar

- Clone o repositório na maquina
- No diretório principal digite o comando `docker-compose up -d --build`
- As rotas estarão disponiveis no `localhost:8000`
- A documentação pode ser acessada por esse link: `localhost:8000/api`
