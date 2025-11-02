# Plano de Testes de Software  

## RF-010:
* Descrição do Requisito: O sistema deve permitir que o administrador gerencie agendamentos de festas (criar, alterar status ou cancelar).  
* Objetivo: Verificar se o sistema permite ao administrador visualizar clientes, verificar agendamentos existentes, criar novos agendamentos e listar corretamente os dados.  
* Registro de Testes: [Registro de Testes - RF-010](../../Registros%20de%20Teste/RF-010/README.md)

---

### Caso de Teste 1 — Criar novo agendamento
| Item | Descrição |
|------|------------|
| Ação | Acessar a tela de agendamentos, selecionar o cliente e verificar se ele já possui agendamento. Caso tenha ou não tenha, o administrador pode criar um novo agendamento clicando em "Novo Agendamento". Em seguida, preencher os campos obrigatórios (nome do evento, datas e itens) e clicar em "Criar". |
| Resultado Esperado | O novo agendamento deve aparecer na lista do cliente com status "AGENDADO", exibindo corretamente as informações de nome do evento, data e valor total. |

---

### Caso de Teste 2 — Listar agendamentos existentes
| Item | Descrição |
|------|------------|
| Ação | Acessar a tela de agendamentos, selecionar um cliente que já possui agendamento e verificar a listagem exibida. |
| Resultado Esperado | O sistema deve exibir todos os agendamentos associados ao cliente, mostrando nome do evento, status, data de início, data de fim e valor total. |

---

### Observações
- Os testes foram realizados com sucesso para criação e listagem de agendamentos.  
- As funcionalidades de alterar status e excluir agendamento ainda não foram implementadas e, portanto, não foram testadas neste momento.
