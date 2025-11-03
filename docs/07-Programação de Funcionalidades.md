# Programação de Funcionalidades

## Instruções

A implementação do sistema é descrita abaixo, requisito por requisito. Para cada requisito funcional, são detalhados os artefatos de código-fonte relevantes, as estruturas de dados utilizadas e as instruções para verificação funcional.

---

## RF-004

* **Responsável:** Isaque Caetano Nascimento
* **Descrição:**  O sistema deve possibilitar cadastro e login simples para clientes e administradores.

* **Artefatos de Código-Fonte:**
    * [src\apps\mobile\app\(pages)\login.js](/src/apps/mobile/app/(pages)/login.js): Tela principal para a autenticação no aplicativo mobile. Caso não esteja logado no sistema, ao abrir o aplicativo, esta tela será automaticamente exibida.
    * [src\packages\firebase\auth.js](/src/packages/firebase/auth.js): Para a autenticação foi utilizado o Firebase API, mais especificamente a seção auth.js dele, que permite o login através da função FirebaseAPI.auth.signIn(email, senha);


* **Instruções para Acesso e Verificação:**
    1.  Inicialize o aplicativo.
    2.  A tela de login será automaticamente exibida.
    3.  Preencha os campos email e senha com informações válidas.
    4.  Acesse a opção "Entrar"
    5.  Caso os campos estejam corretos, o usuário será autenticado e redirecionado para a Homepage do aplicativo.

---
## RF-018

* **Responsável:** (João Pedro Ferreira)
* **Descrição:**  (CRUD de administradores)

* **Artefatos de Código-Fonte:**
    * [src\apps\mobile\app\(pages)\AdminManagerScreen.js](psg-ads-n-tiam-2025-2-salaojire/src/apps/mobile/app/(pages)/AdminManagerScreen.js): Uma tela completa de gerenciamento de administradores, com:

Listagem de admins via Firebase

Pesquisa por nome

Adicionar, editar e excluir admins

Uso de modais personalizados
    * [src\apps\mobile\components\AdminModal.js](psg-ads-n-tiam-2025-2-salaojire/src/apps/mobile/components/AdminModal.js): Esse código cria um modal (janela pop-up) que serve para cadastrar ou editar um administrador do sistema.
    * [src\apps\mobile\components\ConfirmDeleteModal.js](psg-ads-n-tiam-2025-2-salaojire/src/apps/mobile/components/ConfirmDeleteModal.js): Um novo modal para excluir um admin. 



* **Instruções para Acesso e Verificação:**
    1.  clicar no botao (+ novo admin)
    2.  clicar no icone com uma caneta para abrir o modal de editar
    3. clicar na lixeira para abrir o modal de excluir 



## RF-009

* **Responsável:** Gabriel Assis Melo Noronha
* **Descrição:**  O sistema deve permitir que o administrador cadastre, edite e exclua itens disponíveis para aluguel.

* **Artefatos de Código-Fonte:**
    * [src\apps\mobile\app\(pages)\AdminManagerScreen.js](/src/apps/mobile/app/(pages)/GerenciarItens.js): Pagina base para o gerenciamento de itens. Responsável por grande parte da lógica da função, buscando e atualizando os itens armanezados, assim como gerenciando os componentes de lista de seção e modals.
    * [src\apps\mobile\components\ItemModalDelete.jsx](/src\apps\mobile\components\ItemModalDelete.jsx): Componente para criação de um modal de exclusão de itens.
    * [src\apps\mobile\components\ItemModalEditCreate.jsx](/src\apps\mobile\components\ItemModalEditCreate.jsx): Componente para criação de um modal de atualização e criação de itens.
    * [src\apps\mobile\components\SectionList.jsx](/src\apps\mobile\components\ItemModalEditCreate.jsx): Componente para criação de uma lista para exposição dos itens armazenados.

* **Instruções para Acesso e Verificação:**
    1.  Inicialize o aplicativo.
    2.  Toque no ícone "Itens".
    3.  Toque no botão "Adicionar novo" para criar um novo item.
    4.  Preencha o formulario de criação de item.
    5.  Caso todos os campos estejam preenchidos, um novo item sera criado.   
    6.  Toque no icone de edição para atualizar as informações de um item.
    7.  Preencha novamente os campos escolhidos para mudança
    8.  Toque no icone de exclusão para excluir um item da lista.
    9.  Se a ação for bem sucedida, uma mensagem de exito será mostrada.


## RF-010

* **Responsável:** Washington Junio Lima 
* **Descrição:** O sistema deve permitir que o administrador gerencie agendamentos de evento.

* **Artefatos de Código-Fonte:**  
    * [src/apps/mobile/app/(tabs)/gerenciarAgendamentos.tsx](/src/apps/mobile/app/(tabs)/gerenciarAgendamentos.tsx): O sistema deve permitir que o administrador cadastre e visualize novos agendamentos, exibindo informações como nome do evento, data de início, data de fim e valor total.

* **Instruções para Acesso e Verificação:**
    1.  Inicialize o aplicativo.
    2.  Navegue até o ícone ou a aba “Agendamentos”.
    3.  Clique em um usuário para acessar seus agendamentos.
    4.  Clique em “Novo Agendamento” para registrar um novo evento.
    5.  Preencha as informações solicitadas e confirme a criação do agendamento.
    6.  Verifique se o novo agendamento aparece na lista do usuário selecionado.
 

## RF-011

**Responsável:** Henrique Sousa (Módulo Clientes)
**Descrição:** O sistema deve permitir que o administrador visualize informações completas dos clientes (nome, e-mail, telefone e pedidos realizados).

**Artefatos de Código-Fonte:**
* [src/apps/mobile/app/(tabs)/clientes.tsx](/src/apps/mobile/app/(tabs)/clientes.tsx):— Tela de Gerenciar/Lista de Clientes (busca, navegação para detalhe). src/apps/mobile/app/(tabs)/clientes.tsx — Tela de Visualizar Cliente com dados completos.
* Integração de dados: [src/packages/firebase/firestore/clientes.js](/src/packages/firebase/firestore/clientes.js) — Configuração Firebase/Firestore utilizada para carregar os dados do cliente e seus pedidos.

**Instruções para Acesso e Verificação:**
1. Inicialize o aplicativo (Expo) e acesse a aba Clientes.
2. Confirme que a lista exibe nome e e-mail dos clientes.
3. Toque em um cliente para abrir Visualizar Cliente.
4. Verifique se aparecem nome, e-mail, telefone e pedidos realizados (com data/status/valor).
5. Resultado esperado: as informações exibidas correspondem aos dados armazenados no Firebase/Firestore.



## RF-012

**Responsável:** Henrique Sousa (Módulo Clientes)
**Descrição:** O sistema deve permitir que o administrador cadastre, visualize, pesquise, edite e exclua dados dos clientes, com validação de campos obrigatórios.

**Artefatos de Código-Fonte:**
* [src/apps/mobile/app/(tabs)/clientes.tsx](/src/apps/mobile/app/(tabs)/clientes.tsx): — Tela principal do módulo:
    * Cadastrar (ação “+ Adicionar novo”/abrir formulário)
    * Editar (ícone de lápis)
    * Excluir (ícone de lixeira + confirmação)
    * Pesquisar (campo de busca)
* Formulário de cadastro/edição com validações.
* Integração de dados: [src/packages/firebase/firestore/clientes.js](/src/packages/firebase/firestore/clientes.js) — Configuração Firebase/Firestore usada nos métodos de CRUD (criar/atualizar/excluir/listar).
  
**Instruções para Acesso e Verificação:**
1. Cadastro
    * Acesse Clientes → clique em  Adicionar novo; preencha Nome, E-mail, Telefone, Senha → Cadastrar.
    * Esperado: cliente aparece na lista após salvar.
2. Visualizar
    * Toque em um cliente da lista.
    * Esperado: abrir Visualizar Cliente com dados completos.
3. Pesquisar
    * Digite parte do nome no campo de busca da lista.
    * Esperado: listagem filtrada com correspondentes.
4. Editar
    * Clique no lápis, altere dados → Salvar.
    * Esperado: listagem reflete os dados atualizados.
5. Excluir
    * Clique na lixeira → Confirmar exclusão.
    * Esperado: cliente removido da lista.


## RF-017

**Responsável:** Felipe de Oliveira Pereira  
**Descrição:** O sistema deve permitir que administradores e clientes recuperem a senha esquecida por meio do envio de um link de redefinição para o e-mail cadastrado.

**Artefatos de Código-Fonte:**
* [/src/apps/mobile/app/(pages)/RedefinirSenha.js](/src/apps/mobile/app/(pages)/RedefinirSenha.js):  
  Tela responsável pelo fluxo de recuperação de senha.  
  - Campo para inserção de e-mail.  
  - Validação de formato de e-mail.  
  - Envio da solicitação de redefinição via Firebase Authentication.  
  - Exibição de mensagens de sucesso ou erro e instruções para o usuário.  

* [/src/packages/firebase/auth.js](/src/packages/firebase/auth.js):  
  Implementa a função `sendPasswordResetEmail(email)` que utiliza o Firebase Authentication para enviar o e-mail de redefinição de senha.  
  - Valida o formato e existência do e-mail.  
  - Retorna mensagens de erro específicas (`user-not-found`, `invalid-email`, `too-many-requests`).  
  - Responsável por todo o backend da operação de recuperação de senha.


**Instruções para Acesso e Verificação**

1. Na tela de login, clicar na opção **“Esqueci minha senha”**.  
2. Informar o e-mail cadastrado (tanto de cliente quanto de administrador).  
3. Pressionar o botão **“Enviar Email”**.  
4. Verificar a mensagem de sucesso exibida na tela.  
5. Confirmar se o e-mail de redefinição foi enviado e recebido (checar caixa de entrada e spam).  
6. Clicar no link enviado e redefinir a senha com uma nova credencial.  
7. Efetuar login com a nova senha para garantir o funcionamento correto.
