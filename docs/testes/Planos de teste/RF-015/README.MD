# Plano de Testes de Software

## RF-015
* **Descrição do Requisito:** O sistema deve permitir que o usuário visualize um calendário e os eventos nos dias agendados.  
* **Objetivo:** Garantir que o calendário exiba corretamente os dias do mês, permita alternância de meses, retorne ao mês atual quando solicitado e mostre eventos conforme o dia selecionado.  
* **Registro de Testes:** [Registro de Testes - RF-015](../../Registros de Teste/RF-015/README.md)

---

### Caso de Teste 1 — Exibir calendário do mês atual
| Item | Descrição |
|------|-----------|
| **Ação** | Acessar a tela de calendário. |
| **Resultado Esperado** | O calendário deve abrir no mês atual, mostrando os dias distribuídos corretamente e destacando o dia atual. |

---

### Caso de Teste 2 — Abrir o seletor de meses
| Item | Descrição |
|------|-----------|
| **Ação** | Tocar no texto “<Mês>, <Ano>” para abrir o seletor. |
| **Resultado Esperado** | O seletor de meses deve aparecer em formato de grade, com todos os meses do ano visíveis e o mês atual destacado. |

---

### Caso de Teste 3 — Selecionar outro mês no seletor
| Item | Descrição |
|------|-----------|
| **Ação** | No seletor, tocar em um mês diferente do atual (ex: Janeiro). |
| **Resultado Esperado** | O calendário deve ser atualizado para o mês selecionado, exibindo corretamente os dias correspondentes. |

---

### Caso de Teste 4 — Botão “Voltar” retornando ao mês atual
| Item | Descrição |
|------|-----------|
| **Ação** | Após selecionar outro mês (ex: Janeiro), tocar no botão de voltar. |
| **Resultado Esperado** | O sistema deve retornar automaticamente para o mês atual (ex: Novembro), independentemente do mês anteriormente escolhido. |

---

### Caso de Teste 5 — Selecionar um dia com evento
| Item | Descrição |
|------|-----------|
| **Ação** | No calendário, tocar em um dia que possua eventos (destacado visualmente). |
| **Resultado Esperado** | A lista de eventos do dia deve aparecer abaixo do calendário, exibindo nome, horário e demais informações. |

---

### Caso de Teste 6 — Selecionar um dia sem evento
| Item | Descrição |
|------|-----------|
| **Ação** | Selecionar um dia que não possua eventos cadastrados. |
| **Resultado Esperado** | Deve ser exibida a mensagem: “Nenhum evento para este dia.” |