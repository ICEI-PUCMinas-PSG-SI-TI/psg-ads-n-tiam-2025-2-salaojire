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