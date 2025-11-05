# Plano de Testes de Software  

## RF-010:
- Descrição do Requisito: O sistema deve permitir que o administrador gerencie agendamentos de eventos (criar, alterar status ou cancelar).  
- Objetivo: Verificar se o sistema permite ao administrador visualizar clientes e gerenciar agendamentos, incluindo as ações de criar, listar, editar e excluir.
- Registro de Testes: [Registro de Testes - RF-010](../../Registros%20de%20Teste/RF-010/README.md)

---

### Caso de Teste 1 — Criar novo agendamento
| Item | Descrição |
|------|------------|
| Ação | Acessar a tela de agendamentos, selecionar o cliente e verificar se ele já possui agendamento. Caso tenha ou não tenha, o administrador pode criar um novo agendamento clicando em "Novo Agendamento". Em seguida, preencher os campos obrigatórios (nome do evento, datas e itens) e clicar em "Criar". |
| Resultado Esperado | O novo agendamento deve aparecer na lista do cliente com status "AGENDADO", exibindo corretamente as informações de nome do evento, datas e valor total calculado automaticamente. |

---

### Caso de Teste 2 — Listar agendamentos existentes
| Item | Descrição |
|------|------------|
| Ação | Acessar a tela de agendamentos, selecionar um cliente que já possua agendamento e verificar a listagem exibida. |
| Resultado Esperado | O sistema deve exibir todos os agendamentos associados ao cliente, mostrando nome do evento, status, data de início, data de fim e valor total. |

---

### Caso de Teste 3 — Editar agendamento existente
| Item | Descrição |
|------|------------|
| Ação | Na tela de visualização do cliente, clicar no ícone de edição de um agendamento existente. Alterar os campos desejados (nome do evento, datas ou itens) e clicar em "Salvar Alterações". |
| Resultado Esperado | O sistema deve atualizar as informações do agendamento corretamente, exibindo os novos valores e datas na listagem. O valor total deve ser recalculado conforme os itens selecionados. |

---

### Caso de Teste 4 — Excluir agendamento
| Item | Descrição |
|------|------------|
| Ação | Na tela de visualização do cliente, clicar no ícone de lixeira ao lado do agendamento. Confirmar a exclusão quando for exibido o alerta “Tem certeza que deseja excluir este agendamento?”. |
| Resultado Esperado | O agendamento deve ser removido do sistema e não aparecer mais na listagem. Caso não existam mais agendamentos para o cliente, o sistema deve exibir a mensagem “Nenhum agendamento encontrado.” |
