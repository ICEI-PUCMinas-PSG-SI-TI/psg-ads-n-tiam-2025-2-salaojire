
# Projeto de Interface

## Visão Geral das Interfaces da Plataforma

Esta seção apresenta as principais interfaces da plataforma, elaboradas com base nas **personas**, **histórias de usuário**, **requisitos funcionais e não funcionais** e **restrições do projeto**.  
O protótipo interativo foi desenvolvido para validar os fluxos do sistema e garantir que as necessidades identificadas nas entrevistas com o cliente fossem traduzidas em soluções práticas e usáveis.

---

### Relação com Personas e Histórias de Usuário

- **Visitante (Ana Cláudia)**:  
  Telas de visualização de fotos, vídeos, catálogo de itens e localização no mapa atendem diretamente às histórias de usuário do perfil de visitante (**RF-001, RF-002, RF-003**).

- **Cliente (Roberto Silva)**:  
  Telas de cadastro/login, solicitação de orçamento, histórico de eventos e formulários de contato correspondem aos requisitos de praticidade e clareza (**RF-004, RF-005, RF-006, RF-008, RF-017**).

- **Administrador (Carlos Mendes)**:  
  Interfaces de gerenciamento de itens, agendamentos, clientes e relatórios foram pensadas para simplificar a rotina de gestão e reduzir a sobrecarga (**RF-009 a RF-014, RF-018**).

---

### Principais Interfaces

#### Login e Recuperação de Senha
- Garantem o acesso seguro de clientes e administradores.  
- Atendem aos **RF-004** e **RF-017**.  

#### Catálogo e Visualização do Espaço
- Exibição de fotos, vídeos e itens disponíveis.  
- Relacionados aos **RF-001, RF-002, RF-003**.  

#### Formulários e Solicitações
- Clientes podem enviar orçamentos ou mensagens simples.  
- Atendem aos **RF-005, RF-006, RF-007**.  

#### Histórico do Cliente
- Registra festas anteriores e itens contratados, reforçando valor de recordação e organização.  
- Ligado ao **RF-008** e **RF-013**.  

#### Gestão do Administrador
- Telas de cadastro/edição de clientes, gerenciamento de agendamentos, catálogo e relatórios.  
- Atendem aos **RF-009, RF-010, RF-011, RF-012, RF-014, RF-015, RF-018**.  

#### Relatórios e Dashboard
- Geração de relatórios financeiros e operacionais.  
- Atendem ao **RF-014** e às necessidades de tomada de decisão do administrador.  

#### Calendário Interativo
- Auxilia no controle de eventos e prazos.  
- Atende ao **RF-010, RF-015 e RF-016**.  

---

### Requisitos Não Funcionais Contemplados

- **Responsividade e usabilidade (RNF-001, RNF-003, RNF-008):** Telas adaptáveis e interface simples para diferentes perfis.  
- **Disponibilidade móvel (RNF-002):** Protótipo já desenhado para uso em dispositivos Android.  
- **Segurança e LGPD (RNF-005, RNF-007):** Telas de login, autenticação e gerenciamento de dados foram pensadas para suportar autenticação segura e privacidade.  
- **Performance e escalabilidade (RNF-004, RNF-006):** Estrutura leve em React/React Native, integrada ao Firebase.  

---

### Restrições Consideradas

- **Tecnologia:** Protótipo já alinhado ao uso exclusivo de React, React Native e Firebase.  
- **Prazo:** Interfaces priorizadas para atender primeiro os requisitos de maior impacto (prioridade ALTA).  
- **Escopo:** Diferenciação entre funcionalidades do site (clientes) e do aplicativo (administradores).  

---

## Diagrama de Fluxo

### Usuário recupera senha
![Fluxograma de um usuário recuperando a senha](./img/Fluxogramas/Fluxograma_UsuarioRecuperaSenha.png)

## Site web

### Visitante explora o site
![Fluxograma do visitante explorando o site](./img//Fluxogramas/_Fluxograma_VisitanteExploraSite.png)

### Visitante realiza o cadastro
![Fluxograma do visitante realizando o cadastro](./img/Fluxogramas/Fluxograma_ClienteCadastro.png)

### Visitante realiza o login
![Fluxograma do visitante realizando o login](./img//Fluxogramas/Fluxograma_ClienteLogin.png)

### Visitante envia solicitação de contato com itens
![Fluxograma do cliente realizando uma solicitação de contato com itens agregados](./img/Fluxogramas/Fluxograma_ClienteEnviaSolicitacaoComItens.png)

### Visitante visualiza seu histórico de agendamentos
![Fluxograma do cliente visualizando seu histórico de agendamentos](./img//Fluxogramas/Fluxograma_ClienteHistoricoAgendamentos.png)

## Aplicativo Mobile

### Admin realiza login
![Fluxograma do admin realizando login](./img/Fluxogramas/Fluxograma_AdminLogin.png)

### Admin emite um relatório
![Fluxograma do admin emitindo um relatório](./img/Fluxogramas/Fluxograma_AdminEmiteRelatorio.png)

### Admin visualiza e converte solicitação para agendamento
![Fluxograma do admin visualizando e convertendo uma solicitação para agendamento](./img/Fluxogramas/Fluxograma_AdminSolicitacoes.png)

### Admin gerência clientes
![Fluxograma do admin gerênciando os clientes](./img/Fluxogramas/Fluxograma_AdminGerenciaClientes.png)

### Admin gerência agendamentos
![Fluxograma do admin gerênciando os agendamentos](./img/Fluxogramas/Fluxograma_AdminGerenciaAgendamentos.png)

### Admin gerência itens
![Fluxograma do admin gerênciando os itens](./img/Fluxogramas/Fluxograma_AdminGerenciaItens.png)

### Propietário gerência administradores
![Fluxograma do propietário gerênciando os admins](./img/Fluxogramas/Fluxograma_AdminGerenciarAdministradores.png)

## Wireframes

### Login
![Login](./img/Wireframes/Login.png)

### Login - Esqueci a Senha
![Login - Esqueci a Senha](./img/Wireframes/Login_Esqueci%20a%20senha.png)

### Login - Código para redifinir senha
![Login - Código para redifinir senha](./img/Wireframes/Login_Esqueci%20a%20senha_Codigo.png)

### Login - Redefinir senha
![Login - Redefinir senha](./img/Wireframes/Login_Redefinir%20senha.png)

### Página Inicial
![Página Inicial](./img/Wireframes/Página%20Inicial.png)

### Pagina inicial - Menu Outros
<img width="360" height="1152" alt="Página Inicial - Outros" src="https://github.com/user-attachments/assets/3a911bca-0f9e-4980-a0fd-0742e792f3eb" />

### Página de Relatorios
![Página de Relatórios](./img/Wireframes/Relatórios.png)

### Calendario
<img width="362" height="1148" alt="Calendário" src="https://github.com/user-attachments/assets/4faf91bf-d23e-417c-89db-6264e77d742e" />

### Gerencia de  Admins
![Página de Gerencia Admins](./img//Wireframes/Gerencia%20de%20Admins.png)

### Gerencia de  Admins - Excluir
![Admins - Excluir](./img//Wireframes/Gerencia%20de%20Admins_Excluir.png)

### Gerencia de  Admins - Cadastrar
![Admins - Cadastrar](./img/Wireframes/Gerencia%20de%20Admins_Cadastrar.png)

### Gerencia de  Admins - Editar
![Admins - Editar](./img/Wireframes/Gerencia%20de%20Admins_Editar.png)

### Visualizar Lista de Agendamentos
![Visualizar Lista de Agendamentos](./img/Wireframes/Agendamentos.png)

### Visualizar Agendamento Específico
![Visualizar agendamento](./img/Wireframes/Visualizar%20Agendamento.png)

### Criar Agendamento
![Criar agendamentos](./img/Wireframes/Visualizar%20Agendamento_Criar.png)

### Criar Agendamento - Adicionar
<img width="357" height="939" alt="Criar agendamento_adicionar" src="https://github.com/user-attachments/assets/aa68c493-8c41-4ee1-b471-504277782c44" />

### Solicitações
<img width="360" height="720" alt="Solicitações" src="https://github.com/user-attachments/assets/fc942be6-aea5-4674-81cc-74fd726b3337" />

### Visualizar Solicitações -
<img width="357" height="1177" alt="Visualizar Solicitação" src="https://github.com/user-attachments/assets/53faa99b-896b-4165-9a75-a9f664e45fe6" />

### Configurações -
<img width="390" height="844" alt="Configurações" src="https://github.com/user-attachments/assets/83372e0a-ac56-4689-a9d0-9cefa8deb59d" />

### Alterar Senha -
<img width="390" height="799" alt="Alterar senha" src="https://github.com/user-attachments/assets/dc821218-e5b5-4b4e-ac61-895dbc904722" />

### Alterar Email -
<img width="390" height="798" alt="Alterar email" src="https://github.com/user-attachments/assets/058ce207-6efd-4eba-af8a-ef81cc7e81f6" />

### Visualizar cliente
![Gerenciar Clientes](./img/Wireframes/GerênciarClientesVisualizar.png)

### Visualizar lista de clientes
![Gerenciar Clientes](./img/Wireframes/GerênciarClientes.png)

### Editar cliente
![Gerenciar Clientes](./img/Wireframes/GerênciarClientesEditar.png)

### Excluir cliente
![Gerenciar Clientes](./img/Wireframes/GerênciarClientesExcluir.png)

### Cadastrar cliente
![Gerenciar Clientes](./img/Wireframes/GerênciarClientesCadastrar.png)

### Gerenciar Itens
![Gerenciar Itens](./img/Wireframes/GerênciarItens.png)

### Excluir Itens 
![Gerenciar Itens](./img/Wireframes/GerênciarItens_Excluir.png)

### Cadastrar Itens
![Gerenciar Itens](./img/Wireframes/GerênciarItens_Cadastrar.png)

### Editar Itens
![Gerenciar Itens](./img/Wireframes/GerênciarItens_Editar.png)












 




