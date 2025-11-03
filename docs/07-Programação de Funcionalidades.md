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