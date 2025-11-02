# Plano de Testes de Software

## RF-012:

- **Descrição do Requisito:**  
  O sistema deve permitir que o administrador visualize, cadastre, edite, pesquise e exclua dados dos clientes.

- **Objetivo:**  
  Garantir que o administrador consiga gerenciar corretamente os clientes, validando todas as ações possíveis no módulo: cadastro, visualização, pesquisa, edição, exclusão e validação de campos obrigatórios.

* **Plano de Testes**: [Plano de Testes - RF-012](../../Planos%20de%20teste/RF-012/README.MD)

---

### Caso de Teste 1 — Cadastro de Cliente
| Item | Descrição |
|------|------------|
| **Ação** | Preencher o formulário de cadastro com nome, e-mail, telefone e senha, e clicar em **Cadastrar**. |
| **Resultado Esperado** | O sistema deve cadastrar o cliente e exibir o novo registro na lista de clientes. |

---

### Caso de Teste 2 — Visualizar Cliente
| Item | Descrição |
|------|------------|
| **Ação** | Selecionar um cliente da lista para abrir a tela **Visualizar Cliente**. |
| **Resultado Esperado** | O sistema deve exibir corretamente os dados do cliente (nome, e-mail, telefone e histórico de pedidos). |

---

### Caso de Teste 3 — Pesquisar Cliente
| Item | Descrição |
|------|------------|
| **Ação** | Digitar o nome ou e-mail do cliente na barra de pesquisa. |
| **Resultado Esperado** | A listagem deve ser filtrada e exibir apenas os clientes correspondentes à pesquisa. |

---

### Caso de Teste 4 — Editar Cliente
| Item | Descrição |
|------|------------|
| **Ação** | Clicar no ícone de lápis, alterar dados do cliente (ex.: telefone ou e-mail) e clicar em **Salvar**. |
| **Resultado Esperado** | As alterações devem ser salvas e refletidas na listagem de clientes. |

---

### Caso de Teste 5 — Excluir Cliente
| Item | Descrição |
|------|------------|
| **Ação** | Clicar no ícone de lixeira e confirmar a exclusão do cliente. |
| **Resultado Esperado** | O cliente deve ser removido da lista e o sistema deve exibir mensagem de confirmação de exclusão. |

---

### Caso de Teste 6 — Validação de Campos
| Item | Descrição |
|------|------------|
| **Ação** | Atualização da tabela |
| **Resultado Esperado** | O sistema deve mostrar os clientes após todos esses testes |
