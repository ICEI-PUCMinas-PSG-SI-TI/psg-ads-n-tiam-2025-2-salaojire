# Arquitetura da Solução

![Figura da Arquitetura resumida](./img/ArquiteturaResumida.png)

## Diagrama de Classes

![Diagrama de Classes](./img//Diagrama%20de%20Classes%20TI.png)

## Collections NoSQL

# Hierarquia estrutural

- Clientes
  - Agendamentos
    - Midias
    - ItensAlugados
  - Solicitacoes
    - ItensSolicitados
- Administradores
- Itens

# Clientes

![Clientes](./img/DBFirebase/Cliente.png)

![Clientes](./img/DBFirebase/Cliente2.png)

![Clientes](./img/DBFirebase/Cliente3.png)

![Clientes](./img/DBFirebase/Cliente4.png)

![Clientes](./img/DBFirebase/Cliente5.png)

![Clientes](./img/DBFirebase/Cliente6.png)

# Administradores

![Adm](./img/DBFirebase/Adm.png)

# Itens

![Clientes](./img/DBFirebase/Item.png)


## Tecnologias Utilizadas

A solução é composta por um website para clientes e um aplicativo administrativo, ambos integrados a um backend serverless no Firebase.
O desenvolvimento é feito em monorepo GitHub, com VS Code, Git e GitHub Projects (Kanban), apoiado por Figma (design) e Microsoft Teams (comunicação).

| Camada                        | Tecnologia                          | Uso no Projeto                                                                                                                    |
| ----------------------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Web (cliente)**             | React                               | Criação de interfaces modernas e responsivas para catálogo, fotos, vídeos, contato e mapa. Atende RF-001, RF-002, RF-003, RF-006. |
| **Mobile (admin)**            | React Native                        | Aplicativo Android para gestão (clientes, itens, agenda, relatórios). Atende RF-008–RF-013, RNF-002.                              |
| **Auth**                      | Firebase Authentication             | Login simples e seguro. Atende RF-004, RNF-005.                                                                                   |
| **Banco de Dados**            | Cloud Firestore (Firebase)          | Dados de clientes, itens, solicitações, agendamentos e histórico (R05).                                                           |
| **Arquivos de mídia**         | Firebase Storage                    | Upload/serving de fotos e vídeos de eventos (RF-013).                                                                             |
| **Lógica/Integrações**        | Cloud Functions for Firebase        | Notificações, relatórios, regras, validações. Suporta RF-007, RF-012, RF-014.                                                     |
| **Notificações**              | Firebase Cloud Messaging (FCM)      | Push notifications (ex.: lembrete de eventos, RF-016).                                                                            |
| **Mapa**                      | Google Maps SDK / react-native-maps | Exibição da localização do salão (RF-003).                                                                                        |
| **Hospedagem Web / CDN**      | Firebase Hosting                    | Deploy do site com HTTPS e cache.                                                                                                 |
| **Analytics/Logs** (opcional) | Firebase Analytics / Crashlytics    | Telemetria, estabilidade e métricas (RNF-006).                                                                                    |


| Categoria         | Ferramenta               | Uso                                                                                           |
| ----------------- | ------------------------ | --------------------------------------------------------------------------------------------- |
| **IDE**           | Visual Studio Code       | Desenvolvimento web/mobile integrado ao Git.                                                  |
| **Versionamento** | Git + GitHub             | Monorepo com branches `main`, `dev`, `testing`, `feature/*`. PRs revisados, tags para marcos. |
| **Gestão**        | GitHub Projects (Kanban) | Backlog → To Do → In Progress → Done; issues com labels e milestones.                         |
| **Design**        | Figma                    | Wireframes e protótipos colaborativos.                                                        |
| **Comunicação**   | Microsoft Teams          | Reuniões, alinhamentos e compartilhamento.                                                    |
| **Build Mobile**  | (Definir futuramente)    | Geração e distribuição do app Android.                                                        |

Bibliotecas e Utilitários

Web (React): react-hook-form, zod, axios/fetch, tanstack-query, shadcn/ui ou MUI, google-maps-react.

Mobile (React Native): react-navigation, react-native-paper ou nativewind, react-query, react-native-maps, react-native-image-picker, react-native-push-notification.

Firebase: SDK modular (firebase), Firestore, Auth, Storage, Functions, Messaging.

Qualidade: ESLint, Prettier, Husky + lint-staged, Jest/RTL, Detox (mobile).

🔗 Relação com Requisitos e Restrições

RF-001/002/003/006 → Website React + Maps + Storage/Firestore.

RF-004 → Firebase Auth.

RF-005/007 → Firestore + Functions (orçamentos + notificações admin).

RF-008–RF-013 → App RN com Firestore/Storage + relatórios (Functions).

RF-014/016 → FCM (notificações).

RNF-001/003/008 → UI responsiva, intuitiva, boas práticas de UX.

RNF-002 → App Android.

RNF-005/007 → Segurança Firebase (Rules) + LGPD.

R02/R05 → Exclusivamente React/React Native e Firebase.

R04 → Arquitetura monolítica simplificada (frontend + backend Firebase).

### Figura explicando como as tecnologias estão relacionadas

<img width="1269" height="421" alt="Fluxo" src="./img//Arquitetura.png" />
<img width="181" height="711" alt="Fluxo cliente" src="https://github.com/user-attachments/assets/a02f39dc-afca-4c63-9732-1a117ba80fa4" />
<img width="182" height="602" alt="Fluxo adm" src="https://github.com/user-attachments/assets/5110c7ed-e346-4cad-a147-1299c47550f8" />

## Hospedagem

A hospedagem e o lançamento da plataforma foram realizados utilizando a Vercel, uma plataforma moderna especializada na publicação de aplicações web de alta performance, com foco em frameworks de frontend como o React.

O processo de lançamento (deploy) foi configurado usando como controle de versão o Github. Foi enviado um convite para a equipe da PUC permitir que repositório do projeto no Github seja conectado à plataforma Vercel. Este vínculo permitie que o Vercel escute todas as alterações enviadas ao repositório.

Com isso o Deploy é automatizado a cada push para a branch main no repositório github, o Vercel automaticamente inicia o processo de build, deploy e publicação no domínio da aplicação

## Qualidade de Software

Conceituar qualidade de fato é uma tarefa complexa, mas ela pode ser vista como um método gerencial que através de procedimentos disseminados por toda a organização, busca garantir um produto final que satisfaça às expectativas dos stakeholders.

No contexto de desenvolvimento de software, qualidade pode ser entendida como um conjunto de características a serem satisfeitas, de modo que o produto de software atenda às necessidades de seus usuários. Entretanto, tal nível de satisfação nem sempre é alcançado de forma espontânea, devendo ser continuamente construído. Assim, a qualidade do produto depende fortemente do seu respectivo processo de desenvolvimento.

A norma internacional ISO/IEC 25010, que é uma atualização da ISO/IEC 9126, define oito características e 30 subcaracterísticas de qualidade para produtos de software.
Com base nessas características e nas respectivas sub-características, identificamos as seguintes como base para nortear o desenvolvimento do nosso projeto:

### Usabilidade
Sub-características Escolhidas: Aprendizibilidade, Operabilidade e Proteção contra erros de uso.

Justificativa: Esta é talvez a característica mais crítica para o sucesso do projeto. O público-alvo do site inclui pessoas com variados níveis de familiaridade com tecnologia, devendo ser "fácil de mexer, pensando principalmente em pessoas que não têm muita intimidade com tecnologia". Da mesma forma, o administrador do salão, precisa de um aplicativo móvel que seja "prático e direto ao ponto, sem exigir conhecimento técnico". O requisito não funcional RNF-003 reforça a necessidade de uma "interface intuitiva e simples".

Métricas de Avaliação:
* Aprendizibilidade: Tempo (em minutos) que um novo usuário leva para completar uma tarefa chave pela primeira vez (ex: enviar uma solicitação de orçamento).
* Operabilidade: Número de cliques necessários para executar as principais funcionalidades do sistema (ex: cadastrar um novo item).
* Proteção contra erros: Implementação de diálogos de confirmação para ações destrutivas (ex: excluir um item ou cliente).

### Segurança
Sub-características Escolhidas: Confidencialidade, Integridade e Autenticidade.

Justificativa: O sistema irá armazenar e gerenciar dados pessoais de clientes, como nome, e-mail e telefone, além do histórico de seus eventos. É fundamental proteger essas informações, como exigido pelo requisito RNF-007 de acordo com a LGPD. Além disso, o RNF-005 especifica que o armazenamento no Firebase deve ter autenticação segura.

Métricas de Avaliação:
* Confidencialidade: Verificar se todas as transações de dados entre o cliente (site/app) e o servidor (Firebase) são feitas sobre HTTPS.
* Integridade: Garantir que as regras de segurança do Firebase impeçam a alteração de dados por usuários não autorizados.
* Autenticidade: 100% das funcionalidades administrativas devem ser protegidas por um sistema de login.

### Adequação Funcional
Sub-características Escolhidas: Completude Funcional e Corretude Funcional.

Justificativa: O objetivo central do projeto é resolver os problemas de gestão manual e falta de presença online do salão Jiré Festas. Para isso, o software deve executar corretamente todas as funções definidas. O sistema precisa permitir que os visitantes vejam o catálogo e que o administrador gerencie agendamentos e clientes de forma eficaz para substituir o processo manual e sujeito a erros.

Métricas de Avaliação:
* Completude Funcional: Percentual de requisitos funcionais (da lista de RF-001 a RF-016) que foram implementados e testados com sucesso.
* Corretude Funcional: Número de bugs identificados por funcionalidade durante a fase de testes. A meta é ter zero bugs críticos ou de alta prioridade no momento da entrega.

### Desempenho
Sub-características Escolhidas: Comportamento em relação ao tempo.

Justificativa: Um site ou aplicativo lento pode frustrar os usuários e prejudicar a imagem profissional do salão. O requisito RNF-004 estabelece explicitamente que "O sistema deve processar requisições em até 3 segundos em condições normais de uso".

Métricas de Avaliação:
* Tempo: Medir o tempo de carregamento das principais páginas do site e o tempo de resposta das principais operações do aplicativo (ex: carregar a lista de clientes). A meta é que todas essas operações sejam concluídas em menos de 3 segundos.