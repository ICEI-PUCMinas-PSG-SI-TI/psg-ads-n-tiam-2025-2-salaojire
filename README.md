# Salão Jiré

`CURSO`: ANÁLISE E DESENVOLVIMENTO DE SISTEMAS

`DISCIPLINA`: Trabalho Interdisciplinar: Aplicação Móvel

`SEMESTRE`: 2/2025

Este projeto tem como objetivo criar uma solução digital para um salão de festas, chamado Jiré Festas e Eventos, construindo um site que possibilita a visualização daquilo que é oferecido pelo salão e também a realização de agendamentos e atendimentos com os clientes interessados.

Além disso, busca-se construir um aplicativo móvel que permite a gestão do salão, para que a administração fique mais organizada, possibilitando através do aplicativo o gerenciamento de agendamentos, aluguéis e clientes, além da geração de relatórios que promovem uma visão geral do negócio.

## Integrantes

* Isaque Caetano Nascimento
* Felipe de Oliveira Pereira
* João Pedro Ferreira Bonifácio
* Washington Junio Lima Pereira
* Henrique Gonçalves Sousa
* Gabriel Assis Melo Noronha

## Orientador

* Pedro Felipe Alves de Oliveira

## Instruções de utilização

### Hospedagem Vercel

O projeto é divido em web e mobile. 
O website está hospedado no Vercel e está disponível através da seguinte URL:
https://salao-jire.vercel.app/

### APK do aplicativo móvel

O APK está disponível:
src\Aplicacao_Mobile.apk

### Instalação e Execução do Projeto
Após a realização do clone do projeto:

1. Instale a CLI do Expo globalmente:
``` bash
  npm install -g expo-cli
```
2. Crie e navegue até uma pasta para o repositório e faça a clonagem:

``` bash
git clone https://github.com/ICEI-PUCMinas-PSG-SI-TI/psg-ads-n-tiam-2025-2-salaojire.git .
```

3. Caminhe até a pasta src e instale as depêndencias:
``` bash
cd src
npm install
```

### Execução da Aplicação

#### Para Executar o Aplicativo Mobile:
#### 1. Caminhe até a pasta mobile:
``` bash
cd apps/mobile
```

#### 2. Crie um arquivo com nome ".env" e preencha dentro dele as informações da conexão ao Firebase desta forma:
```
EXPO_PUBLIC_API_KEY=COLOQUE_API_KEY_AQUI
EXPO_PUBLIC_AUTH_DOMAIN=COLOQUE_AUTH_DOMAIN_AQUI
EXPO_PUBLIC_PROJECT_ID=COLOQUE_PROJECT_ID_AQUI
EXPO_PUBLIC_STORAGE_BUCKET=COLOQUE_STORAGE_BUCKET_AQUI
EXPO_PUBLIC_MESSAGING_SENDER_ID=COLOQUE_MESSAGING_SENDER_AQUI
EXPO_PUBLIC_APP_ID=COLOQUE_APP_ID_AQUI
```
Para este preenchimento será necessário ir até o Firebase Console, caso não tenha, crie um App, vá até o ícone de engrenagem -> Configurações do Projeto e em baixo terá estas informações.

Além disto no Firebase Console, vá até Authentication e habilite a autenticação por email e senha, para que a autenticação funcione corretamente.

#### 3. Inicie a aplicação
``` powershell
npm run start
```

#### 4. Escaneie o QR Code que irá aparecer no terminal com o aplicativo "Expo Go" em um dispositivo físico para rodar o app diretamente no seu celular.

No terminal irá aparecer diversas instruções, inclusive o acesso pela web caso deseje.

# Documentação

<ol>
<li><a href="docs/01-Documentação de Contexto.md"> Documentação de Contexto</a></li>
<li><a href="docs/02-Especificação do Projeto.md"> Especificação do Projeto</a></li>
<li><a href="docs/03-Metodologia.md"> Metodologia</a></li>
<li><a href="docs/04-Projeto de Interface.md"> Projeto de Interface</a></li>
<li><a href="docs/05-Arquitetura da Solução.md"> Arquitetura da Solução</a></li>
<li><a href="docs/06-Template Padrão da Aplicação.md"> Template Padrão da Aplicação</a></li>
<li><a href="docs/07-Programação de Funcionalidades.md"> Programação de Funcionalidades</a></li>
<li><a href="docs/08-Plano de Testes de Software.md"> Plano de Testes de Software</a></li>
<li><a href="docs/09-Registro de Testes de Software.md"> Registro de Testes de Software</a></li>
<li><a href="docs/10-Plano de Testes de Usabilidade.md"> Plano de Testes de Usabilidade</a></li>
<li><a href="docs/11-Registro de Testes de Usabilidade.md"> Registro de Testes de Usabilidade</a></li>
<li><a href="docs/12-Apresentação do Projeto.md"> Apresentação do Projeto</a></li>
<li><a href="docs/13-Referências.md"> Referências</a></li>
</ol>

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>
