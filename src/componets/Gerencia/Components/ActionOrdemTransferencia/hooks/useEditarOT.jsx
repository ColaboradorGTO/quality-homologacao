import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { get, post, put } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";

export const useEditarOT = ({
  dadosDetalheTransferencia,
  handleClick,
  handleClose,
  optionsModulos,
  usuarioLogado,
  setDadosDetalheTransferencia
}) => {
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [produto, setProduto] = useState('')
  const [dataEntrega, setDataEntrega] = useState('')
  const [dataCadastro, setDataCadastro] = useState('')
  const [quantidade, setQuantidade] = useState('')
  const [observacao, setObservacao] = useState('')
  const [linhaSelecionada, setLinhaSelecionada] = useState(null)
  const [ipUsuario, setIpUsuario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
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


  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataCadastro(dataAtual);

    if (dadosDetalheTransferencia && dadosDetalheTransferencia.length > 0) {
      setEmpresaOrigem(dadosDetalheTransferencia[0]?.IDEMPRESAORIGEM);
      setEmpresaDestino(dadosDetalheTransferencia[0]?.IDEMPRESADESTINO);
    }

  }, []);

  const { data: dadosEmpresa = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: dadosProdutos = [] } = useQuery(
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


  const onSubmit = async () => {
    if (dadosProdutos.length > 200) {
      Swal.fire({
        title: 'Atenção!',
        icon: 'warning',
        text: 'A OT não pode conter mais de 200 tipos de produtos!',
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }

    const dadosdetalheot = dadosDetalheTransferencia.map(item => ({
      IDPRODUTO: String(item.IDPRODUTO ?? ""),
      QTDEXPEDICAO: Number(item.QTDEXPEDICAO) || 0, 
      QTDRECEPCAO: 0,
      QTDDIFERENCA: 0,
      QTDAJUSTE: 0,
      VLRUNITVENDA: Number(item.VLRUNITVENDA) || 0,
      VLRUNITCUSTO: Number(item.VLRUNITCUSTO) || 0,
      STCONFERIDO: "False",
      IDUSRAJUSTE: 0,
      STATIVO: "True",
      STFALTA: "False",
      STSOBRA: "False"
    }));

    const nCtTotalItens = dadosdetalheot.length;
    const nQtdTotalItens = dadosdetalheot.reduce((acc, item) => acc + (Number(item.QTDEXPEDICAO) || 0),0);
    const dVlrTotalVenda = dadosdetalheot.reduce((acc, item) => acc + ((Number(item.QTDEXPEDICAO) || 0) * (Number(item.VLRUNITVENDA) || 0)),0);
    const dVlrTotalCusto = dadosdetalheot.reduce((acc, item) => acc + ((Number(item.QTDEXPEDICAO) || 0) * (Number(item.VLRUNITCUSTO) || 0)),0);

    const postData = {
      IDRESUMOOT: Number(dadosDetalheTransferencia?.[0]?.IDRESUMOOT),
      IDEMPRESAORIGEM: Number(dadosDetalheTransferencia?.[0]?.IDEMPRESAORIGEM),
      IDSTATUSOT: 1,
      NUTOTALITENS: nCtTotalItens,
      QTDTOTALITENS: nQtdTotalItens,
      VRTOTALCUSTO: Number(dVlrTotalCusto) || 0,
      VRTOTALVENDA: Number(dVlrTotalVenda) || 0,
      DSOBSERVACAO: "Ajuste de itens e valores antes da emissão.",
      dadosdetalheot
    };

    /*  const postData = {
       IDRESUMOOT: dadosDetalheTransferencia[0]?.IDRESUMOOT,
       IDEMPRESAORIGEM: dadosDetalheTransferencia[0]?.IDEMPRESAORIGEM,
       IDSTATUSOT: parseInt(1),
       IDEMPRESADESTINO: dadosDetalheTransferencia[0]?.IDEMPRESADESTINO,
       IDOPERADOREXPEDICAO: usuarioLogado?.id,
       NUTOTALITENS: nCtTotalItens,
       QTDTOTALITENS: nQtdTotalItens,
       VRTOTALCUSTO: Number(dVlrTotalCusto),
       VRTOTALVENDA: Number(dVlrTotalVenda),    
       DSOBSERVACAO: "teste front", 
       dadosdetalheot: dadosdetalheot,                
       QTDTOTALITENSAJUSTE: 0,
       QTDTOTALITENSRECEPCIONADO: 0,
       QTDTOTALITENSDIVERGENCIA: 0,
       NUTOTALVOLUMES: 0, 
       TPVOLUME: "",
       DTRECEPCAO: "",
       IDOPERADORRECEPTOR: 0,
       IDUSRCANCELAMENTO: 0,
       IDSTDIVERGENCIA: 0,
       OBSDIVERGENCIA: "",
       STEMISSAONFE: "False",
       NUMERONFE: "",
       STENTRADAINVENTARIO: "False",
       QTDCONFERENCIA: 0,
       IDUSRAJUSTE: 0,
       DTAJUSTE: "",
       DATAEXPEDICAO: "",
       DTULTALTERACAO: "",
       STFALTA :"False",
       STSOBRA: "False"
     }; */

    try {

      const response = await put('/resumo-ordem-transferencia/:id', postData);

      const textDados = JSON.stringify(postData);
      let textoFuncao = 'GERENCIA/EDIÇÃO OT';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'OT Alterada com Sucesso',
        icon: 'success'
      });

      handleClick();
      handleClose();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData);
      let textoFuncao = 'GERENCIA/ERRO AO EDITAR OT';
      const ipUsuario = await getIPUsuario();
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado?.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      };

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Erro',
        text: 'Ocorreu um erro ao alterar os dados da OT!',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      handleClose();
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
    linhaSelecionada,
    setLinhaSelecionada,
    dadosEmpresa,
    dadosProdutos,
    onSubmit,
  };
};

