import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getDataAtual } from "../../../utils/dataAtual";
import { post } from "../../../api/funcRequest";

export const useSalvarOT = () => {
    const [ajusteQuantidade, setAjusteQuantidade] = useState(0)
    const [empresaOrigem, setEmpresaOrigem] = useState('')
    const [empresaDestino, setEmpresaDestino] = useState('')
    const [produto, setProduto] = useState('')
    const [dataEntrega, setDataEntrega] = useState('')
    const [dataCadastro, setDataCadastro] = useState('')
    const [quantidade, setQuantidade] = useState('')
    const [observacao, setObservacao] = useState('')
    const [linhaSelecionada, setLinhaSelecionada] = useState(null)
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const navigate = useNavigate();

  useEffect(() => {
    const dataAtual = getDataAtual();
    setDataCadastro(dataAtual);

    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);


  const onSubmit = async () => {
    
    const postData = {
        IDEMPRESAORIGEM: empresaOrigem,
        IDEMPRESADESTINO: empresaDestino,
        DATAEXPEDICAO: "",
        IDOPERADOREXPEDICAO: usuarioLogado.id,
        NUTOTALITENS: nCtTotalItens,
        QTDTOTALITENS: nQtdTotalItens,
        QTDTOTALITENSRECEPCIONADO: 0,
        QTDTOTALITENSDIVERGENCIA: 0,
        NUTOTALVOLUMES: 0,
        TPVOLUME: "",
        VRTOTALCUSTO: 0,
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
        IDRESUMOOT: parseInt(nIdResumoOT),
        IDSTATUSOT: parseInt(1),
        IDUSRAJUSTE: 0,
        DTAJUSTE: "",
        QTDTOTALITENSAJUSTE: 0,
        CONFEREITENS: 'False',
        IDROTINA: 1,
        DATAENTREGA: dataEntrega
    };
    const response = await post('/criar-resumo-ordem-transferencia', postData);

    const textDados = JSON.stringify(postData);
    let textoFuncao = 'EXPEDICAO/CRIADO COM SUCESSO';

    const createData = {
      IDFUNCIONARIO: usuarioLogado.id,
      PATHFUNCAO: textoFuncao,
      DADOS: textDados,
      IP: ipUsuario
    };

    const responsePost = await post('/log-web', createData)
      .catch(error => {
        Swal.fire({
          title: 'Cadastro',
          text: 'Depósito cadastrado com Sucesso',
          icon: 'success'
        });
        console.error('Erro ao Tentar Cadastrar Depósito: ', error);
      });
    handleClose();
    return responsePost.data;
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
    setUsuarioLogado,
    linhaSelecionada,
    setLinhaSelecionada,
    onSubmit,
  };
};

// IDPRODUTO: cIdProduto,
// QTDEXPEDICAO: nQtdProduto,
// QTDRECEPCAO: 0,
// QTDDIFERENCA: 0,
// QTDAJUSTE: 0,
// VLRUNITVENDA: nVlrVenda,
// VLRUNITCUSTO: 0,
// STCONFERIDO: 'False',
// IDUSRAJUSTE: 0,
// STATIVO: 'True',
// STFALTA: 'False',
// STSOBRA: 'False',