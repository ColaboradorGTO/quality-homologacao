import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { get, post, put } from "../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";

export const useConferirItemsOT = ({
  handleClose,
  optionsModulos,
  usuarioLogado,
  refetchListaConferencia,
  dadosDetalheTransferencia,
  setDadosDetalheTransferencia,
  setModalConferirItemsModal,
  

}) => {
  const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [visualizarModalVolume, setVisualizarModalVolume] = useState(false)
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [dataCadastro, setDataCadastro] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [idResumoOT, setIdResumoOT] = useState('');
  const [dadosProdutosTabela, setDadosProdutosTabela] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null)

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
      QTDCONFERIDA: parseInt(item.QTDCONFERIDA),
      IDRESUMOOT: item.IDRESUMOOT,
      IDSTATUSOT: item.IDSTATUSOT
    }));

    setDadosProdutosTabela(produtos);

    setDataCadastro(cabecalho.DTCADASTRO);
    setObservacao(cabecalho.DSOBSERVACAO);
    setIdResumoOT(cabecalho.IDRESUMOOT);
  }, [dadosDetalheTransferencia]);



  const handleConferirItems = async () => {
    const idOT = dadosDetalheTransferencia.IDRESUMOOT || idResumoOT;

    let lValidaConf = 'False';
    let nQtdTotalConferida = 0;

    const dadosdetalheot = dadosDetalheTransferencia.map((item) => {
      const nQtdExpedicao = parseInt(item.QTDEXPEDICAO || 0);
      const nQtdConferida = parseInt(item.QTDCONFERENCIA || 0);

      if (nQtdExpedicao !== nQtdConferida) {
        lValidaConf = 'True';
      }

      const qtdFinal = nQtdExpedicao !== nQtdConferida ? 0 : nQtdConferida;
      nQtdTotalConferida += qtdFinal;

      return {
        IDPRODUTO: item.IDPRODUTO,
        QTDCONFERIDA: qtdFinal,
      };
    });

    if (lValidaConf === 'True') {
      const result = await Swal.fire({
        title: 'Atenção',
        text: 'Existem Diferenças na Conferência dos Itens! Deseja Realmente Continuar?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim',
        cancelButtonText: 'Cancelar',
        customClass:
        {
          container: 'custom-swal'
        },
      });

      if (!result.isConfirmed) return;
    }

    const putData = {
      IDPRODUTO: produto.IDPRODUTO,
      IDSTATUSOT: 12,
      IDRESUMOOT: idOT,
      IDUSRCONFERIDADO: String(usuarioLogado?.id),
      LVALIDACONF: lValidaConf,
      QTDTOTALCONFERIDA: nQtdTotalConferida,
      dadosdetalheot,
    };

    try {
      const response = await put('/resumo-ordem-transferencia-cega/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/PRODUTO EXCLUIDO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      await post('/log-web', createData)

      if (lValidaConf === 'True') {
        Swal.fire({
          title: 'Divergência na Conferência!',
          text: 'A conferência foi finalizada com divergências.',
          icon: 'warning',
          customClass:
          {
            container: 'custom-swal'
          },
        });

        handleClose();
        refetchListaConferencia();

      } else {
        await Swal.fire({
          title: 'Sucesso!',
          text: 'Conferência finalizada com sucesso.',
          icon: 'success',
          timer: 1000,
          showConfirmButton: false,
          customClass:
          {
            container: 'custom-swal'
          },
        })
        //setModalConferirItemsModal(false);
        setVisualizarModalVolume(true);

      }

      return response.data;

    } catch (error) {
      console.error('Erro ao finalizar conferência:', error);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/PRODUTO EXCLUIDO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Erro!',
        text: 'Erro ao finalizar a conferência.',
        icon: 'error',
        customClass: { container: 'custom-swal' },
      });
    }
  };

  const { data: dadosProdutosDeposito = [] } = useQuery(
    ['listaProdutos', produto],
    async () => {
      const response = await get(
        `/listaProdutos?idEmpresa=${usuarioLogado?.IDEMPRESA}&idProduto=${produto}&page=1`
      );

      setDadosDetalheTransferencia(prev => {
        const novos = [...prev];

        response.data.forEach(novo => {
          const index = novos.findIndex(p => p.IDPRODUTO === novo.IDPRODUTO);

          if (index >= 0) {
            novos[index] = {
              ...novos[index],
              QTDCONFERENCIA: novos[index].QTDCONFERENCIA + 1
            };
          } else {
            novos.push({
              IDPRODUTO: novo.IDPRODUTO,
              NUCODBARRAS: novo.NUCODBARRAS,
              DSNOME: novo.DSNOME,

              VLRUNITVENDA: Number(novo.PRECOVENDA || 0),
              VLRUNITCUSTO: Number(novo.PRECOCUSTO || 0),

              QTDCONFERENCIA: 1,
              QTDRECEPCAO: 0,
              QTDDIFERENCA: 0,
              QTDAJUSTE: 0,
              IDSTATUSOT: 1
            });
          }
        });

        return novos;
      });

      setProduto("");
      return response.data;
    },
    {
      enabled: Boolean(produto && produto.length > 8)
    }
  );

  useEffect(() => {
    if (produto.length > 4 && empresaDestino <= 0) {
      Swal.fire({
        title: 'A Loja de Origem e Destino devem ser Preenchidas!',
        icon: 'info',
        confirmButtonText: 'Ok',
        customClass: {
          container: 'custom-swal',
        }
      });
      setProduto("");
      return;
    }
  }, [produto, empresaDestino]);

  useEffect(() => { }, [])


  const salvarConferirItems = async () => {
    if (optionsModulos[0]?.CRIAR === 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para salvar a conferência!`,
        icon: 'error',
        customClass: { container: 'custom-swal' },
      });
      return;
    }

    if (dadosProdutosTabela.length === 0 || dadosProdutosTabela.length > 200) {
      Swal.fire({
        title: 'Atenção!',
        text: dadosProdutosTabela.length === 0
          ? 'Informar os produtos da OT!'
          : 'A OT não pode conter mais de 200 tipos de produtos!',
        icon: 'warning',
        customClass: { container: 'custom-swal' },
      });
      return;
    }

    let nQtdTotalConferida = 0;

    const dadosdetalheot = dadosProdutosTabela.map((item) => {
      const nQtdConferida = parseInt(item.QTDCONFERIDA || 0);
      nQtdTotalConferida += nQtdConferida;

      return {
        IDPRODUTO: item.IDPRODUTO,
        QTDCONFERIDA: nQtdConferida,
      };
    });

    const putData = {
      IDRESUMOOT: idResumoOT,
      IDSTATUSOT: 11,
      QTDTOTALCONFERIDA: nQtdTotalConferida,
      IDUSRCONFERIDA: String(usuarioLogado?.id),
      dadosdetalheot,
    };

    try {
      const response = await put('/resumo-ordem-transferencia/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/PRODUTO EXCLUIDO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Sucesso!',
        text: 'Conferência salva com sucesso.',
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
      let textoFuncao = 'CONFERENCIA CEGA/PRODUTO EXCLUIDO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Erro!',
        text: 'Ocorreu um erro ao salvar a conferência.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { container: 'custom-swal' },
      });
    }
  };

  return {
    empresaOrigem,
    setEmpresaOrigem,
    empresaDestino,
    setEmpresaDestino,
    produto,
    setProduto,
    dataEntrega,
    setDataEntrega,
    quantidade,
    setQuantidade,
    observacao,
    setObservacao,
    usuarioLogado,
    linhaSelecionada,
    dadosEmpresa,
    dadosProdutosTabela,
    visualizarModalVolume,
    setVisualizarModalVolume,
    setDadosProdutosTabela,
    setLinhaSelecionada,
    handleConferirItems,
    salvarConferirItems,
  };
};






