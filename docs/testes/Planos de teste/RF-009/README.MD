# Plano de Testes de Software

## RF-009:
* **Descrição do Requisito**: O sistema deve permitir que o administrador cadastre, edite e exclua itens disponíveis para aluguel.
* **Objetivo**: Validar funcionalidades e consistência dos itens no sitema.
* **Registro de Testes**: [Registro de Testes - RF-009](../../Registros%20de%20Teste/RF-009/README.md)

###  Caso de Teste 1 — Carregar itens
| Item | Descrição |
|------|------------|
| **Ação** | Carregar itens ao navegar ou atualizar a pagina |
| **Resultado Esperado** | Carregamento e visualização da lista de itens armazenados ou uma lista caso não exista dados de itens criados |

###  Caso de Teste 2 — Criação de item
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no botão "Adicionar novo" e preencher formulario de cadastro|
| **Resultado Esperado** | Abrir Pop-up/Modal de cadastro de item e se todos os campos estiverem preenchidos uma mensagem de sucesso aparecerá|

###  Caso de Teste 3 — Atualização de item
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no icone de caneta no card do item e iniciar alterações no formulário|
| **Resultado Esperado** | Abrir Pop-up/Modal de edição de item ao clicar na opção "salvar alterações" um alerta de sucesso aparecerá|

###  Caso de Teste 4 — Exclusão de item
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no icone de lixeira no card do item e confirmar ação" |
| **Resultado Esperado** | Abrir Pop-up/Modal de exclusão de item e ao clicar na opção "Sim" mostrar mensagem de sucesso ao excluir o item|