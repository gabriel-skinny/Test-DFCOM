# Parte 3 - Refatoração de Código

### O que incluir na refatoração

- Otimizações de consultas MongoDB.
- Correção de problemas de consistência de dados.
- Melhorias na organização e legibilidade do código.
- Documentação breve das mudanças realizadas.

### Melhorias

- Tirei todas as trataivas de execption do banco de dados, que podem ser pegos por um all exception filter e tratados globalmente no controller
- Removi as transactions desnecessarias
- Tirei os DTOS do service e coloquei no controller que é tratado automaticamente pelo Nest com o pipe
- Alterei o método update para não buscar todo o product que vai atualizar no banco, e sim verificar se existe pela metodo Exists, e passar somente os dados filtrados pelo DTO para atualiza-lo no banco.
