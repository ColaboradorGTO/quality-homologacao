import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { get, post, put } from "../../../api/funcRequest";
import { useQuery } from "react-query";

export const useEditarOT = ({
  handleClose,
  optionsModulos,
  usuarioLogado,
  refetchListaConferencia,
  dadosDetalheTransferencia,
  setDadosDetalheTransferencia

}) => {
  const [empresaOrigem, setEmpresaOrigem] = useState('')
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
      IDRESUMOOT: item.IDRESUMOOT,
      IDSTATUSOT: item.IDSTATUSOT
    }));

    setDadosProdutosTabela(produtos);

    setQuantidade(200)
    setDataEntrega(cabecalho.DTCADASTRO);
    setDataCadastro(cabecalho.DTCADASTRO);
    setObservacao(cabecalho.DSOBSERVACAO);
    setIdResumoOT(cabecalho.IDRESUMOOT);
  }, [dadosDetalheTransferencia]);


  const handleChangeQtdAjuste = (idProduto, novoValor) => {
    setDadosProdutosTabela(prev =>
      prev.map(item =>
        item.IDPRODUTO === idProduto
          ? { ...item, QTDEXPEDICAO: parseInt(novoValor) || 0 }
          : item
      )
    );
  };

  const handleExcluirProduto = async (produto) => {

    const idOT = produto.IDRESUMOOT || idResumoOT;

    if (produto.QTDEXPEDICAO === 0) {
      const result = await Swal.fire({
        title: 'Atenção',
        text: 'Deseja excluir esse produto da O.T.?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sim, excluir',
        cancelButtonText: 'Cancelar',
        customClass: {
          container: 'custom-swal'
        }
      })

      if (!result.isConfirmed) {
        return;
      }

      const putDataExcluir = {
        IDPRODUTO: produto.IDPRODUTO,
        IDSTATUSOT: 5,
        IDRESUMOOT: idOT,
      }

      try {
        const response = await put('/resumo-ordem-transferencia-cega/:id', putDataExcluir);

        setDadosProdutosTabela(prev =>
          prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
        );

        const textDados = JSON.stringify(putDataExcluir);
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
          text: 'Produto excluído com sucesso.',
          icon: 'success',
          customClass: { container: 'custom-swal' }
        });

        handleClose();
        refetchListaConferencia()

        return response.data;
      } catch (error) {

        console.error('Erro ao cadastrar OT:', error);
        const textDados = JSON.stringify(putDataExcluir);
        let textoFuncao = 'CONFERENCIA CEGA/ERRO AO EXCLUIR OT COM SUCESSO';
        const ipUsuario = await getIPUsuario();

        const createData = {
          IDFUNCIONARIO: String(usuarioLogado?.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario || "INDISPONÍVEL"
        };

        const responsePost = await post('/log-web', createData)

        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao excluir produto.',
          icon: 'error',
          customClass: {
            container: 'custom-swal'
          }
        });
        return responsePost.data;

      }

    } else {
      handleChangeQtdAjuste(produto.IDPRODUTO, 0);
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
              QTDEXPEDICAO: novos[index].QTDEXPEDICAO + 1
            };
          } else {
            novos.push({
              IDPRODUTO: novo.IDPRODUTO,
              NUCODBARRAS: novo.NUCODBARRAS,
              DSNOME: novo.DSNOME,

              VLRUNITVENDA: Number(novo.PRECOVENDA || 0),
              VLRUNITCUSTO: Number(novo.PRECOCUSTO || 0),

              QTDEXPEDICAO: 1,
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

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro!',
        text: `${usuarioLogado?.NOFUNCIONARIO},\nVocê não tem permissão para criar a OT!`,
        icon: 'error',
        customClass: {
          container: 'custom-swal',
        }
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
        customClass: {
          container: 'custom-swal'
        }
      });
      return;
    }

    let nCtTotalItens = 0;
    let nQtdTotalItens = 0;
    let dVlrTotalVenda = 0;
    let dVlrTotalCusto = 0;

    const dadosdetalheot = dadosProdutosTabela.map((item) => {
      const nQtdProduto = parseInt(item.QTDEXPEDICAO || 0);
      const nVlrVenda = parseFloat(item.PRECOVENDA || 0);
      const nVlrCusto = parseFloat(item.PRECOCUSTO || 0);

      nCtTotalItens++;
      nQtdTotalItens += nQtdProduto;
      dVlrTotalVenda += nQtdProduto * nVlrVenda;
      dVlrTotalCusto += nQtdProduto * nVlrCusto;

      return {
        IDPRODUTO: item.IDPRODUTO,
        QTDEXPEDICAO: nQtdProduto,
        QTDRECEPCAO: 0,
        QTDDIFERENCA: 0,
        QTDAJUSTE: 0,
        VLRUNITVENDA: nVlrVenda,
        VLRUNITCUSTO: nVlrCusto,
        STCONFERIDO: 'False',
        IDUSRAJUSTE: 0,
        STATIVO: 'True',
        STFALTA: 'False',
        STSOBRA: 'False',
      };
    });

    const putData = {
      IDRESUMOOT: idResumoOT,
      IDEMPRESAORIGEM: empresaOrigem?.value,
      IDEMPRESADESTINO: empresaDestino?.value,
      DATAEXPEDICAO: "",
      IDOPERADOREXPEDICAO: usuarioLogado?.id,
      NUTOTALITENS: nCtTotalItens,
      QTDTOTALITENS: nQtdTotalItens,
      QTDTOTALITENSRECEPCIONADO: 0,
      QTDTOTALITENSDIVERGENCIA: 0,
      NUTOTALVOLUMES: 0,
      TPVOLUME: "",
      VRTOTALCUSTO: dVlrTotalCusto,
      VRTOTALVENDA: dVlrTotalVenda,
      DTRECEPCAO: "",
      IDOPERADORRECEPTOR: 0,
      DSOBSERVACAO: observacao,
      IDUSRCANCELAMENTO: 0,
      DTULTALTERACAO: "",
      IDSTDIVERGENCIA: 0,
      OBSDIVERGENCIA: "",
      STEMISSAONFE: "False",
      NUMERONFE: "",
      STENTRADAINVENTARIO: "False",
      QTDCONFERENCIA: 0,
      dadosdetalheot,
      IDSTATUSOT: 1,
      IDUSRAJUSTE: 0,
      DTAJUSTE: "",
      QTDTOTALITENSAJUSTE: 0,

    };

    try {
      const response = await put('/resumo-ordem-transferencia/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'EXPEDICAO/CRIADO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONIVEL"
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'OT cadastrada com Sucesso',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        },
      });

      handleClose();
      refetchListaConferencia();

      return response.data;
    }
    catch (error) {

      console.error('Erro ao cadastrar OT:', error);
      const textDados = JSON.stringify(putData);
      let textoFuncao = 'EXPEDICAO/ERRO AO CRIAR OT COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      };

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao Salvar a OT.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          container: 'custom-swal',
        },
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
    setDadosProdutosTabela,
    setLinhaSelecionada,
    handleExcluirProduto,
    handleChangeQtdAjuste,
    onSubmit,
  };
};

