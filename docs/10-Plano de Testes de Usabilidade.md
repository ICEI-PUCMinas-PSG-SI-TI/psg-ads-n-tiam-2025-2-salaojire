#  Plano de Testes de Funcionalidades e Usabilidade

## 1. Objetivo
Verificar se as funcionalidades implementadas no aplicativo **Salão Jire (Mobile)** estão operando conforme os requisitos funcionais definidos, avaliando também a **usabilidade**, **fluidez das telas** e **respostas do sistema** durante o uso no **Expo Go**.


## 2. Escopo dos Testes
Os testes abrangem as funcionalidades de **autenticação** (login e cadastro de cliente), **CRUD de clientes e itens**, **visualização de pedidos e solicitações**, e **integração com Firebase Firestore e Storage**.  
Foram realizados em ambiente de testes com o **Firebase público** configurado via arquivo .env.


## 3. Ambiente de Testes

| Elemento | Descrição |
|-----------|------------|
| **Dispositivo** | Smartphone Android (versão 13) |
| **Framework** | Expo 54.0.20 (Expo Go) |
| **Linguagem** | TypeScript + React Native |
| **Backend** | Firebase (Firestore / Auth / Storage) |
| **Versão Testada** | 1.0.0 |

## 4. Funcionalidades Testadas

| Código RF | Requisito Funcional | Responsável | Status |
|------------|--------------------|--------------|--------|
| **RF-009** | CRUD de Itens | Gabriel |  Testado |
| **RF-010** | Gerenciamento de Agendamentos | Junio |  Testado |
| **RF-011** | Visualizar informações de clientes | Henrique |  Testado |
| **RF-012** | Atualizar/cadastrar dados de clientes | Henrique | Testado |
| **RF-017** | Recuperação de senha | Gabriel Assis |  Testado |
| **RF-018** | Gerenciar administradores | João |  Testado |
| **Login com autenticação** | Implementação do login Firebase | Isaque |  Testado |

## 5. Casos de Teste Funcional

###  Caso de Teste 1 — Cadastro de Cliente
| Item | Descrição |
|------|------------|
| **ID** | CT-001 |
| **Requisito Relacionado** | RF-012 |
| **Objetivo** | Verificar se o cadastro cria corretamente o cliente no Firestore e autentica via Firebase Auth |
| **Pré-condição** | Aplicativo em tela de cadastro, Firebase configurado |
| **Ação** | Inserir e-mail, senha, nome e telefone e pressionar “Cadastrar” |
| **Resultado Esperado** | Usuário criado no Auth e documento criado em `Clientes/{uid}` |
| **Resultado Obtido** | Conforme esperado |
| **Status** |  Aprovado |

###  Caso de Teste 2 — Login de Cliente
| Item | Descrição |
|------|------------|
| **ID** | CT-002 |
| **Requisito Relacionado** | RF-011 |
| **Objetivo** | Validar autenticação com credenciais válidas |
| **Ação** | Inserir e-mail/senha cadastrados e clicar “Entrar” |
| **Resultado Esperado** | Redirecionamento para tela inicial do cliente |
| **Resultado Obtido** | Autenticação bem-sucedida |
| **Status** |  Aprovado |

###  Caso de Teste 3 — Visualização de Cliente
| Item | Descrição |
|------|------------|
| **ID** | CT-003 |
| **Requisito Relacionado** | RF-011 |
| **Objetivo** | Verificar exibição de dados do cliente |
| **Ação** | Abrir aba “Clientes” no app |
| **Resultado Esperado** | Campos de Nome, E-mail e Telefone preenchidos corretamente |
| **Resultado Obtido** | Exibição correta (dados mockados e dinâmicos) |
| **Status** |  Aprovado |


###  Caso de Teste 4 — CRUD de Itens
| Item | Descrição |
|------|------------|
| **ID** | CT-004 |
| **Requisito Relacionado** | RF-009 |
| **Objetivo** | Verificar criação, edição e exclusão de itens no Firestore |
| **Ação** | Executar funções `createItem`, `updateItem` e `deleteItem` |
| **Resultado Esperado** | Dados salvos/atualizados/removidos em `Itens` |
| **Resultado Obtido** | Conforme esperado |
| **Status** |  Aprovado |

###  Caso de Teste 5 — Integração Firebase
| Item | Descrição |
|------|------------|
| **ID** | CT-005 |
| **Requisito Relacionado** | RF-011 / RF-012 |
| **Objetivo** | Verificar comunicação com Firestore a partir da tela Index (teste de conexão) |
| **Ação** | Clicar no botão “Testar Conexão com Firebase” |
| **Resultado Esperado** | Documento `conexao-teste` criado em `testes` |
| **Resultado Obtido** | Documento criado com sucesso |
| **Status** |  Aprovado |

## 6. Testes de Usabilidade

| Critério | Avaliação |
|-----------|------------|
| **Facilidade de Navegação** | O usuário compreende facilmente o fluxo entre abas (Clientes, Relatórios, Calendário, etc.) |
| **Legibilidade** | As fontes e contrastes estão adequados (fundo branco, texto preto e amarelo conforme paleta do projeto) |
| **Feedback Visual** | Botões e alertas funcionam corretamente, confirmando ações |
| **Tempo de Resposta** | Carregamento médio inferior a 1 segundo nas telas testadas |
| **Acessibilidade** | Textos legíveis, sem sobreposição, boa hierarquia visual |


## 7. Conclusão
Todos os testes realizados para as funcionalidades desenvolvidas foram **executados com sucesso**, sem falhas críticas.  
A integração com o **Firebase** mostrou-se estável e a interface do app apresenta **boa usabilidade** e **navegação intuitiva**.  

O aplicativo encontra-se **aprovado na etapa de testes funcionais e de usabilidade**, cumprindo os requisitos definidos para esta fase do projeto.


> **Links Úteis**:
> - [Teste De Usabilidade: O Que É e Como Fazer Passo a Passo (neilpatel.com)](https://neilpatel.com/br/blog/teste-de-usabilidade/)
> - [Teste de usabilidade: tudo o que você precisa saber! | by Jon Vieira | Aela.io | Medium](https://medium.com/aela/teste-de-usabilidade-o-que-voc%C3%AA-precisa-saber-39a36343d9a6/)
> - [Planejando testes de usabilidade: o que (e o que não) fazer | iMasters](https://imasters.com.br/design-ux/planejando-testes-de-usabilidade-o-que-e-o-que-nao-fazer/)
> - [Ferramentas de Testes de Usabilidade](https://www.usability.gov/how-to-and-tools/resources/templates.html)
