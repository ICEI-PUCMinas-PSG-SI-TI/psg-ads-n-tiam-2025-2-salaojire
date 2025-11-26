# Plano de Testes de Software

## Upload de Fotos e Videos 
* **Descrição do Requisito**: (RF-013) - O sistema deve possibilitar o upload de fotos e vídeos para registro de festas no histórico do cliente.
* **Objetivo**: Permitir enviar mídeas do evento acotecido, para mostrar o espaço e diferentes temas de festas em nosso ambiente.  
* **Registro de Testes**: [Registro de Testes - Autenticação Mobile](../../Registros%20de%20Teste/RF-013/README.md)

---

### Caso de Teste 1 — Clicando para adiconar fotos ou videos

| Item | Descrição |
|------|------------|
| **Ação** | Acessar a aba **Clientes** no menu inferior do aplicativo. |
| **Resultado Esperado** | Redireciona para galeria do celular com um modal de permissão |

---

### Caso de Teste 2 — Adicionando mídea 

| Item | Descrição |
|------|------------|
| **Ação** | Selecionar uma foto ou video na galeria  |
| **Resultado Esperado** | Exibir a galeria e selecionar, apos isso confirmar o envio das mídeas selecionadas |

---

### Caso de Teste 3 — Confirmação de envio 

| Item | Descrição |
|------|------------|
| **Ação** | apos a seleção dos arquivos, confirmar envio  |
| **Resultado Esperado** | tela de interação, "enviando arquivo" e um Modal com mensagem de confirmaçao  |

---

### Caso de Teste 4 —  Visualização de mídea   

| Item | Descrição |
|------|------------|
| **Ação** | Selecionar uma foto ou video na grade de exibição  |
| **Resultado Esperado** | Exibir a foto em um novo modal, com formato de carrossel |

---

### Caso de Teste 5 — Excluindo mídea 

| Item | Descrição |
|------|------------|
| **Ação** | Selecionar o ícone de lixeira logo acima do modal  |
| **Resultado Esperado** | aparecer um modal de confirmação e prosseguindo a conclusão da ação |
