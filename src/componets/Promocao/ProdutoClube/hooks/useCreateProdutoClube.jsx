import { useCallback, useEffect, useState } from "react"
import { get, post, put } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import Swal from "sweetalert2"
import { getDataAtual } from "../../../../utils/dataAtual"
import * as XLSX from 'xlsx';
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { registrarLogAuditoria } from "../../../../services/auditLog"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
const LIMITE_MAXIMO_PRODUTOS = 30000;
const TAMANHO_LOTE_PRODUTOS = 1000;
const TAMANHO_LOTE_CONSULTA_PRODUTOS = 10;

// Converte o preço vindo da planilha (número, "10,50", "1.234,56", "R$ 10,50") em número
const parsePreco = (valor) => {
  if (valor === undefined || valor === null || valor === '') return null;
  if (typeof valor === 'number') return valor;
  let str = String(valor).replace(/[R$\s]/g, '');
  if (str.includes(',')) str = str.replace(/\./g, '').replace(',', '.');
  const numero = Number(str);
  return Number.isNaN(numero) ? null : numero;
};

export const useCreateProdutoClube = ({ usuarioLogado, optionsModulos }) => {
  const [grupoSelecionadoOrigem, setGrupoSelecionadoOrigem] = useState(-1)
  const [marcaSelecionada, setMarcaSelecionada] = useState(-1)
  const [empresaSelecionada, setEmpresaSelecionada] = useState([])
  const [dataInicio, setDataInicio] = useState('')
  const [dataFim, setDataFim] = useState('')
  const [produtoOrigem, setProdutoOrigem] = useState('')
  const [fileProdutoOrigem, setFileProdutoOrigem] = useState([])
  const [produtoDestino, setProdutoDestino] = useState('')
  const [fileProdutoDestino, setFileProdutoDestino] = useState([])
  const [produtoDestinoSelecionado, setProdutoDestinoSelecionado] = useState([]);
  const [produtoOrigemSelecionado, setProdutoOrigemSelecionado] = useState([]);
  const [novoProdutoDestino, setNovoProdutoDestino] = useState([]);
  const [novoProdutoOrigem, setNovoProdutoOrigem] = useState([]);
  const [modalProdutoOrigem, setModalProdutoOrigem] = useState(false);
  const [modalPodutoSelecionadoOrigem, setModalPodutoSelecionadoOrigem] = useState(false);
  const [produtoSelecionadoEstProdDestino, setProdutoSelecionadoEstProdutoDestino] = useState([]);
  const [produtoSelecionadoEstProdOrigem, setProdutoSelecionadoEstProdutoOrigem] = useState([]);
  const [produtosOrigemDetalhados, setProdutosOrigemDetalhados] = useState([]);



  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFinal = getDataAtual()
    setDataInicio(dataInicial)
    setDataFim(dataFinal)
  }, [])


  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 1000 * 60 * 60, cacheTime: 1000 * 60 * 60, }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: false, staleTime: 1000 * 60 * 60 }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas]);

  const downloadPlanilhaModelo = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Produtos");

    // 🔴 TÍTULO
    worksheet.mergeCells("A1:B1");

    const titulo = worksheet.getCell("A1");
    titulo.value = "Produtos da Promoção";

    titulo.font = {
      bold: true,
      size: 14,
      color: { argb: "FFFFFFFF" }
    };

    titulo.alignment = {
      horizontal: "center",
      vertical: "middle"
    };

    titulo.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFFF0000" } // vermelho
    };

    // 📌 HEADER (linha 2)
    const headers = ["IDPRODUTO", "PRECO_VENDA"];

    headers.forEach((text, index) => {
      const cell = worksheet.getCell(2, index + 1);
      cell.value = text;

      cell.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }
      };

      cell.alignment = {
        horizontal: "center",
        vertical: "middle"
      };

      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF000000" } // preto
      };

      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
      };
    });

    // 📏 Largura da coluna A
    worksheet.getColumn(1).width = 30;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(2).numFmt = '#,##0.00';

    // 🔒 Validação (máx 30 caracteres)
    for (let i = 3; i <= 1000; i++) {
      worksheet.getCell(`A${i}`).dataValidation = {
        type: "textLength",
        operator: "lessThanOrEqual",
        showErrorMessage: true,
        formulae: [30],
        error: "Máximo de 30 caracteres permitido."
      };
    }

    // 🎨 (Opcional) aplicar estilo nas células das colunas A e B
    for (let i = 3; i <= 20; i++) {
      ["A", "B"].forEach((coluna) => {
        const cell = worksheet.getCell(`${coluna}${i}`);

        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFF2F2F2" } // cinza claro
        };

        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });
    }

    // 💾 Gerar arquivo
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "modelo_produtos.xlsx");
  };

  const clearFileError = (isOrigem) => {
    // Limpa o estado do arquivo
    if (isOrigem) {
      setFileProdutoOrigem([]);
      setProdutoSelecionadoEstProdutoOrigem([])
      setProdutosOrigemDetalhados([])
    } else {
      setFileProdutoDestino([]);
      setProdutoSelecionadoEstProdutoDestino([])
    }

    // Limpa o input file se existir
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
      if (input) {
        input.value = '';
      }
    });
  };

  const handleFileUpload = async (file, isOrigem) => {
    try {
      const data = await processFile(file);

      if (data.length > LIMITE_MAXIMO_PRODUTOS) {
        clearFileError(isOrigem);

        Swal.fire({
          icon: 'warning',
          title: 'Limite Excedido',
          html: `
            Limite máximo permitido: ${LIMITE_MAXIMO_PRODUTOS.toLocaleString('pt-BR')} produtos por promoção.<br>
            Produtos encontrados: ${data.length}<br>
            Caso contrário, os produtos não serão inseridos na promoção.
          `,
          customClass: { container: "custom-swal" },
        });
        return;
      }

      await Swal.fire({
        icon: 'success',
        title: 'Arquivo Processado!',
        text: `${data.length} produtos foram encontrados na planilha`,
        customClass: { container: "custom-swal" },
        timer: 2000,
        showConfirmButton: false
      });

      if (isOrigem) {
        setFileProdutoOrigem(JSON.stringify(data));
        setProdutoSelecionadoEstProdutoOrigem(JSON.stringify(data))
        setProdutosOrigemDetalhados([])
      } else {
        setFileProdutoDestino(JSON.stringify(data));
        setProdutoSelecionadoEstProdutoDestino(JSON.stringify(data))
      }

    } catch (error) {
      console.error('Erro ao processar arquivo:', error);

      // ✅ LIMPA ARQUIVO quando há erro de validação
      clearFileError(isOrigem);

      // ✅ ERRO ESPECÍFICO: Mostra a estrutura correta se erro de validação
      if (error.modeloIncorreto) {
        Swal.fire({
          icon: 'error',
          title: 'Modelo Incorreto da Planilha!',
          customClass: { container: "custom-swal" },
          html: `
            <div style="text-align: left;">
              <p><strong>Erro:</strong> ${error.message}</p>
              <br>
              <p><strong>Modelo correto da planilha:</strong></p>
                <table border="1" style="width: 100%; margin: 10px 0;">
                  <tr style="background-color: #ff0000; color: white;">
                    <th colspan="2" style="padding: 8px; text-align: center;"><strong>Produtos da Promoção</strong></th>
                  </tr>
                  <tr style="background-color: #000000; color: white;">
                    <th style="padding: 8px; text-align: center;"><strong>IDPRODUTO</strong></th>
                    <th style="padding: 8px; text-align: center;"><strong>PRECO_VENDA</strong></th>
                  </tr>
                  <tr>
                    <td style="padding: 8px; text-align: center;">11654</td>
                    <td style="padding: 8px; text-align: center;">19,90</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; text-align: center;">11655</td>
                    <td style="padding: 8px; text-align: center;">49,90</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px; text-align: center;">...</td>
                    <td style="padding: 8px; text-align: center;">...</td>
                  </tr>
                </table>
                <p><em><strong>Arquivo:</strong> .xlsx, aba "Produtos"</em></p>
                <p><em><strong>Linha 1:</strong> Título "Produtos da Promoção"</em></p>
                <p><em><strong>Linha 2:</strong> Cabeçalhos "IDPRODUTO" (coluna A) e "PRECO_VENDA" (coluna B)</em></p>
                <p><em><strong>Linha 3+:</strong> IDPRODUTO e PRECO_VENDA preenchidos em todas as linhas, sem outras colunas</em></p>
                <br>
                <p style="color: #ff0000;"><strong>⚠️ IMPORTANTE:</strong> Use a planilha modelo baixada do sistema!</p>
            </div>
          `,
          confirmButtonText: 'Entendi'
        });
      } else {
        // ✅ ERRO GENÉRICO
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Falha ao processar o arquivo. Verifique o formato.',
          customClass: { container: "custom-swal" },
        });
      }
    }
  };

  const erroModelo = (mensagem) => {
    const error = new Error(mensagem);
    error.modeloIncorreto = true;
    return error;
  };

  const processFile = (file) => {
    return new Promise((resolve, reject) => {
      // ✅ Só aceita o mesmo formato da planilha modelo (.xlsx)
      if (!file || !file.name.toLowerCase().endsWith('.xlsx')) {
        reject(erroModelo('Formato de arquivo inválido. Importe somente a planilha modelo (.xlsx) baixada do sistema.'));
        return;
      }

      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          // Cada item: { IDPRODUTO: string, PRECO_VENDA: number }
          resolve(processXLSX(e.target.result));
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Erro na leitura do arquivo'));
      reader.readAsArrayBuffer(file);
    });
  };

  const processXLSX = (xlsxContent) => {
    let workbook;
    try {
      workbook = XLSX.read(xlsxContent, { type: 'array' });
    } catch {
      throw erroModelo('Não foi possível ler o arquivo. Importe a planilha modelo (.xlsx) baixada do sistema.');
    }

    // ✅ VALIDAÇÃO: Aba "Produtos" (mesma da planilha modelo)
    if (workbook.SheetNames.length !== 1 || workbook.SheetNames[0] !== 'Produtos') {
      throw erroModelo('A planilha deve ter apenas uma aba chamada "Produtos", igual à planilha modelo.');
    }

    const worksheet = workbook.Sheets['Produtos'];
    if (!worksheet || !worksheet['!ref']) {
      throw erroModelo('A planilha está vazia.');
    }

    const valorCelula = (linha, coluna) => {
      const cell = worksheet[XLSX.utils.encode_cell({ r: linha, c: coluna })];
      if (!cell || cell.v === undefined || cell.v === null) return '';
      return typeof cell.v === 'string' ? cell.v.trim() : cell.v;
    };

    const range = XLSX.utils.decode_range(worksheet['!ref']);

    // ✅ VALIDAÇÃO: Título na linha 1
    if (valorCelula(0, 0) !== 'Produtos da Promoção') {
      throw erroModelo('A célula A1 deve conter exatamente o título "Produtos da Promoção".');
    }

    // ✅ VALIDAÇÃO: Cabeçalhos exatos na linha 2
    if (valorCelula(1, 0) !== 'IDPRODUTO' || valorCelula(1, 1) !== 'PRECO_VENDA') {
      throw erroModelo('A linha 2 deve conter exatamente os cabeçalhos "IDPRODUTO" (coluna A) e "PRECO_VENDA" (coluna B).');
    }

    // ✅ VALIDAÇÃO: Nenhuma coluna além de A e B (ignora a célula mesclada do título)
    for (let linha = 0; linha <= range.e.r; linha++) {
      for (let coluna = 2; coluna <= range.e.c; coluna++) {
        if (valorCelula(linha, coluna) !== '') {
          throw erroModelo(`A planilha não pode ter colunas além de IDPRODUTO e PRECO_VENDA (valor encontrado em ${XLSX.utils.encode_cell({ r: linha, c: coluna })}).`);
        }
      }
    }
    if (valorCelula(0, 1) !== '') {
      throw erroModelo('A linha 1 deve conter apenas o título "Produtos da Promoção".');
    }

    // ✅ EXTRAÇÃO + VALIDAÇÃO das linhas de dados (linha 3 em diante)
    const result = [];
    const errosLinhas = [];
    const idsVistos = new Map();

    for (let linha = 2; linha <= range.e.r; linha++) {
      const numeroLinha = linha + 1;
      const idBruto = valorCelula(linha, 0);
      const precoBruto = valorCelula(linha, 1);

      // Linha totalmente vazia é ignorada
      if (idBruto === '' && precoBruto === '') continue;

      const idProduto = idBruto.toString().trim();
      const preco = parsePreco(precoBruto);

      if (idProduto === '') {
        errosLinhas.push(`Linha ${numeroLinha}: IDPRODUTO não informado`);
        continue;
      }
      if (idProduto.length > 30) {
        errosLinhas.push(`Linha ${numeroLinha}: IDPRODUTO com mais de 30 caracteres`);
        continue;
      }
      if (preco === null || preco <= 0) {
        errosLinhas.push(`Linha ${numeroLinha}: PRECO_VENDA inválido ou não informado`);
        continue;
      }
      if (idsVistos.has(idProduto)) {
        errosLinhas.push(`Linha ${numeroLinha}: IDPRODUTO ${idProduto} duplicado (já informado na linha ${idsVistos.get(idProduto)})`);
        continue;
      }

      idsVistos.set(idProduto, numeroLinha);
      result.push({ IDPRODUTO: idProduto, PRECO_VENDA: preco });
    }

    if (errosLinhas.length > 0) {
      const maxErros = 10;
      const lista = errosLinhas.slice(0, maxErros).join('<br>');
      const restante = errosLinhas.length > maxErros ? `<br>... e mais ${errosLinhas.length - maxErros} erro(s)` : '';
      throw erroModelo(`Existem linhas inválidas na planilha:<br>${lista}${restante}`);
    }

    // ✅ VALIDAÇÃO: Verifica se encontrou produtos
    if (result.length === 0) {
      throw erroModelo('Nenhum produto foi informado a partir da linha 3 da planilha.');
    }

    return result;
  };

  const mostrarProdutosSelecionadosOrigem = useCallback(async () => {
    let itens = [];

    // Produtos do arquivo (JSON string de { IDPRODUTO, PRECO_VENDA })
    if (fileProdutoOrigem && fileProdutoOrigem.length > 0) {
      try {
        itens = typeof fileProdutoOrigem === 'string' ? JSON.parse(fileProdutoOrigem) : fileProdutoOrigem;
      } catch {
        itens = [];
      }
    }
    // Produto digitado no input
    if (produtoOrigem) {
      itens = [...itens, { IDPRODUTO: produtoOrigem, PRECO_VENDA: null }];
    }
    // Produtos selecionados via checkbox
    if (novoProdutoOrigem && novoProdutoOrigem.length > 0) {
      itens = [...itens, ...novoProdutoOrigem];
    }

    // Normaliza para objeto e remove duplicados pelo IDPRODUTO (mantém o primeiro preço encontrado)
    const mapaProdutos = new Map();
    itens.filter(Boolean).forEach(item => {
      const obj = typeof item === 'object' ? item : { IDPRODUTO: item, PRECO_VENDA: null };
      const id = String(obj.IDPRODUTO ?? '').trim();
      if (id && !mapaProdutos.has(id)) {
        mapaProdutos.set(id, { IDPRODUTO: id, PRECO_VENDA: obj.PRECO_VENDA ?? null });
      }
    });
    const listaProdutos = Array.from(mapaProdutos.values());

    if (listaProdutos.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Nenhum produto informado!',
        text: 'Importe a planilha com IDPRODUTO e PRECO_VENDA ou informe um produto.',
        customClass: { container: 'custom-swal' },
      });
      return;
    }

    const idEmpresa = Array.isArray(empresaSelecionada) ? (empresaSelecionada[0] ?? '') : (empresaSelecionada ?? '');
    const resultado = [];

    try {
      // Consulta a API lista-produtos para cada IDPRODUTO, em lotes paralelos
      for (let i = 0; i < listaProdutos.length; i += TAMANHO_LOTE_CONSULTA_PRODUTOS) {
        const lote = listaProdutos.slice(i, i + TAMANHO_LOTE_CONSULTA_PRODUTOS);
        animacaoCarregamento(`Buscando produtos ${Math.min(i + lote.length, listaProdutos.length)} de ${listaProdutos.length}...`, true);

        const respostas = await Promise.all(lote.map(async (item) => {
          try {
            const response = await get(`/produto-preco-clube-promocao?idProduto=${encodeURIComponent(item.IDPRODUTO)}`);
            const lista = Array.isArray(response?.data) ? response.data : [];
            const produto = lista.find(p => String(p.IDPRODUTO) === item.IDPRODUTO) || (lista.length === 1 ? lista[0] : null);

            return {
              ...(produto || {}),
              IDPRODUTO: item.IDPRODUTO,
              PRECO_VENDA: item.PRECO_VENDA,
              ENCONTRADO: Boolean(produto),
            };
          } catch (error) {
            console.error(`Erro ao buscar produto ${item.IDPRODUTO}:`, error);
            return { IDPRODUTO: item.IDPRODUTO, PRECO_VENDA: item.PRECO_VENDA, ENCONTRADO: false };
          }
        }));

        resultado.push(...respostas);
      }
    } finally {
      fecharAnimacaoCarregamento();
    }

    setProdutosOrigemDetalhados(resultado.map((produto, index) => ({ ...produto, contador: index + 1 })));
    setModalPodutoSelecionadoOrigem(true);

    const naoEncontrados = resultado.filter(p => !p.ENCONTRADO).length;
    if (naoEncontrados > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Produtos não encontrados',
        text: `${naoEncontrados} produto(s) da planilha não foram encontrados no cadastro.`,
        customClass: { container: 'custom-swal' },
      });
    }
  }, [fileProdutoOrigem, produtoOrigem, novoProdutoOrigem, empresaSelecionada]);

  const handleRemoverProdutoOrigem = (row) => {
    const idRemover = String(row.IDPRODUTO);

    setProdutosOrigemDetalhados(prev =>
      prev
        .filter(produto => String(produto.IDPRODUTO) !== idRemover)
        .map((produto, index) => ({ ...produto, contador: index + 1 }))
    );

    // Remove também da lista que será enviada no cadastro
    setFileProdutoOrigem(prev => {
      let itens = [];
      try {
        itens = typeof prev === 'string' ? JSON.parse(prev) : (Array.isArray(prev) ? prev : []);
      } catch {
        itens = [];
      }
      const filtrados = itens.filter(item => {
        const id = typeof item === 'object' && item !== null ? item.IDPRODUTO : item;
        return String(id) !== idRemover;
      });
      return filtrados.length > 0 ? JSON.stringify(filtrados) : [];
    });

    if (String(produtoOrigem) === idRemover) {
      setProdutoOrigem('');
    }
  };




  // Busca TODOS os registros já cadastrados em PRODUTOPRECOCLUBE para uma empresa (paginado)
  const buscarProdutosClubeExistentes = async (idEmpresa) => {
    const urlApi = `/produto-preco-clube?idEmpresa=${idEmpresa}`;
    const primeiraResposta = await get(`${urlApi}&page=1`);
    const pageSize = primeiraResposta?.pageSize || 1000;
    const totalRows = primeiraResposta?.rows || primeiraResposta?.data?.length || 0;
    const totalPages = Math.ceil(totalRows / pageSize);

    const allData = [...(primeiraResposta?.data || [])];
    for (let page = 2; page <= totalPages; page++) {
      const responsePage = await get(`${urlApi}&page=${page}`);
      allData.push(...(responsePage?.data || []));
    }
    return allData;
  };

  const onSubmit = async () => {
    try {
      if (!empresaSelecionada || empresaSelecionada.length == 0) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Selecione uma empresa!',
          customClass: { container: 'custom-swal' },
          showConfirmButton: false,
          timer: 3000,
        })
        return;
      }

      if (!dataInicio || !dataFim || dataFim < dataInicio) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Data fim inválida!',
          text: 'A data fim deve ser maior ou igual à data início.',
          customClass: { container: 'custom-swal' },
          showConfirmButton: false,
          timer: 3000,
        })
        return;
      }

      // ✅ Produtos do Excel: [{ IDPRODUTO, PRECO_VENDA }]
      let produtosExcel = [];
      try {
        produtosExcel = typeof fileProdutoOrigem === 'string' ? JSON.parse(fileProdutoOrigem) : (Array.isArray(fileProdutoOrigem) ? fileProdutoOrigem : []);
      } catch {
        produtosExcel = [];
      }
      produtosExcel = produtosExcel.filter(item => item && typeof item === 'object' && item.IDPRODUTO && item.PRECO_VENDA !== null && item.PRECO_VENDA !== undefined);

      if (produtosExcel.length === 0) {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Nenhum produto para enviar!',
          text: 'Importe a planilha modelo com IDPRODUTO e PRECO_VENDA.',
          customClass: { container: 'custom-swal' },
          showConfirmButton: false,
          timer: 3000,
        })
        return;
      }

      const idsEmpresas = Array.isArray(empresaSelecionada) ? empresaSelecionada : [empresaSelecionada];
      const empresasArray = Array.isArray(optionsEmpresas) ? optionsEmpresas : [];

      // ✅ Monta um registro por produto x empresa, com todos os campos da tabela PRODUTOPRECOCLUBE
      const registros = [];
      idsEmpresas.forEach(idEmpresa => {
        const empresa = empresasArray.find(emp => String(emp.IDEMPRESA) === String(idEmpresa));
        const idSubGrupoEmpresarial = empresa?.IDSUBGRUPOEMPRESARIAL ?? empresa?.IDGRUPOEMPRESARIAL ?? null;

        produtosExcel.forEach(produto => {
          registros.push({
            IDPRODUTO: String(produto.IDPRODUTO),
            PRECO_VENDA: Number(produto.PRECO_VENDA),
            DTHORAINICIOVIGENCIA: dataInicio,
            DTHORAFIMVIGENCIA: dataFim,
            IDSUBGRUPOEMPRESARIAL: idSubGrupoEmpresarial,
            IDEMPRESA: idEmpresa,
          });
        });
      });

      // Bloqueia completamente a tela: sem fechar por fora, sem ESC, sem botões.
      Swal.fire({
        title: 'Processando sua promoção...',
        html: 'Verificando produtos já cadastrados...',
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
        showConfirmButton: false,
        showCancelButton: false,
        showCloseButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      let totalLotes = 0;
      const paraAtualizar = [];
      const paraInserir = [];

      try {
        // ✅ VERIFICAÇÃO: produto já existe para a mesma IDEMPRESA? -> PUT, senão -> POST
        const chavesExistentes = new Set();
        for (let i = 0; i < idsEmpresas.length; i++) {
          if (Swal.isVisible()) {
            Swal.update({ html: `Verificando produtos já cadastrados... empresa ${i + 1} de ${idsEmpresas.length}` });
          }
          const existentes = await buscarProdutosClubeExistentes(idsEmpresas[i]);
          existentes.forEach(item => chavesExistentes.add(`${item.IDEMPRESA}|${item.IDPRODUTO}`));
        }

        registros.forEach(registro => {
          if (chavesExistentes.has(`${registro.IDEMPRESA}|${registro.IDPRODUTO}`)) {
            paraAtualizar.push(registro);
          } else {
            paraInserir.push(registro);
          }
        });

        const totalRegistros = registros.length;
        totalLotes = Math.ceil(paraAtualizar.length / TAMANHO_LOTE_PRODUTOS) + Math.ceil(paraInserir.length / TAMANHO_LOTE_PRODUTOS);

        const montarHtmlProgresso = (loteAtual, registrosEnviados, operacao) => {
          const percentual = Math.min(100, Math.round((registrosEnviados / totalRegistros) * 100));
          return `
            <div style="text-align:left">
              <p>${operacao} — lote <b>${loteAtual}</b> de <b>${totalLotes}</b></p>
              <p>Novos: <b>${paraInserir.length}</b> | Atualizados: <b>${paraAtualizar.length}</b></p>
              <p>Registros enviados: <b>${registrosEnviados}</b> de <b>${totalRegistros}</b> (faltam ${totalRegistros - registrosEnviados})</p>
              <div style="background:#e0e0e0;border-radius:4px;overflow:hidden;height:10px;margin-top:8px;">
                <div style="background:#3085d6;height:100%;width:${percentual}%;transition:width .3s;"></div>
              </div>
            </div>
          `;
        };

        let loteAtual = 0;
        let registrosEnviados = 0;

        const enviarEmLotes = async (lista, enviarLote, operacao) => {
          for (let inicio = 0; inicio < lista.length; inicio += TAMANHO_LOTE_PRODUTOS) {
            const lotePostData = lista.slice(inicio, inicio + TAMANHO_LOTE_PRODUTOS);
            loteAtual++;

            if (Swal.isVisible()) {
              Swal.update({ html: montarHtmlProgresso(loteAtual, registrosEnviados, operacao) });
            }

            await enviarLote(lotePostData);

            registrosEnviados += lotePostData.length;
            if (Swal.isVisible()) {
              Swal.update({ html: montarHtmlProgresso(loteAtual, registrosEnviados, operacao) });
            }
          }
        };

        // PUT -> /produto-preco-clube/:id  |  POST -> /produto-preco-clube
        await enviarEmLotes(
          paraAtualizar,
          (lotePutData) => put(`/produto-preco-clube/${encodeURIComponent(lotePutData[0].IDPRODUTO)}`, lotePutData),
          'Atualizando (PUT)'
        );
        await enviarEmLotes(
          paraInserir,
          (lotePostData) => post('/produto-preco-clube', lotePostData),
          'Cadastrando (POST)'
        );
      } finally {
        Swal.close();
      }

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cadastro realizado com sucesso!',
        html: `Novos: <b>${paraInserir.length}</b> | Atualizados: <b>${paraAtualizar.length}</b>${totalLotes > 1 ? `<br>(${totalLotes} lotes enviados)` : ''}`,
        customClass: { container: 'custom-swal' },
        showConfirmButton: false,
        timer: 2500,
      }).then(() => {
        // window.location.reload();
      });

      return { inseridos: paraInserir.length, atualizados: paraAtualizar.length };
    } catch (error) {
      console.error('Erro ao cadastrar promoção:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao Cadastrar Promoção!',
        text: error?.response?.data?.error || error?.response?.data?.message || error.message || 'Ocorreu um erro durante o cadastro',
        customClass: { container: 'custom-swal' },
      });
      return null;
    }
  };

  return {
    marcaSelecionada,
    setMarcaSelecionada,
    empresaSelecionada,
    setEmpresaSelecionada,
    dataInicio,
    setDataInicio,
    dataFim,
    setDataFim,
    produtoOrigem,
    setProdutoOrigem,
    fileProdutoOrigem,
    setFileProdutoOrigem,
    optionsMarcas,
    optionsEmpresas,
    handleFileUpload,
    mostrarProdutosSelecionadosOrigem,
    produtosOrigemDetalhados,
    handleRemoverProdutoOrigem,
    modalPodutoSelecionadoOrigem,
    setModalPodutoSelecionadoOrigem,
    onSubmit,
    downloadPlanilhaModelo,
  }
}

// 2446