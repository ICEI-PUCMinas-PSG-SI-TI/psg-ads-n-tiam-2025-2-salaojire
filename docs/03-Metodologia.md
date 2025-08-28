
# Metodologia

<span style="color:red">Pré-requisitos: <a href="2-Especificação do Projeto.md"> Documentação de Especificação</a></span>

A metodologia adotada pelo grupo combina práticas de desenvolvimento ágil com o framework Scrum, adaptadas ao contexto acadêmico. O objetivo é garantir organização, colaboração e transparência em todas as etapas do projeto.

O trabalho será desenvolvido em equipe utilizando ferramentas de colaboração, versionamento e gestão de tarefas, sempre integrando os diferentes ambientes (web, mobile e banco de dados).

## Relação de Ambientes de Trabalho

| **Ambiente**                 | **Plataforma / Framework**   | **Propósito**                                                              | **Link de Acesso**                                                |
| ---------------------------- | ---------------------------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| **Repositório de Código**    | GitHub + Git                 | Armazenar e versionar o código-fonte do projeto, facilitando colaboração.  | [GitHub Repo](https://github.com/ICEI-PUCMinas-PSG-SI-TI/psg-ads-n-tiam-2025-2-salaojire.git) |
| **Editor de Código**         | Visual Studio Code (VS Code) | Edição e desenvolvimento do código web e mobile, com integração ao Git.    | [VS Code](https://code.visualstudio.com/)                         |
| **Desenvolvimento Web**      | React / Next.js              | Implementar o website para clientes (catálogo, informações e contato).     | —                                                                 |
| **Desenvolvimento Mobile**   | React Native (Expo)          | Construir o aplicativo administrativo para gestão de clientes e eventos.   | —                                                                 |
| **Banco de Dados**           | Firebase                     | Armazenamento em nuvem de clientes, itens, agendamentos e eventos.         | [Firebase](https://firebase.google.com/)                          |
| **Wireframing/Prototipação** | Figma                        | Criação de protótipos de telas e interfaces, colaborativo e em tempo real. | [Figma](https://www.figma.com/)                                   |
| **Gestão de Projetos**       | GitHub Projects (Kanban)     | Organização de backlog, tarefas da sprint, andamento e entregas.           | [GitHub Projects](https://github.com/features/project-management) |
| **Comunicação**              | Microsoft Teams              | Reuniões online, mensagens rápidas e compartilhamento de arquivos.         | [Teams](https://www.microsoft.com/pt-br/microsoft-teams/)         |


## Controle de Versão

A ferramenta de controle de versão adotada no projeto foi o
[Git](https://git-scm.com/), sendo que o [Github](https://github.com)
foi utilizado para hospedagem do repositório.

O projeto segue a seguinte convenção para o nome de branches:

- `main`: versão estável já testada do software
- `unstable`: versão já testada do software, porém instável
- `testing`: versão em testes do software
- `dev`: versão de desenvolvimento do software

Quanto à gerência de issues, o projeto adota a seguinte convenção para
etiquetas:

- `documentation`: melhorias ou acréscimos à documentação
- `bug`: uma funcionalidade encontra-se com problemas
- `enhancement`: uma funcionalidade precisa ser melhorada
- `feature`: uma nova funcionalidade precisa ser introduzida

Discuta como a configuração do projeto foi feita na ferramenta de versionamento escolhida. Exponha como a gerência de tags, merges, commits e branchs é realizada. Discuta como a gerência de issues foi realizada.

> **Links Úteis**:
> - [Microfundamento: Gerência de Configuração](https://pucminas.instructure.com/courses/87878/)
> - [Tutorial GitHub](https://guides.github.com/activities/hello-world/)
> - [Git e Github](https://www.youtube.com/playlist?list=PLHz_AreHm4dm7ZULPAmadvNhH6vk9oNZA)
>  - [Comparando fluxos de trabalho](https://www.atlassian.com/br/git/tutorials/comparing-workflows)
> - [Understanding the GitHub flow](https://guides.github.com/introduction/flow/)
> - [The gitflow workflow - in less than 5 mins](https://www.youtube.com/watch?v=1SXpE08hvGs)

## Gerenciamento de Projeto

### Divisão de Papéis

Apresente a divisão de papéis entre os membros do grupo.

Exemplificação: A equipe utiliza metodologias ágeis, tendo escolhido o Scrum como base para definição do processo de desenvolvimento. A equipe está organizada da seguinte maneira:
- Scrum Master: Felipe Domingos;
- Product Owner: Rommel Carneiro;
- Equipe de Desenvolvimento: Pedro Penna, Pedro Ivo, Rodrigo Richard;
- Equipe de Design: Simone Nogueira.

> **Links Úteis**:
> - [11 Passos Essenciais para Implantar Scrum no seu Projeto](https://mindmaster.com.br/scrum-11-passos/)
> - [Scrum em 9 minutos](https://www.youtube.com/watch?v=XfvQWnRgxG0)
> - [Os papéis do Scrum e a verdade sobre cargos nessa técnica](https://www.atlassian.com/br/agile/scrum/roles)

### Processo

O grupo adotará o framework Scrum para a gestão do desenvolvimento do projeto, com adaptações para o contexto acadêmico. O objetivo é garantir maior organização, transparência e acompanhamento contínuo do progresso.

Papéis no Scrum:

Product Owner (PO): Responsável por priorizar o backlog, garantir que as entregas estejam alinhadas com os objetivos do projeto e manter o contato com o cliente para entender as necessidades e expectativas.

Scrum Master: Facilita o processo, garante que os rituais aconteçam e remove impedimentos.

Time de Desenvolvimento: Responsável por implementar as funcionalidades, realizar testes e documentar o código.

Rituais definidos:

Sprint Planning: Definição das tarefas que farão parte da sprint.

Daily Meeting (curta, remota pelo Teams): Compartilhamento do progresso e dificuldades.

Sprint Review: Apresentação das entregas feitas.

Sprint Retrospective: Discussão sobre o que funcionou bem e o que pode melhorar.

Ferramenta de gerenciamento – GitHub Projects:
O grupo utilizará os quadros de projeto do GitHub (Kanban) para gerenciar o backlog, as tarefas em andamento e as concluídas.

O Product Backlog será representado pela coluna "To Do", onde ficam listadas todas as histórias e funcionalidades desejadas.

As tarefas em desenvolvimento ficam na coluna "In Progress".

As entregues são movidas para "Done", facilitando a visualização do status do projeto.

Cada tarefa estará vinculada a uma issue no GitHub, permitindo rastreabilidade e histórico.

Ferramentas de apoio:

Microsoft Teams: será usado para reuniões, e acompanhamento das decisões de grupo.

GitHub Projects: centraliza o gerenciamento das tarefas e andamento do desenvolvimento.

Visual Studio Code + Git: editor principal de código, integrado ao versionamento.

### Ferramentas

#### As ferramentas selecionadas para o desenvolvimento do projeto foram definidas considerando praticidade, integração, suporte à equipe e alinhamento com os objetivos da aplicação.

#### Editor de Código – Visual Studio Code (VS Code):
O Visual Studio Code foi escolhido por ser um editor moderno, leve e amplamente utilizado no desenvolvimento web e mobile. Ele possui integração nativa com sistemas de versionamento (como Git/GitHub), oferece uma grande variedade de extensões úteis (lint, debug, snippets) e facilita a colaboração entre os membros da equipe.

#### Ferramentas de Comunicação – Microsoft Teams:
O Microsoft Teams foi adotado como principal canal de comunicação, por possibilitar reuniões online, mensagens instantâneas e compartilhamento de arquivos em um único ambiente. Além disso, sua integração com ferramentas do pacote Microsoft 365 facilita a organização das tarefas e o acompanhamento do andamento do projeto.

#### Ferramenta de Desenvolvimento Mobile – React Native:
O React Native foi escolhido para o desenvolvimento do aplicativo administrativo por permitir a criação de aplicações móveis multiplataforma (Android e iOS) com um único código base.

#### Ferramenta de Desenvolvimento Web – React:
Para a construção do site destinado aos clientes, será utilizado o React. A escolha se deve à sua capacidade de criar interfaces modernas, responsivas e de fácil manutenção, além de ser uma das bibliotecas JavaScript mais utilizadas no mercado, com vasta documentação e comunidade ativa.

#### Banco de Dados – Firebase:
O Firebase será utilizado como banco de dados pela sua facilidade de integração com aplicações web e mobile, oferecendo uma solução em nuvem escalável e segura. Além de armazenar informações de clientes, itens e eventos, o Firebase fornece recursos adicionais como autenticação de usuários, hospedagem e notificações em tempo real, que podem ser explorados futuramente.

#### Ferramenta de Wireframing e Prototipação – Figma
O Figma foi escolhido para o desenho de telas (wireframes e protótipos) por permitir a criação colaborativa em tempo real, possibilitando que toda a equipe visualize, comente e sugira alterações durante o processo de design. Isso ajuda a alinhar as expectativas e garante que a solução final esteja de acordo com as necessidades levantadas.
