import Swal from "sweetalert2";
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const LIMITE_MAXIMO_PRODUTOS = 10000;
const TITULO_PLANILHA = 'Produtos da Promoção';

const BORDA_FINA = {
  top: { style: "thin" },
  left: { style: "thin" },
  bottom: { style: "thin" },
  right: { style: "thin" },
};

const preenchimento = (argb) => ({ type: "pattern", pattern: "solid", fgColor: { argb } });

export const downloadPlanilhaModelo = async () => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Produtos");

  worksheet.mergeCells("A1:C1");
  const titulo = worksheet.getCell("A1");
  titulo.value = TITULO_PLANILHA;
  titulo.font = { bold: true, size: 14, color: { argb: "FFFFFFFF" } };
  titulo.alignment = { horizontal: "center", vertical: "middle" };
  titulo.fill = preenchimento("FFFF0000");

  const cabecalho = worksheet.getCell(2, 1);
  cabecalho.value = "ID";
  cabecalho.font = { bold: true, color: { argb: "FFFFFFFF" } };
  cabecalho.alignment = { horizontal: "center", vertical: "middle" };
  cabecalho.fill = preenchimento("FF000000");
  cabecalho.border = BORDA_FINA;

  worksheet.getColumn(1).width = 30;

  for (let i = 3; i <= 1000; i++) {
    worksheet.getCell(`A${i}`).dataValidation = {
      type: "textLength",
      operator: "lessThanOrEqual",
      showErrorMessage: true,
      formulae: [30],
      error: "Máximo de 30 caracteres permitido."
    };
  }

  for (let i = 3; i <= 20; i++) {
    const cell = worksheet.getCell(`A${i}`);
    cell.fill = preenchimento("FFF2F2F2");
    cell.border = BORDA_FINA;
  }

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer]), "modelo_produtos.xlsx");
};

const processarCSV = (conteudo) => {
  const texto = typeof conteudo === 'string' ? conteudo : new TextDecoder().decode(conteudo);
  return texto.split('\n')
    .map((linha) => linha.trim())
    .filter(Boolean)
    .map((linha) => linha.split(',')[0].replace(/"/g, '').trim())
    .filter(Boolean);
};

const ehCabecalhoId = (header) => header && header.toString().toUpperCase().trim() === 'ID';

// Linha 1: título "Produtos da Promoção" | Linha 2: cabeçalho "ID" | Linha 3+: IDs dos produtos
const processarXLSX = (conteudo) => {
  const workbook = XLSX.read(conteudo, { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const linhas = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (!linhas || linhas.length < 2) {
    throw new Error('Planilha deve ter pelo menos 2 linhas (título e cabeçalho)');
  }

  const titulo = linhas[0]?.[0] ? linhas[0][0].toString().trim() : '';
  if (titulo !== TITULO_PLANILHA) {
    throw new Error(`A primeira linha deve conter exatamente o título "${TITULO_PLANILHA}"`);
  }

  const indiceColunaId = (linhas[1] || []).findIndex(ehCabecalhoId);
  if (indiceColunaId === -1) {
    throw new Error('A planilha deve ter um cabeçalho "ID" na segunda linha');
  }

  const ids = linhas.slice(2)
    .map((linha) => linha?.[indiceColunaId]?.toString().trim())
    .filter(Boolean);

  if (ids.length === 0) {
    throw new Error('Nenhum ID foi encontrado na coluna ID da planilha');
  }

  return ids;
};

const ehPlanilhaExcel = (file) => file.name.endsWith('.xls') || file.name.endsWith('.xlsx');

export const lerArquivoProdutos = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      let data = [];
      if (file.name.endsWith('.csv')) {
        data = processarCSV(e.target.result);
      } else if (ehPlanilhaExcel(file)) {
        data = processarXLSX(e.target.result);
      }
      resolve(data.filter((item) => item && item.trim() !== '').map((item) => item.toString()));
    } catch (error) {
      reject(error);
    }
  };

  reader.onerror = () => reject(new Error('Erro na leitura do arquivo'));

  if (ehPlanilhaExcel(file)) {
    reader.readAsArrayBuffer(file);
  } else {
    reader.readAsText(file);
  }
});

export const ehErroModeloPlanilha = (error) => (
  error.message.includes('cabeçalho "ID"') ||
  error.message.includes('Nenhum ID') ||
  error.message.includes(`título "${TITULO_PLANILHA}"`)
);

export const exibirLimiteProdutosExcedido = (quantidade) => Swal.fire({
  icon: 'warning',
  title: 'Limite Excedido',
  html: `
    Limite máximo permitido: ${LIMITE_MAXIMO_PRODUTOS.toLocaleString('pt-BR')} produtos por promoção.<br>
    Produtos encontrados: ${quantidade}<br>
    Caso contrário, os produtos não serão inseridos na promoção.
  `,
});

export const exibirArquivoProcessado = (quantidade) => Swal.fire({
  icon: 'success',
  title: 'Arquivo Processado!',
  text: `${quantidade} produtos foram encontrados na planilha`,
  timer: 2000,
  showConfirmButton: false
});

export const exibirErroArquivo = () => Swal.fire({
  icon: 'error',
  title: 'Erro',
  text: 'Falha ao processar o arquivo. Verifique o formato.',
});

export const exibirErroModeloPlanilha = (error) => Swal.fire({
  icon: 'error',
  title: 'Modelo Incorreto da Planilha!',
  html: `
    <div style="text-align: left;">
      <p><strong>Erro:</strong> ${error.message}</p>
      <br>
      <p><strong>Modelo correto da planilha:</strong></p>
      <table border="1" style="width: 100%; margin: 10px 0;">
        <tr style="background-color: #ff0000; color: white;">
          <th style="padding: 8px; text-align: center;"><strong>${TITULO_PLANILHA}</strong></th>
        </tr>
        <tr style="background-color: #000000; color: white;">
          <th style="padding: 8px; text-align: center;"><strong>ID</strong></th>
        </tr>
        <tr><td style="padding: 8px; text-align: center;">11654</td></tr>
        <tr><td style="padding: 8px; text-align: center;">11655</td></tr>
        <tr><td style="padding: 8px; text-align: center;">0038266148</td></tr>
        <tr><td style="padding: 8px; text-align: center;">...</td></tr>
      </table>
      <p><em><strong>Linha 1:</strong> Título OBRIGATÓRIO "${TITULO_PLANILHA}"</em></p>
      <p><em><strong>Linha 2:</strong> Cabeçalho "ID" obrigatório</em></p>
      <p><em><strong>Linha 3+:</strong> Dados dos produtos</em></p>
      <br>
      <p style="color: #ff0000;"><strong>⚠️ IMPORTANTE:</strong> Use a planilha modelo baixada do sistema!</p>
    </div>
  `,
  confirmButtonText: 'Entendi'
});
