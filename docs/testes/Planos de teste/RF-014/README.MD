# Plano de Testes de Software

## RF-014:
* **Descrição do Requisito**: O sistema deve permitir a emissão de um relatório com o resumo mensal de eventos, contendo o número total de festas, o valor total faturado e o valor total pendente.
* **Objetivo**: Disponibilizar um relatório do salão em um período, com a possibilidade de exportação para o sistema.
* **Registro de Testes**: [Registro de Testes - RF-014](../../Registros%20de%20Teste/RF-014/README.md)

###  Caso de Teste 1 — Dados do relatório
| Item | Descrição |
|------|------------|
| **Ação** | Navegar até a página de relatórios |
| **Resultado Esperado** | Todos os dados do relatório devem ser atualizados e disponibilizados para visualização, dentro do período padrão ou estabelecido pelo usuário |

###  Caso de Teste 2 — Alteração do Período
| Item | Descrição |
|------|------------|
| **Ação** | Mudar o período do relatório |
| **Resultado Esperado** | Após a alteração do período, todos os dados devem ser atualizados refletindo os agendamentos que estão dentro do período estabelecido. |

###  Caso de Teste 3 — Exportação do Relatório
| Item | Descrição |
|------|------------|
| **Ação** | Tocar no botão "Exportar Relatório" |
| **Resultado Esperado** | O sistema deve construir o PDF de relatório e disponibilizar para que seja salvo no sistema |