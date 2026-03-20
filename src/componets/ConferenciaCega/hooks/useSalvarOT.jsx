import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { get, post } from "../../../api/funcRequest";

export const useSalvarOT = ({
  handleClose,
  refetchListaConferencia,
  optionsModulos,
  usuarioLogado,
}) => {

  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [ipUsuario, setIpUsuario] = useState('');
  const [dadosProdutosTabela, setDadosProdutosTabela] = useState([]);
  const [produtoSalvo, setProdutoSalvo] = useState([]);
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

  const { data: dadosProdutos = [], isLoading: isLoadingProdutos } = useQuery(
    ['listaProdutos', produto, usuarioLogado?.IDEMPRESA],
    async () => {

      const response = await get(`/listaProdutos?idEmpresa=${usuarioLogado?.IDEMPRESA}&idProduto=${produto}&page=1 `);

      setDadosProdutosTabela(prev => {
        const novos = [...prev];

        response.data.forEach(novo => {
          const index = novos.findIndex(p => p.IDPRODUTO === novo.IDPRODUTO);

          if (index >= 0) {
            novos[index] = {
              ...novos[index],
              QUANTIDADE: (novos[index].QUANTIDADE || 1) + 1
            };
          } else {
            novos.push({
              ...novo,
              QUANTIDADE: 1
            });
          }
        });

        return novos;
      });
      setProduto("");
      return response.data;
    },
    { enabled: !!(produto.length > 8 && empresaDestino?.value && usuarioLogado?.IDEMPRESA) }
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
      const nQtdProduto = parseInt(item.QUANTIDADE || 0);
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
    const postData = {
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
      IDRESUMOOT: 0,
      IDSTATUSOT: 1,
      IDUSRAJUSTE: 0,
      DTAJUSTE: "",
      QTDTOTALITENSAJUSTE: 0,
    };

    try {
      const response = await post('/criar-resumo-ordem-transferencia', postData);

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'EXPEDICAO/CRIADO COM SUCESSO';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
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

    } catch (error) {
      console.error('Erro ao cadastrar OT:', error);

      const textDados = JSON.stringify(postData);
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
  }

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
    onSubmit,
  }
};