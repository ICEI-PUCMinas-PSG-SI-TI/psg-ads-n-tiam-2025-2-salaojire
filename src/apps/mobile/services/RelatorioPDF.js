import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

const formatMoeda = (value) => {
  return `R$ ${Number(value || 0).toFixed(2).replace('.', ',')}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  const d = new Date(date);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

const formatDateExportar = (date) => {
  let data = formatDate(date);
  if (data == "-")
    return "data-indefinida"

  return data.replaceAll('/', '-');
}

export const gerarRelatorioPDF = async (dadosGerais, agendamentos, dataInicio, dataFim) => {
  try {
    const itensMaisUsados = [...dadosGerais.dadosItens]
      .sort((a, b) => b.totalHorasAlugadas - a.totalHorasAlugadas);

    const itensMaisRentaveis = [...dadosGerais.dadosItens]
      .sort((a, b) => Number(b.totalFaturado) - Number(a.totalFaturado));

    const itensMedia = [...dadosGerais.dadosItens]
      .sort((a, b) => b.mediaPorEvento - a.mediaPorEvento);

    // HTML do Relatório
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica', sans-serif; padding: 20px; color: #333; -webkit-print-color-adjust: exact; }
          h1 { color: #2c3e50; text-align: center; margin-bottom: 5px; font-size: 24px; }
          h2 { color: #2c3e50; border-bottom: 2px solid #F2C94C; padding-bottom: 5px; margin-top: 30px; font-size: 16px; }
          .periodo { text-align: center; color: #7f8c8d; font-size: 12px; margin-bottom: 30px; }
          
          .resumo-box { display: flex; justify-content: space-between; margin-bottom: 20px; border: 1px solid #eee; padding: 15px; border-radius: 8px; background-color: #f8f9fa; }
          .resumo-item { text-align: center; flex: 1; border-right: 1px solid #eee; }
          .resumo-item:last-child { border-right: none; }
          .resumo-label { font-size: 10px; text-transform: uppercase; color: #7f8c8d; display: block; margin-bottom: 4px; }
          .resumo-valor { font-size: 16px; font-weight: bold; color: #2c3e50; }

          table { width: 100%; border-collapse: collapse; margin-bottom: 10px; font-size: 11px; }
          th { background-color: #EAE2D6; color: #333; padding: 8px; text-align: left; font-weight: bold; }
          td { padding: 8px; border-bottom: 1px solid #eee; }
          tr:nth-child(even) { background-color: #fcfcfc; }
          .text-right { text-align: right; }
          .text-center { text-align: center; }
          .destaque { font-weight: bold; color: #27ae60; }
          
          .footer { margin-top: 50px; text-align: center; font-size: 9px; color: #aaa; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
      </head>
      <body>
        <h1>Relatório - Jiré Festas e Eventos</h1>
        <p class="periodo">
          Período: ${formatDate(dataInicio)} a ${formatDate(dataFim)}
        </p>

        <div class="resumo-box">
          <div class="resumo-item">
            <span class="resumo-label">Faturado</span>
            <span class="resumo-valor" style="color: #27ae60">${formatMoeda(dadosGerais.faturado)}</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-label">Pendente</span>
            <span class="resumo-valor" style="color: #e74c3c">${formatMoeda(dadosGerais.pendente)}</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-label">Eventos</span>
            <span class="resumo-valor">${dadosGerais.agendamentos}</span>
          </div>
          <div class="resumo-item">
            <span class="resumo-label">FATURAMENTO Médio</span>
            <span class="resumo-valor">${formatMoeda(dadosGerais.medio)}</span>
          </div>
        </div>

        <!-- Itens Mais Usados -->
        <h2>1. Itens Mais Usados (Por Horas)</h2>
        <table>
          <thead>
            <tr>
              <th width="50%">Item</th>
              <th width="25%" class="text-center">Qtd. Alugada</th>
              <th width="25%" class="text-right">Horas Totais</th>
            </tr>
          </thead>
          <tbody>
            ${itensMaisUsados.map(item => `
              <tr>
                <td>${item.nome}</td>
                <td class="text-center">${item.totalQuantidade}</td>
                <td class="text-right destaque">${item.totalHorasAlugadas} Horas</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Itens Mais Rentáveis -->
        <h2>2. Itens Mais Rentáveis (Faturamento)</h2>
        <table>
          <thead>
            <tr>
              <th width="50%">Item</th>
              <th width="25%" class="text-right">Preço Unit.</th>
              <th width="25%" class="text-right">Total Gerado</th>
            </tr>
          </thead>
          <tbody>
            ${itensMaisRentaveis.map(item => `
              <tr>
                <td>${item.nome}</td>
                <td class="text-right">${formatMoeda(item.precoAluguel)}</td>
                <td class="text-right destaque">${formatMoeda(item.totalFaturado)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Média por Evento -->
        <h2>3. Média de Uso por Evento</h2>
        <table>
          <thead>
            <tr>
              <th width="50%">Item</th>
              <th width="25%" class="text-center">Total Eventos</th>
              <th width="25%" class="text-center">Média / Evento</th>
            </tr>
          </thead>
          <tbody>
            ${itensMedia.map(item => `
              <tr>
                <td>${item.nome}</td>
                <td class="text-center">${item.totalEventos}</td>
                <td class="text-center destaque">${item.mediaPorEvento} unidades</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <!-- Lista de Agendamentos -->
        <h2>Histórico de Agendamentos</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Cliente</th>
              <th class="text-right">Valor Pago</th>
              <th class="text-right">Valor Pendente</th>
              <th class="text-right">Valor Total</th>
            </tr>
          </thead>
          <tbody>
            ${agendamentos.map(ag => `
              <tr>
                <td>${ag.dataInicio?.seconds ? formatDate(new Date(ag.dataInicio.seconds * 1000)) : '-'}</td>
                <td>${ag.nome || 'Cliente não identificado'}</td>
                <td class="text-right">${formatMoeda(ag.valorPago)}</td>
                <td class="text-right">${formatMoeda(ag.valorTotal - (ag.valorPago || 0))}</td>
                <td class="text-right">${formatMoeda(ag.valorTotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Relatório gerado automaticamente em ${new Date().toLocaleString('pt-BR')}
        </div>
      </body>
      </html>
    `;

    // Gerar arquivo PDF
    const { uri } = await Print.printToFileAsync({ html, base64: false });
    const nomeLimpo = `Relatorio_${formatDateExportar(dataInicio)}_a_${formatDateExportar(dataFim)}.pdf`;
    const arquivoTemp = new File(uri);
    const arquivoDestino = new File(Paths.document, nomeLimpo);
    await arquivoTemp.move(arquivoDestino);

    // Exportar PDF
    await Sharing.shareAsync(arquivoDestino.uri, { 
      UTI: '.pdf', 
      mimeType: 'application/pdf',
      dialogTitle: `Compartilhar ${nomeLimpo}`
    });

  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    throw new Error(error.message);
  }
};