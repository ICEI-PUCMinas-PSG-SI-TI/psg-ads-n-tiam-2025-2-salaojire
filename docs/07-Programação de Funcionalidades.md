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


## RF-X

* **Responsável:** (Preencher o usuário)
* **Descrição:**  (Preencher descrição)

* **Artefatos de Código-Fonte:**
    * [src\apps\mobile\app\(pages)\login.js](/src/apps/mobile/app/(pages)/login.js): Altere o caminho e a descrição do artefato código fonte
    * [src\packages\firebase\auth.js](/src/packages/firebase/auth.js): Adicione mais artefatos caso seja necessário


* **Instruções para Acesso e Verificação:**
    1.  Diga as instruções para verificar a funcionalidade.
    2.  Adicione quantas instruções quanto necessário