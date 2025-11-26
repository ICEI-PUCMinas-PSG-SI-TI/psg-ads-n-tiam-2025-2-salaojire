# Plano de Testes de Software

## 1. Objetivo
Verificar se as funcionalidades implementadas no aplicativo **Salão Jire (Mobile)** estão operando conforme os requisitos funcionais definidos


## 2. Escopo dos Testes
Os testes abrangem as funcionalidades de **autenticação** (login e cadastro de cliente), **CRUD de clientes e itens**, **visualização de pedidos e solicitações**, e **integração com Firebase Firestore e Storage**.  
Foram realizados em ambiente de testes com o **Firebase público** configurado via arquivo .env.


## 3. Ambiente de Testes

| Elemento | Descrição |
|-----------|------------|
| **Dispositivo** | Smartphone Android (versão 13) |
| **Framework** | Expo 54.0.20 (Expo Go) |
| **Linguagem** | TypeScript + React Native |
| **Backend** | Firebase (Firestore / Auth / Storage) |
| **Versão Testada** | 1.0.0 |

## 4. Acesso aos Planos de Teste
Acesse o código RF para ir até o plano de teste específico.
| Código RF | Requisito Funcional | Responsável |
|------------|--------------------|--------------|
| **[RF-004](/docs/testes/Planos%20de%20teste/Autenticacao%20Mobile/README.MD)** | Implementação do login Firebase | Isaque |
|**[RF-007](/docs/testes/Planos%20de%20teste/RF-007/README.MD)** | Visualizar solicitações | Gabriel Assis |
| **[RF-009](/docs/testes/Planos%20de%20teste/RF-009/README.MD)** | CRUD de Itens | Gabriel Assis |
| **[RF-010](/docs/testes/Planos%20de%20teste/RF-010/README.MD)** | Gerenciamento de Agendamentos | Washington |
| **[RF-011](/docs/testes/Planos%20de%20teste/RF-011/README.MD)** | Visualizar informações de clientes | Henrique |
| **[RF-012](/docs/testes/Planos%20de%20teste/RF-012/README.MD)** | Atualizar/cadastrar dados de clientes | Henrique |
| **[RF-014](/docs/testes/Planos%20de%20teste/RF-014/README.MD)** | Geração e Exportação de Relatórios | Isaque |
| **[RF-015](/docs/testes/Planos%20de%20teste/RF-015/README.MD)** | Página de Calendário | Felipe |
| **[RF-017](/docs/testes/Planos%20de%20teste/RF-017/README.MD)** | Recuperação de senha | Felipe |
| **[RF-018](/docs/testes/Planos%20de%20teste/RF-018/README.MD)** | Gerenciar administradores | João |
| **[Configurações](/docs/testes/Planos%20de%20teste/configuracoes/README.MD)** | Configurações administradores | Washington |
