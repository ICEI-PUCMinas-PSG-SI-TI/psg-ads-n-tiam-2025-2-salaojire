# Plano de Testes de Software

## RF-009:
* **Descrição do Requisito**: O sistema deve notificar o administrador sobre novas solicitações de contato e de orçamento recebido
* **Objetivo**: Validar funcionalidades e persistencia das solicitações no sitema.
* **Registro de Testes**: [Registro de Testes - RF-009](../../Registros%20de%20Teste/RF-007/README.md)

###  Caso de Teste 1 — Carregar solicitações
| Item | Descrição |
|------|------------|
| **Ação** | Carregar solicitações ao navegar ou atualizar a pagina |
| **Resultado Esperado** | Carregamento e visualização da lista de solicitações armazenados ou uma lista caso não exista dados de itens criados |

###  Caso de Teste 2 — Visualização de solicitação
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no icone eye para navegar ate a pagina de informações da solicitação|
| **Resultado Esperado** | Abrir Pagina de visualização de solicitação onde as informações do cliente e do periodo de solicitação assim como os possiveis itens adicionados irão aparecer|

###  Caso de Teste 3 — Atualização de item solicitado
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no icone de caneta no card do item e iniciar alterações no formulário|
| **Resultado Esperado** | Abrir Pop-up/Modal de edição de item ao clicar na opção "salvar alterações" um alerta de sucesso aparecerá|

###  Caso de Teste 4 — Exclusão de item solicitado
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no icone de lixeira no card do item e confirmar ação" |
| **Resultado Esperado** | Abrir Pop-up/Modal de exclusão de item e ao clicar na opção "Sim" mostrar mensagem de sucesso ao excluir o item|