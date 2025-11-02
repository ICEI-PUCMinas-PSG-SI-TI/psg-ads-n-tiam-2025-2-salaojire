# Plano de Testes de Software

## RF-012:

- **Descrição do Requisito:** O sistema deve permitir que o administrador atualize ou cadastre dados dos clientes.
- **Objetivo:** Validar as operações de CRUD (Criar, Ler, Atualizar e Deletar) dos clientes no módulo administrativo.
* **Plano de Testes**: [Plano de Testes - RF-012](../../Planos%20de%20teste/RF-012/README.MD)

---

### Caso de Teste 1 — Cadastro de Cliente

| Item | Descrição |
|------|------------|
| **Ação** | Inserir um novo cliente preenchendo os campos obrigatórios (Nome, Email, Telefone e Senha). |
| **Resultado Esperado** | O sistema deve cadastrar o cliente e exibir mensagem de sucesso. |

---

### Caso de Teste 2 — Edição de Cliente

| Item | Descrição |
|------|------------|
| **Ação** | Editar um cliente existente alterando nome, email ou telefone. |
| **Resultado Esperado** | O sistema deve atualizar as informações e confirmar a alteração. |

---

### Caso de Teste 3 — Visualização de Cliente

| Item | Descrição |
|------|------------|
| **Ação** | Clicar em um cliente da lista para visualizar suas informações completas. |
| **Resultado Esperado** | O sistema deve exibir os dados detalhados do cliente e os pedidos relacionados. |

---

### Caso de Teste 4 — Exclusão de Cliente

| Item | Descrição |
|------|------------|
| **Ação** | Clicar no ícone de lixeira e confirmar a exclusão do cliente. |
| **Resultado Esperado** | O sistema deve remover o cliente da lista e exibir a mensagem de confirmação. |

---

### Caso de Teste 5 — Busca de Cliente

| Item | Descrição |
|------|------------|
| **Ação** | Digitar o nome ou email do cliente na barra de pesquisa. |
| **Resultado Esperado** | O sistema deve filtrar e exibir apenas os clientes correspondentes. |

---

### Caso de Teste 6 — Validação de Campos

| Item | Descrição |
|------|------------|
| **Ação** | Tentar cadastrar ou editar um cliente com campos vazios ou formato inválido. |
| **Resultado Esperado** | O sistema deve bloquear a ação e exibir mensagens de erro de validação. |
