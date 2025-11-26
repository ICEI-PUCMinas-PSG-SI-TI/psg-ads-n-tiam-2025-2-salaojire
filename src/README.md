# Instruções de utilização

## Instalação do Site

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

## Execução da Aplicação

### Para Executar o Aplicativo Mobile:
### 1. Caminhe até a pasta mobile:
``` bash
cd apps/mobile
```

### 2. Crie um arquivo com nome ".env" e preencha dentro dele as informações da conexão ao Firebase desta forma:
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

### 3. Inicie a aplicação
``` powershell
npm run start
```

### 4. Escaneie o QR Code que irá aparecer no terminal com o aplicativo "Expo Go" em um dispositivo físico para rodar o app diretamente no seu celular.

No terminal irá aparecer diversas instruções, inclusive o acesso pela web caso deseje.