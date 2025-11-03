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
* Integração de dados: [src/packages/firebase/firestore/(clientes.js)](src/packages/firebase/firestore/(clientes.js)): — Configuração Firebase/Firestore utilizada para carregar os dados do cliente e seus pedidos.

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
* Integração de dados: [src/packages/firebase/firestore/(clientes.js)](src/packages/firebase/firestore/(clientes.js)): — Configuração Firebase/Firestore usada nos métodos de CRUD (criar/atualizar/excluir/listar).
  
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
















