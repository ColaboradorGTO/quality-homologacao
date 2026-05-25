import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useRef, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";

export const useCadastrarNcmImportacao = ({
  handleClose,
  usuarioLogado,
  optionsModulos,
  refetchNcmExcecao,
}) => {
  const [arquivo, setArquivo] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [dadosValidos, setDadosValidos] = useState([]);
  const [erros, setErros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [prontoParaImportar, setProntoParaImportar] = useState(false);
  const [ipUsuario, setIpUsuario] = useState("");

  const inputRef = useRef(null);

  const LIMITE_LINHAS = 1000;

  const getIPUsuario = async () => {
    let usuarioIP = null;
    try {
      const { data: ipWhoisData } = await axios.get("https://ifconfig.me/ip");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
    }
    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  const formatarDataExcel = (data) => {
    if (!data) return "";
    if (typeof data === "number") {
      const dataBase = new Date(1899, 11, 30);
      dataBase.setDate(dataBase.getDate() + data);
      return dataBase.toISOString().split("T")[0];
    }
    if (data instanceof Date) {
      return data.toISOString().split("T")[0];
    }
    if (typeof data === "string") {
      const partes = data.split("/");
      if (partes.length === 3) {
        let [dia, mes, ano] = partes;
        dia = dia.padStart(2, "0");
        mes = mes.padStart(2, "0");
        if (ano.length === 2) ano = `20${ano}`;
        return `${ano}-${mes}-${dia}`;
      }
    }
    return data;
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => setDragging(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processarArquivo(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processarArquivo(file);
  };

  const baixarModelo = () => {
    const cabecalho = [[
      "NUNCM", "EX", "TIPO", "DSNCM", "IMPNACIONAL",
      "IMPIMPORTACAOFEDERAL", "IMPESTADUAL", "IMPMUNICIPAL",
      "DTINICIOVIGENCIA", "DTFIMVIGENCIA", "PWCHAVE",
      "NUVERSAO", "FONTE", "SGUF", "PERCIBPT",
    ]];
    const worksheet = XLSX.utils.aoa_to_sheet(cabecalho);
    worksheet["!cols"] = cabecalho[0].map((coluna) => ({ wch: coluna.length + 5 }));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Modelo");
    XLSX.writeFile(workbook, "modelo_ncm_excecao.xlsx");
  };

  const validarLinha = (item, indiceLinha) => {
    const errosLinha = [];
    const linha = indiceLinha + 2;

    if (!item.NUNCM && item.NUNCM !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - NUNCM: O campo NUNCM é obrigatório</li>`);
    else if (isNaN(Number(item.NUNCM)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - NUNCM: NUNCM deve ser um número</li>`);
    else if (String(item.NUNCM).replace(".", "").length > 8)
      errosLinha.push(`<li><b>Linha ${linha}</b> - NUNCM: NUNCM deve ter no máximo 8 caracteres</li>`);

    if (item.EX && String(item.EX).length > 2)
      errosLinha.push(`<li><b>Linha ${linha}</b> - EX: EX deve ter no máximo 2 caracteres</li>`);

    if (!item.TIPO && item.TIPO !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - TIPO: O campo TIPO é obrigatório</li>`);
    else if (isNaN(Number(item.TIPO)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - TIPO: TIPO deve ser um número</li>`);

    if (!item.DTINICIOVIGENCIA)
      errosLinha.push(`<li><b>Linha ${linha}</b> - DTINICIOVIGENCIA: O campo DTINICIOVIGENCIA é obrigatório</li>`);

    if (!item.DTFIMVIGENCIA)
      errosLinha.push(`<li><b>Linha ${linha}</b> - DTFIMVIGENCIA: O campo DTFIMVIGENCIA é obrigatório</li>`);

    if (!item.PWCHAVE)
      errosLinha.push(`<li><b>Linha ${linha}</b> - PWCHAVE: O campo PWCHAVE é obrigatório</li>`);
    else if (String(item.PWCHAVE).length > 30)
      errosLinha.push(`<li><b>Linha ${linha}</b> - PWCHAVE: PWCHAVE deve ter no máximo 30 caracteres</li>`);

    if (!item.NUVERSAO)
      errosLinha.push(`<li><b>Linha ${linha}</b> - NUVERSAO: O campo NUVERSAO é obrigatório</li>`);
    else if (String(item.NUVERSAO).length > 30)
      errosLinha.push(`<li><b>Linha ${linha}</b> - NUVERSAO: NUVERSAO deve ter no máximo 30 caracteres</li>`);

    if (!item.FONTE)
      errosLinha.push(`<li><b>Linha ${linha}</b> - FONTE: O campo FONTE é obrigatório</li>`);
    else if (String(item.FONTE).length > 30)
      errosLinha.push(`<li><b>Linha ${linha}</b> - FONTE: FONTE deve ter no máximo 30 caracteres</li>`);

    if (!item.SGUF)
      errosLinha.push(`<li><b>Linha ${linha}</b> - SGUF: O campo SGUF é obrigatório</li>`);
    else if (String(item.SGUF).length > 2)
      errosLinha.push(`<li><b>Linha ${linha}</b> - SGUF: SGUF deve ter no máximo 2 caracteres</li>`);

    if (!item.IMPNACIONAL && item.IMPNACIONAL !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPNACIONAL: O campo IMPNACIONAL é obrigatório</li>`);
    else if (isNaN(Number(item.IMPNACIONAL)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPNACIONAL: IMPNACIONAL deve ser um número</li>`);

    if (!item.IMPIMPORTACAOFEDERAL && item.IMPIMPORTACAOFEDERAL !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPIMPORTACAOFEDERAL: O campo IMPIMPORTACAOFEDERAL é obrigatório</li>`);
    else if (isNaN(Number(item.IMPIMPORTACAOFEDERAL)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPIMPORTACAOFEDERAL: IMPIMPORTACAOFEDERAL deve ser um número</li>`);

    if (!item.IMPESTADUAL && item.IMPESTADUAL !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPESTADUAL: O campo IMPESTADUAL é obrigatório</li>`);
    else if (isNaN(Number(item.IMPESTADUAL)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPESTADUAL: IMPESTADUAL deve ser um número</li>`);

    if (!item.IMPMUNICIPAL && item.IMPMUNICIPAL !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPMUNICIPAL: O campo IMPMUNICIPAL é obrigatório</li>`);
    else if (isNaN(Number(item.IMPMUNICIPAL)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - IMPMUNICIPAL: IMPMUNICIPAL deve ser um número</li>`);

    if (!item.PERCIBPT && item.PERCIBPT !== 0)
      errosLinha.push(`<li><b>Linha ${linha}</b> - PERCIBPT: O campo PERCIBPT é obrigatório</li>`);
    else if (isNaN(Number(item.PERCIBPT)))
      errosLinha.push(`<li><b>Linha ${linha}</b> - PERCIBPT: PERCIBPT deve ser um número</li>`);

    return errosLinha;
  };

  const validarLista = (dados) => {

    setProntoParaImportar(false);

    if (!dados || dados.length === 0) {
      setResultado({ erro: "Arquivo vazio" });
      return;
    }

    const cabecalhoEsperado = [
      "NUNCM", "EX", "TIPO", "DSNCM", "IMPNACIONAL",
      "IMPIMPORTACAOFEDERAL", "IMPESTADUAL", "IMPMUNICIPAL",
      "DTINICIOVIGENCIA", "DTFIMVIGENCIA", "PWCHAVE",
      "NUVERSAO", "FONTE", "SGUF", "PERCIBPT",
    ];

    const cabecalhoArquivo = Object.keys(dados[0]);
    const cabecalhoValido = cabecalhoEsperado.every(
      (coluna, index) => coluna === cabecalhoArquivo[index]
    );

    if (!cabecalhoValido) {
      setResultado({ erro: "Cabeçalho inválido" });
      return;
    }

    const todosErros = dados.flatMap((item, index) => validarLinha(item, index));

    if (todosErros.length > 0) {
      setErros(todosErros);
      setResultado({ erro: "Erros de validação encontrados" });
      Swal.fire({
        title: "Erros de Validação",
        html: `
          <div style="text-align:left; max-height:300px; overflow-y:auto; font-size:14px">
            <ul style="padding-left:16px">${todosErros.join("")}</ul>
          </div>
        `,
        icon: "warning",
        customClass: { container: "custom-swal" },
      });
      return;
    }

    setDadosValidos(dados);
    setResultado({ total: dados.length });
    setProntoParaImportar(true);
  };

  const processarArquivo = async (file) => {
    const extensao = file.name.split(".").pop().toLowerCase();
    const extensoesPermitidas = ["csv", "xls", "xlsx"];

    if (!extensoesPermitidas.includes(extensao)) {
      setResultado({ erro: "Formato inválido" });
      return;
    }

    try {
      setArquivo(file);

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const primeiraAba = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[primeiraAba];

      const dados = XLSX.utils.sheet_to_json(worksheet, {
        defval: "",
        raw: false,
      });

      const dadosFiltrados = dados.filter((item) =>
        Object.values(item).some((v) => v !== "" && v !== null && v !== undefined)
      );

      if (dadosFiltrados.length > LIMITE_LINHAS) {
        setResultado({ erro: `Máximo permitido: ${LIMITE_LINHAS} linhas` });
        return;
      }

      validarLista(dadosFiltrados);

    } catch (error) {
      console.error(error);
      setResultado({ erro: "Erro ao processar arquivo" });
    }
  };

  const onImportarArquivo = async () => {
    if (optionsModulos[0]?.ALTERAR == "False") {
      Swal.fire({
        title: "Acesso Negado",
        text: "Usuário não tem permissão para cadastrar",
        icon: "error",
        timer: 3000,
        customClass: { container: "custom-swal" },
      });
      return;
    }

    try {
      setLoading(true);

      for (const item of dadosValidos) {
        const payload = {
          NUNCM: Number(item.NUNCM),
          EX: String(item.EX || ""),
          TIPO: Number(item.TIPO),
          DSNCM: String(item.DSNCM || ""),
          IMPNACIONAL: Number(item.IMPNACIONAL || 0),
          IMPIMPORTACAOFEDERAL: Number(item.IMPIMPORTACAOFEDERAL || 0),
          IMPESTADUAL: Number(item.IMPESTADUAL || 0),
          IMPMUNICIPAL: Number(item.IMPMUNICIPAL || 0),
          DTINICIOVIGENCIA: formatarDataExcel(item.DTINICIOVIGENCIA),
          DTFIMVIGENCIA: formatarDataExcel(item.DTFIMVIGENCIA),
          PWCHAVE: String(item.PWCHAVE || ""),
          NUVERSAO: String(item.NUVERSAO || ""),
          FONTE: String(item.FONTE || ""),
          SGUF: String(item.SGUF || ""),
          PERCIBPT: Number(item.PERCIBPT || 0),
        };

        await post("/cadastrar-ncm-excecao", payload);
      }

      Swal.fire({
        title: "Sucesso",
        text: "Importação realizada com sucesso",
        icon: "success",
        timer: 3000,
        customClass: { container: "custom-swal" },
      });

      const ipUsuario = await getIPUsuario();

      await post("/log-web", {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: "CONTABILIDADE/CADASTRAR NCM EXCECAO",
        DADOS: JSON.stringify(dadosValidos),
        IP: ipUsuario || "INDISPONIVEL",
      });

      setArquivo(null);
      setResultado(null);
      setDadosValidos([]);
      setErros([]);
      setProntoParaImportar(false);

      handleClose();
      refetchNcmExcecao();

    } catch (error) {
      console.error("Erro onImportarArquivo:", error);

      const ipUsuario = await getIPUsuario();

      await post("/log-web", {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: "CONTABILIDADE/ERRO CADASTRAR NCM EXCECAO",
        DADOS: JSON.stringify(dadosValidos),
        IP: ipUsuario || "INDISPONIVEL",
      });

      Swal.fire({
        title: "Erro ao Cadastrar",
        text: error?.response?.data?.message || "Erro ao Tentar Cadastrar",
        icon: "error",
        timer: 3000,
        customClass: { container: "custom-swal" },
      });

    } finally {
      setLoading(false);
    }
  };

  return {
    arquivo,
    dragging,
    resultado,
    erros,
    dadosValidos,
    loading,
    prontoParaImportar,
    inputRef,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFileChange,
    baixarModelo,
    onImportarArquivo,
  };
};