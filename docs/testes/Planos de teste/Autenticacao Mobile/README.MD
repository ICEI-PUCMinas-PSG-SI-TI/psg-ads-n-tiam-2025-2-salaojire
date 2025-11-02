# Plano de Testes de Software

## Autenticação (Mobile)
* **Descrição do Requisito**: (RF-004) - O sistema deve permitir que o administrador cadastre, edite e exclua itens disponíveis para aluguel.
* **Objetivo**: Validar autenticação com credenciais válidas
* **Registro de Testes**: [Registro de Testes - Autenticação Mobile](../../Registros%20de%20Teste/Autenticacao%20Mobile/README.md)

###  Caso de Teste 1 — Login bem sucedido
| Item | Descrição |
|------|------------|
| **Ação** | Inserir e-mail/senha cadastrados e acessar “Entrar” |
| **Resultado Esperado** | Redirecionamento para tela homepage do aplicativo |

###  Caso de Teste 2 — Email ou senha não preenchido
| Item | Descrição |
|------|------------|
| **Ação** | Deixar de inserir email ou senha e acessar "Entrar" |
| **Resultado Esperado** | Mensagem de erro: "Por favor, preencha o email e a senha." |

###  Caso de Teste 3 — Email ou senha inválidos
| Item | Descrição |
|------|------------|
| **Ação** | Inserir email ou senha inválida e acessar "Entrar" |
| **Resultado Esperado** | Mensagem de erro: "Email ou senha inválidos." |