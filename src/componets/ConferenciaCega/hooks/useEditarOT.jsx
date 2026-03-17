import Swal from "sweetalert2";
import { useQuery } from "react-query";
import { useState, useEffect } from "react";
import { get, post, put } from "../../../api/funcRequest";

export const useEditarOT = ({
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


  const { data: dadosProdutos = [], isLoading: isLoadingProdutos } = useQuery(
    ['listaProdutos', produto, empresaOrigem?.value],
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
              QTDAJUSTE: (atualizado[index].QTDAJUSTE || 0) + 1
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
            QTDRECEPCAO: 0,
            QTDDIFERENCA: 0,
            QTDAJUSTE: 1,
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
        customClass: {
          container: 'custom-swal',
        }
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

    const dadosdetalheot = dadosProdutosTabela.map(item => {
      const nQtdAjuste = parseInt(item.QTDAJUSTE || 0);

      return {
        IDPRODUTO: item.IDPRODUTO,
        QTDEXPEDICAO: 0,
        QTDRECEPCAO: 0,
        QTDDIFERENCA: 0,
        QTDAJUSTE: nQtdAjuste,
        VLRUNITVENDA: item.VLRUNITVENDA,
        VLRUNITCUSTO: item.VLRUNITCUSTO,
        STCONFERIDO: 'True',
        IDUSRAJUSTE: usuarioLogado?.id,
        STATIVO: 'True',
        STFALTA: nQtdAjuste > 0 ? 'True' : 'False',
        STSOBRA: nQtdAjuste < 0 ? 'True' : 'False',
      };
    });

    const putData = {
      dadosdetalheot,
      IDSTATUSOT: 7,
      IDRESUMOOT: idResumoOT,
    };


    try {

      const response = await put('/resumo-ordem-transferencia/:id', putData);

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/ OT ATUALIZADA COM SUCESSO';
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
      const textDados = JSON.stringify(putData);
      let textoFuncao = 'CONFERENCIA CEGA/ERRO AO ATUALIZAR OT COM SUCESSO';
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
    quantidadeAjuste,
    setQuantidadeAjuste,
    handleChangeQtdAjuste,
    handleExcluirProduto,
    onSubmit,
  }
};