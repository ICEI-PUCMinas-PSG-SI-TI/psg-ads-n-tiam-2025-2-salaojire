# Plano de Testes de Software

## RF-011:

- **Descrição do Requisito:** O sistema deve permitir que o administrador visualize informações completas dos clientes.
- **Objetivo:** Garantir que o administrador consiga visualizar corretamente os dados de cada cliente, incluindo informações pessoais e pedidos realizados.
- **Registro de Testes:** [Registro de Testes - RF-011](../../Registros%20de%20Testes%20de%20Software/RF-011/README.md)

---

### Caso de Teste 1 — Exibição da lista de clientes

| Item | Descrição |
|------|------------|
| **Ação** | Acessar a aba **Clientes** no menu inferior do aplicativo. |
| **Resultado Esperado** | Exibir lista com nome e e-mail de cada cliente cadastrado. |

---

### Caso de Teste 2 — Visualização completa do cliente

| Item | Descrição |
|------|------------|
| **Ação** | Selecionar um cliente da lista para abrir a tela **Visualizar Cliente**. |
| **Resultado Esperado** | Exibir informações completas do cliente (nome, e-mail, telefone) e seus **pedidos realizados** com data, status e valor. |
