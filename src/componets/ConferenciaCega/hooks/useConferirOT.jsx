import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { get, post, put } from "../../../api/funcRequest";

export const useConferirOT = ({
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
  dadosDetalheTransferencia,

}) => {

  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [quantidadeAjuste, setQuantidadeAjuste] = useState(0)
  const [dadosProdutosTabela, setDadosProdutosTabela] = useState([]);
  const [produtoSalvo, setProdutoSalvo] = useState([]);
  const [idResumoOT, setIdResumoOT] = useState('');
  const [observacao, setObservacao] = useState('')

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

  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  useEffect(() => {
    if (!dadosDetalheTransferencia || dadosDetalheTransferencia.length === 0) return;

    const cabecalho = dadosDetalheTransferencia[0];

    setEmpresaOrigem({
      value: cabecalho.IDEMPRESAORIGEM,
      label: cabecalho.EMPRESAORIGEM
    });

    setEmpresaDestino({
      value: cabecalho.IDEMPRESADESTINO,
      label: cabecalho.EMPRESADESTINO
    });

    setIdResumoOT(cabecalho.IDRESUMOOT);

    const produtos = dadosDetalheTransferencia.map(item => ({
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      VLRUNITCUSTO: parseFloat(item.VLRUNITCUSTO),
      VLRUNITVENDA: parseFloat(item.VLRUNITVENDA),
      QTDEXPEDICAO: parseInt(item.QTDEXPEDICAO),
      QTDRECEPCAO: parseInt(item.QTDRECEPCAO),
      QTDDIFERENCA: parseInt(item.QTDDIFERENCA),
      QTDAJUSTE: parseInt(item.QTDAJUSTE),
      QTDTOTALITENS: parseInt(item.QTDTOTALITENS),
      IDRESUMOOT: item.IDRESUMOOT,
      IDSTATUSOT: item.IDSTATUSOT
    }));

    setDadosProdutosTabela(produtos);

  }, [dadosDetalheTransferencia]);

  const handleChangeQtdAjuste = (idProduto, novoValor) => {
    setDadosProdutosTabela(prev =>
      prev.map(item =>
        item.IDPRODUTO === idProduto
          ? { ...item, QTDAJUSTE: parseInt(novoValor) || 0 }
          : item
      )
    );
  };

  const handleDiminuirProduto = (produto) => {
    const itemAtual = dadosProdutosTabela.find(
      item => item.IDPRODUTO === produto.IDPRODUTO
    );
    if (!itemAtual) return;

    if (itemAtual.QTDRECEPCAO <= 1) {
      if (itemAtual.QTDEXPEDICAO === 0) {
        setDadosProdutosTabela(prev =>
          prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
        );
      } else {
        setDadosProdutosTabela(prev =>
          prev.map(item =>
            item.IDPRODUTO === produto.IDPRODUTO
              ? { ...item, QTDRECEPCAO: 0 }
              : item
          )
        );
      }
      return;
    }

    setDadosProdutosTabela(prev =>
      prev.map(item =>
        item.IDPRODUTO === produto.IDPRODUTO
          ? { ...item, QTDRECEPCAO: item.QTDRECEPCAO - 1 }
          : item
      )
    );
  };

  const handleExcluirProduto = async (produto) => {
    const idOT = produto.IDRESUMOOT || idResumoOT;

    if (produto.QTDEXPEDICAO === 0) {
      const putDataExcluir = {
        IDPRODUTO: produto.IDPRODUTO,
        IDSTATUSOT: 5,
        IDRESUMOOT: idOT,
      };

      try {
        const response = await put('/resumo-ordem-transferencia-cega/:id', putDataExcluir);

        setDadosProdutosTabela(prev =>
          prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
        );

        const textDados = JSON.stringify(putDataExcluir);
        let textoFuncao = 'DEPOSITO/CONFERENCIA PRODUTO EXCLUIDO COM SUCESSO';
        const ipUsuario = await getIPUsuario();

        const createData = {
          IDFUNCIONARIO: String(usuarioLogado?.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario || "INDISPONÍVEL"
        };

        await post('/log-web', createData);

        Swal.fire({
          title: 'Sucesso!',
          text: 'Produto excluído com sucesso.',
          icon: 'success',
          customClass: { container: 'custom-swal' }
        });

        return response.data;

      } catch (error) {
        const textDados = JSON.stringify(putDataExcluir);
        let textoFuncao = 'DEPOSITO/CONFERENCIA ERRO AO EXCLUIR PRODUTO';
        const ipUsuario = await getIPUsuario();

        const createData = {
          IDFUNCIONARIO: String(usuarioLogado?.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario || "INDISPONÍVEL"
        };

        const responsePost = await post('/log-web', createData);

        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao excluir produto.',
          icon: 'error',
          customClass: { container: 'custom-swal' }
        });

        return responsePost.data;
      }

    } else {
      setDadosProdutosTabela(prev =>
        prev.map(item =>
          item.IDPRODUTO === produto.IDPRODUTO
            ? { ...item, QTDRECEPCAO: 0 }
            : item
        )
      );
    }
  };

  const { data: dadosProdutos = [], isLoading: isLoadingProdutos } = useQuery(
    ['listaProdutosConferir', produto, empresaOrigem?.value],
    async () => {
      const response = await get(
        `/listaProdutos?idEmpresa=${empresaOrigem?.value}&idProduto=${produto}&page=1`
      );

      if (response.data?.length > 0) {
        const novo = response.data[0];

        setDadosProdutosTabela(prev => {
          const index = prev.findIndex(p => p.IDPRODUTO === novo.IDPRODUTO);

          if (index >= 0) {
            const atualizado = [...prev];
            atualizado[index] = {
              ...atualizado[index],
              QTDRECEPCAO: (atualizado[index].QTDRECEPCAO || 0) + 1
            };
            return atualizado;
          }

          return [...prev, {
            IDPRODUTO: novo.IDPRODUTO,
            NUCODBARRAS: novo.NUCODBARRAS,
            DSNOME: novo.DSNOME,
            VLRUNITCUSTO: parseFloat(novo.PRECOCUSTO),
            VLRUNITVENDA: parseFloat(novo.PRECOVENDA),
            QTDEXPEDICAO: 0,
            QTDRECEPCAO: 1,
            QTDDIFERENCA: 0,
            QTDAJUSTE: 0,
            IDRESUMOOT: idResumoOT,
            IDSTATUSOT: dadosProdutosTabela[0]?.IDSTATUSOT
          }];
        });
      }

      setProduto('');
      return response.data;
    },
    {
      enabled: !!(
        produto.length > 8 &&
        empresaOrigem?.value
      )
    }
  );

  useEffect(() => {
    if (produto.length > 4 && empresaDestino <= 0) {
      Swal.fire({
        title: 'A Loja de Origem e Destino devem ser Preenchidas!',
        icon: 'info',
        confirmButtonText: 'Ok',
        customClass: { container: 'custom-swal' }
      });
      setProduto("");
      return;
    }
  }, [produto, empresaDestino]);

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar a OT!`,
        icon: 'error',
        customClass: { container: 'custom-swal' }
      });
      return;
    }

    if (dadosProdutosTabela.length === 0 || dadosProdutosTabela.length > 200) {
      const msg = dadosProdutosTabela.length === 0
        ? 'Informar os produtos da OT!'
        : 'A OT não pode conter mais de 200 tipos de produtos!';

      Swal.fire({
        title: 'Atenção!',
        text: msg,
        icon: 'warning',
        customClass: { container: 'custom-swal' }
      });
      return;
    }

    let nQtdTotalItens = 0;

    const dadosdetalheot = dadosProdutosTabela.map(item => {
      const nQtdProduto = parseInt(item.QTDRECEPCAO || 0);
      const nVlrVenda = parseFloat(item.VLRUNITVENDA || 0);
      const nVlrCusto = parseFloat(item.VLRUNITCUSTO || 0);

      nQtdTotalItens += nQtdProduto;

      return {
        IDPRODUTO: item.IDPRODUTO,
        QTDEXPEDICAO: 0,
        QTDRECEPCAO: nQtdProduto,
        QTDDIFERENCA: 0,
        QTDAJUSTE: 0,
        VLRUNITVENDA: nVlrVenda,
        VLRUNITCUSTO: nVlrCusto,
        STCONFERIDO: 'True',
        IDUSRAJUSTE: 0,
        STATIVO: 'True',
        STFALTA: 'False',
        STSOBRA: 'False',
      };
    });

    const putData = {
      QTDTOTALITENSRECEPCIONADO: nQtdTotalItens,
      DTRECEPCAO: "",
      IDOPERADORRECEPTOR: Number(usuarioLogado?.id),
      DTULTALTERACAO: "",
      dadosdetalheot,
      IDSTATUSOT: 4,
      IDRESUMOOT: idResumoOT,
    };

    try {
      const response = await put('/resumo-ordem-transferencia/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'DEPOSITO/CONFERENCIA OT SALVA COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      await post('/log-web', createData);

      Swal.fire({
        title: 'Sucesso',
        text: 'Recepção Salva com Sucesso!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: { container: 'custom-swal' },
      });

      handleClose();
      refetchListaConferencia();

      return response.data;

    } catch (error) {
      console.error('Erro ao salvar conferência:', error);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'DEPOSITO/ERRO AO SALVAR CONFERENCIA OT';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      const responsePost = await post('/log-web', createData);

      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao Salvar a OT.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { container: 'custom-swal' },
      });

      return responsePost.data;
    }
  };

  return {
    empresaOrigem,
    setEmpresaOrigem,
    empresaDestino,
    setEmpresaDestino,
    produto,
    setProduto,
    dadosEmpresa,
    dadosProdutosTabela,
    setDadosProdutosTabela,
    produtoSalvo,
    setProdutoSalvo,
    quantidadeAjuste,
    setQuantidadeAjuste,
    handleChangeQtdAjuste,
    handleDiminuirProduto,
    handleExcluirProduto,
    onSubmit,
  }
};