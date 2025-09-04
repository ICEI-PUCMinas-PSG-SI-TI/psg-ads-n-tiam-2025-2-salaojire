# Especificações do Projeto

<span style="color:red">Pré-requisitos: <a href="1-Documentação de Contexto.md"> Documentação de Contexto</a></span>

Definição do problema e ideia de solução a partir da perspectiva do usuário. É composta pela definição do  diagrama de personas, histórias de usuários, requisitos funcionais e não funcionais além das restrições do projeto.

Apresente uma visão geral do que será abordado nesta parte do documento, enumerando as técnicas e/ou ferramentas utilizadas para realizar a especificações do projeto

## Personas

Persona 1 – Visitante do Site

Ana Cláudia tem 29 anos, é Promotora de vendas e trabalha em horário comercial. No pouco tempo livre que tem, costuma pesquisar pelo celular opções de salões de festas para organizar eventos da família. Ela valoriza sites que tragam fotos e vídeos reais, pois gosta de visualizar como seria o espaço decorado para o seu evento. Também prefere encontrar tudo de forma prática, como catálogo de itens para aluguel e localização no mapa. Muitas vezes chega ao site do salão a partir de uma busca no Google, já que não tem paciência para navegar em redes sociais ou aplicativos complicados.

Persona 2 – Cliente

Roberto Silva tem 35 anos, é motorista de aplicativo e pai de uma menina de 7 anos. Está planejando uma festa de aniversário para a filha e precisa de um processo simples, já que sua rotina é corrida e seu tempo, limitado. Ele busca praticidade para solicitar orçamentos, agendar a festa, acompanhar a data e horário e também status do pagamento em caso de esquecimento. Roberto valoriza poder salvar seus dados no sistema para não ter que preencher tudo novamente em cada contato, para ele, o mais importante é ter clareza e rapidez em cada etapa da contratação, garantindo que tudo esteja organizado sem precisar perder tempo com burocracias.

Persona 3 – Administrador/Gerente do Salão

Carlos Mendes tem 40 anos, é proprietário do salão de festas e responsável por toda a gestão do negócio. Apesar de não ser especialista em tecnologia, usa aplicativos em seu dia a dia e procura soluções simples e objetivas. Carlos precisa de uma ferramenta que facilite o controle de agendamentos, cadastros de clientes, atualização do catálogo e acompanhamento financeiro. Ele se sente sobrecarregado quando precisa organizar tudo manualmente em planilhas e anotações. Por isso, deseja um sistema que centralize todas as informações, permita gerar relatórios rápidos e ajude a manter o salão funcionando de forma organizada e profissional.

## Histórias de Usuários

|EU COMO... `PERSONA`| QUERO/PRECISO ... `FUNCIONALIDADE` |PARA ... `MOTIVO/VALOR`                 |
|--------------------|------------------------------------|----------------------------------------|
| Visitante do site | Visualizar fotos e vídeos que expõem o salão | Conhecer o espaço e ter uma ideia de como meu evento poderia ser |
| Visitante do site | Ver um catálogo com os itens disponíveis para aluguel | Saber tudo que o salão oferece para a minha festa |
| Visitante do site | Ver a localização do salão em um mapa | Saber como chegar ao local facilmente |
| Cliente | Realizar um cadastro e login rápidos | Salvar minhas informações para solicitar um agendamento e ver meu histórico |
| Cliente | Enviar um formulário de contato | Entrar em contato com o salão fácilmente |
| Cliente | Selecionar itens de interesse e agregá-los ao formulário de contato | Solicitar um orçamento ou agendamento de forma rápida |
| Cliente | Acessar um histórico dos meus alugueis passados | Relembrar os detalhes, itens contratados e ver as recordações das festas |
| Administrador | Gerenciar os itens disponíveis para aluguel pelo aplicativo | Manter o catálogo do site sempre atualizado |
| Administrador | Receber as solicitações de contato/agendamento feitas pelo site | Organizar e responder aos potenciais clientes de forma eficiente |
| Administrador | Cadastrar e consultar as informações dos meus clientes | Ter um controle de quem são meus clientes e seus contatos |
| Administrador | Gerenciar os agendamentos das festas (confirmar, alterar status, etc.) | Manter a agenda do salão organizada e sob controle |
| Administrador | Registrar informações das festas, como status de pagamento | Fazer a gestão financeira de cada evento |
| Administrador | Gerar relatórios simples (ex: festas do mês, valores pendentes) | Ter uma visão geral da saúde financeira e operacional do negócio |

## Requisitos

As tabelas que se seguem apresentam os requisitos funcionais e não funcionais que detalham o escopo do projeto. Para determinar a prioridade de requisitos, aplicar uma técnica de priorização de requisitos e detalhar como a técnica foi aplicada.

### Requisitos Funcionais

| ID     | Requisito Funcional                                                                                              | Prioridade |
| ------ | ---------------------------------------------------------------------------------------------------------------- | ---------- |
| RF-001 | O sistema deve permitir que o visitante visualize fotos e vídeos do salão e de eventos anteriores.               | ALTA       |
| RF-002 | O sistema deve exibir o catálogo de itens disponíveis para aluguel.                                              | ALTA       |
| RF-003 | O sistema deve permitir que o visitante visualize a localização do salão em um mapa integrado.                   | MÉDIA      |
| RF-004 | O sistema deve possibilitar cadastro e login simples para clientes.                                              | ALTA       |
| RF-005 | O sistema deve permitir que clientes selecionem itens para aluguel e solicitem o orçamento deles.                | ALTA       |
| RF-006 | O sistema deve permitir que o cliente envie um formulário de contato simples, sem a necessidade de selecionar itens.  | ALTA       |
| RF-007 | O sistema deve notificar o administrador sobre novas solicitações de contato e de orçamento recebido    | ALTA       |
| RF-008 | O sistema deve permitir que clientes visualizem o histórico de pedidos e festas anteriores.                      | MÉDIA      |
| RF-009 | O sistema deve permitir que o administrador cadastre, edite e exclua itens disponíveis para aluguel.             | ALTA       |
| RF-010 | O sistema deve permitir que o administrador gerencie agendamentos de festas (criar, alterar status ou cancelar). | ALTA       |
| RF-011 | O sistema deve permitir que o administrador visualize informações completas dos clientes.                        | ALTA       |
| RF-012 | O sistema deve permitir que o administrador atualize ou cadastre dados dos clientes.                             | ALTA       |
| RF-013 | O sistema deve possibilitar o upload de fotos e vídeos para registro de festas no histórico do cliente.          | MÉDIA      |
| RF-014 | O sistema deve permitir a emissão de um relatório com o resumo mensal de eventos, contendo o número total de festas, o valor total faturado e o valor total pendente  | MÉDIA |
| RF-015 | O sistema deve permitir a visualização de todos os eventos agendados em um determinado período      | MÉDIA      |
| RF-016 | O sistema deve enviar uma notificação para o cliente para informar que o evento está chegando       | BAIXA      |





### Requisitos não Funcionais

| ID      | Requisito Não Funcional                                                                                             | Prioridade |
| ------- | ------------------------------------------------------------------------------------------------------------------- | ---------- |
| RNF-001 | O sistema deve ser responsivo, adaptando-se a desktops, tablets e smartphones.                                      | ALTA       |
| RNF-002 | O sistema deve disponibilizar o aplicativo móvel para Android.                                                      | ALTA       |
| RNF-003 | O sistema deve possuir interface intuitiva e simples, considerando usuários com pouca familiaridade com tecnologia. | ALTA       |
| RNF-004 | O sistema deve processar requisições em até 3 segundos em condições normais de uso.                                 | BAIXA      |
| RNF-005 | O sistema deve armazenar dados no Firebase com autenticação segura.                                                 | ALTA       |
| RNF-006 | O sistema deve suportar múltiplos acessos simultâneos sem comprometer o desempenho.                                 | MÉDIA      |
| RNF-007 | O sistema deve proteger as informações dos clientes de acordo com a LGPD.                                           | ALTA       |
| RNF-008 | O sistema deve seguir padrões modernos de design (UI/UX) para atrair e reter usuários.                              | MÉDIA      |

Com base nas Histórias de Usuário, enumere os requisitos da sua solução. Classifique esses requisitos em dois grupos:

- [Requisitos Funcionais
 (RF)](https://pt.wikipedia.org/wiki/Requisito_funcional):
 correspondem a uma funcionalidade que deve estar presente na
  plataforma (ex: cadastro de usuário).
- [Requisitos Não Funcionais
  (RNF)](https://pt.wikipedia.org/wiki/Requisito_n%C3%A3o_funcional):
  correspondem a uma característica técnica, seja de usabilidade,
  desempenho, confiabilidade, segurança ou outro (ex: suporte a
  dispositivos iOS e Android).
Lembre-se que cada requisito deve corresponder à uma e somente uma
característica alvo da sua solução. Além disso, certifique-se de que
todos os aspectos capturados nas Histórias de Usuário foram cobertos.

## Restrições

O projeto está restrito pelos itens apresentados na tabela a seguir.

|ID| Restrição                                             |
|--|-------------------------------------------------------|
|01| O projeto deverá ser entregue até o final do semestre |
|02| O desenvolvimento será feito exclusivamente com React e React Native.        |
|03| O site será destinado aos clientes e o aplicativo móvel apenas para administradores/gerência.      |
|04| A arquitetura será monolítica e simplificada  |


Enumere as restrições à sua solução. Lembre-se de que as restrições geralmente limitam a solução candidata.

> **Links Úteis**:
> - [O que são Requisitos Funcionais e Requisitos Não Funcionais?](https://codificar.com.br/requisitos-funcionais-nao-funcionais/)
> - [O que são requisitos funcionais e requisitos não funcionais?](https://analisederequisitos.com.br/requisitos-funcionais-e-requisitos-nao-funcionais-o-que-sao/)

## Diagrama de Casos de Uso

O diagrama de casos de uso é o próximo passo após a elicitação de requisitos, que utiliza um modelo gráfico e uma tabela com as descrições sucintas dos casos de uso e dos atores. Ele contempla a fronteira do sistema e o detalhamento dos requisitos funcionais com a indicação dos atores, casos de uso e seus relacionamentos. 

As referências abaixo irão auxiliá-lo na geração do artefato “Diagrama de Casos de Uso”.

> **Links Úteis**:
> - [Criando Casos de Uso](https://www.ibm.com/docs/pt-br/elm/6.0?topic=requirements-creating-use-cases)
> - [Como Criar Diagrama de Caso de Uso: Tutorial Passo a Passo](https://gitmind.com/pt/fazer-diagrama-de-caso-uso.html/)
> - [Lucidchart](https://www.lucidchart.com/)
> - [Astah](https://astah.net/)
> - [Diagrams](https://app.diagrams.net/)

# Matriz de Rastreabilidade

A matriz de rastreabilidade é uma ferramenta usada para facilitar a visualização dos relacionamento entre requisitos e outros artefatos ou objetos, permitindo a rastreabilidade entre os requisitos e os objetivos de negócio. 

A matriz deve contemplar todos os elementos relevantes que fazem parte do sistema, conforme a figura meramente ilustrativa apresentada a seguir.

![Exemplo de matriz de rastreabilidade](img/02-matriz-rastreabilidade.png)

> **Links Úteis**:
> - [Artigo Engenharia de Software 13 - Rastreabilidade](https://www.devmedia.com.br/artigo-engenharia-de-software-13-rastreabilidade/12822/)
> - [Verificação da rastreabilidade de requisitos usando a integração do IBM Rational RequisitePro e do IBM ClearQuest Test Manager](https://developer.ibm.com/br/tutorials/requirementstraceabilityverificationusingrrpandcctm/)
> - [IBM Engineering Lifecycle Optimization – Publishing](https://www.ibm.com/br-pt/products/engineering-lifecycle-optimization/publishing/)


# Gerenciamento de Projeto

De acordo com o PMBoK v6 as dez áreas que constituem os pilares para gerenciar projetos, e que caracterizam a multidisciplinaridade envolvida, são: Integração, Escopo, Cronograma (Tempo), Custos, Qualidade, Recursos, Comunicações, Riscos, Aquisições, Partes Interessadas. Para desenvolver projetos um profissional deve se preocupar em gerenciar todas essas dez áreas. Elas se complementam e se relacionam, de tal forma que não se deve apenas examinar uma área de forma estanque. É preciso considerar, por exemplo, que as áreas de Escopo, Cronograma e Custos estão muito relacionadas. Assim, se eu amplio o escopo de um projeto eu posso afetar seu cronograma e seus custos.

## Gerenciamento de Tempo

Com diagramas bem organizados que permitem gerenciar o tempo nos projetos, o gerente de projetos agenda e coordena tarefas dentro de um projeto para estimar o tempo necessário de conclusão.

![Diagrama de rede simplificado notação francesa (método francês)](img/02-diagrama-rede-simplificado.png)

O gráfico de Gantt ou diagrama de Gantt também é uma ferramenta visual utilizada para controlar e gerenciar o cronograma de atividades de um projeto. Com ele, é possível listar tudo que precisa ser feito para colocar o projeto em prática, dividir em atividades e estimar o tempo necessário para executá-las.

![Gráfico de Gantt](img/02-grafico-gantt.png)

## Gerenciamento de Equipe

O gerenciamento adequado de tarefas contribuirá para que o projeto alcance altos níveis de produtividade. Por isso, é fundamental que ocorra a gestão de tarefas e de pessoas, de modo que os times envolvidos no projeto possam ser facilmente gerenciados. 

![Simple Project Timeline](img/02-project-timeline.png)

## Gestão de Orçamento

O processo de determinar o orçamento do projeto é uma tarefa que depende, além dos produtos (saídas) dos processos anteriores do gerenciamento de custos, também de produtos oferecidos por outros processos de gerenciamento, como o escopo e o tempo.

![Orçamento](img/02-orcamento.png)
