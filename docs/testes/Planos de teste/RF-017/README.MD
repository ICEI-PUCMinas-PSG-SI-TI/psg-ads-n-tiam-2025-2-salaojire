# Plano de Testes de Software

## RF-017:
* **Descrição do Requisito**: O sistema deve permitir que administradores e clientes recuperem a senha esquecida.
* **Objetivo**: Verificar se o sistema possibilita a recuperação de senha de forma segura e funcional, tanto para administradores quanto para clientes.
* **Registro de Testes**: [Registro de Testes - RF-017](../../Registros%20de%20Teste/RF-017/README.md)

###  Caso de Teste 1 — Recuperar senha
| Item | Descrição |
|------|------------|
| **Ação** | Acessar a tela de login e clicar em “Esqueci minha senha”. Informar o e-mail cadastrado (de administrador ou cliente) e confirmar a solicitação de redefinição. |
| **Resultado Esperado** | O sistema deve enviar um e-mail de redefinição de senha e exibir uma mensagem informando que o link foi enviado com sucesso. Ao acessar o link, o usuário deve conseguir criar uma nova senha e realizar login normalmente. |

###  Caso de Teste 2 — E-mail não cadastrado
| Item | Descrição |
|------|------------|
| **Ação** | Acessar a opção “Esqueci minha senha” e informar um e-mail que não esteja cadastrado no sistema. |
| **Resultado Esperado** | O sistema deve exibir uma mensagem informando que o e-mail não foi encontrado e não deve enviar nenhum link de redefinição. |
