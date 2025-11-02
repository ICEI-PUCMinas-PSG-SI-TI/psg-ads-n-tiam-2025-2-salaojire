# Plano de Testes de Software

## RF-010:
* Descrição do Requisito: O sistema deve permitir que o administrador gerencie agendamentos de festas (criar, alterar status ou cancelar).
* Objetivo: Verificar se o sistema permite ao administrador visualizar clientes, criar novos agendamentos e listar os existentes, garantindo que os dados sejam corretamente salvos e exibidos.
* Registro de Testes: [Registro de Testes - RF-010](../../Registros%20de%20Teste/RF-010/README.md)

### Caso de Teste 1 — Criar novo agendamento
| Item | Descrição |
|------|------------|
| Ação | Acessar a tela Gerenciar Agendamentos, selecionar um cliente e clicar em "Novo Agendamento". Em seguida, preencher os campos obrigatórios (nome do evento, datas e itens) e clicar em "Criar". |
| Resultado Esperado | O novo agendamento deve aparecer na lista de agendamentos do cliente, com status "AGENDADO". |

### Caso de Teste 2 — Listar agendamentos existentes
| Item | Descrição |
|------|------------|
| Ação | Na tela Gerenciar Agendamentos, selecionar um cliente que já possui agendamentos cadastrados. |
| Resultado Esperado | O sistema deve exibir todos os agendamentos associados ao cliente, mostrando nome do evento, status, data de início, data de fim e valor total. |

### Observações
- Os testes foram realizados com sucesso para criação e listagem de agendamentos.  
- As funcionalidades de alterar status e excluir agendamento ainda não foram implementadas e, portanto, não foram testadas neste momento.
