# Payment Service

## Requirements

- Consegue criar um pagamento
- Efetiva o pagamento caso recebe a confirmação do provedor externo
- Cancela pagamento caso tenha recebe um erro de processamento
- Cancela o pagamento depois de 2 minutos sem resposta do provedor externo

## Eventos - Pub

- Pagamento Confirmado
- Erro no pagamento

## Eventos - Sub

- Criar pagamento
