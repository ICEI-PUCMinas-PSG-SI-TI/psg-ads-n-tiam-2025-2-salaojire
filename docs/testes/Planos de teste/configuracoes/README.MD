# Plano de Testes de Software  

## Configurações:
- **Descrição do Requisito:** O sistema deve permitir que o administrador altere sua senha e atualize seu e-mail, enviando um link de confirmação para validar a alteração de e-mail.  
- **Objetivo:** Verificar se o sistema permite ao administrador alterar senha, solicitar alteração de e-mail, receber o e-mail de confirmação e validar o fluxo completo.  
- **Registro de Testes:** [Registro de Testes - configurações](../../Registros%20de%20Teste/configuracoes/README.MD)


---

### Caso de Teste 1 — Alterar senha com sucesso
| Item | Descrição |
|------|------------|
| **Ação** | Acessar a tela de configurações, preencher os campos “Senha atual” e “Nova senha” com valores válidos e clicar em “Alterar Senha”. |
| **Resultado Esperado** | O sistema deve validar a senha atual e salvar a nova senha. Uma mensagem de sucesso deve ser exibida informando que a senha foi alterada corretamente. |

---

### Caso de Teste 2 — Senha atual incorreta
| Item | Descrição |
|------|------------|
| **Ação** | Informar uma senha atual incorreta e tentar alterar para uma nova senha válida. |
| **Resultado Esperado** | O sistema deve impedir a alteração e exibir a mensagem “Senha atual incorreta”. Nenhuma alteração deve ser feita no banco de dados. |

---

### Caso de Teste 3 — Solicitar alteração de e-mail
| Item | Descrição |
|------|------------|
| **Ação** | Na tela de configurações, inserir um novo e-mail válido e clicar em “Alterar E-mail”. |
| **Resultado Esperado** | O sistema deve enviar um e-mail de confirmação para o novo endereço e exibir a mensagem “Verifique seu e-mail para confirmar a alteração”. |


### Caso de Teste 4 — Confirmar alteração de e-mail via link
| Item | Descrição |
|------|------------|
| **Ação** | Acessar o e-mail recebido, clicar no link de confirmação e aguardar a validação. |
| **Resultado Esperado** | O e-mail deve ser atualizado no sistema e uma página deve exibir a mensagem “E-mail alterado com sucesso”. |
