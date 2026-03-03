import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { getDataAtual, getHoraAtual } from "../../../../../utils/dataAtual";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";


export const useCadastroDeposito = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
  const [dsHistorio, setDSHistorio] = useState('');
  const [numeroDocDeposito, setNumeroDocDeposito] = useState('');
  const [valorDeposito, setValorDeposito] = useState(0);
  const [contaBancoSelecionada, setContaBancoSelecionada] = useState('');
  const [horarioAtual, setHorarioAtual] = useState('');
  const [dataMovCaixa, setDataMovCaixa] = useState('');
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipUsuario, setIpUsuario] = useState('');

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

  useEffect(() => {
    const dataAtual = getDataAtual()
    const horaAtual = getHoraAtual()
    setData(dataAtual)
    setHora(horaAtual)

  }, []);


  const { data: dadosContaBanco = [], error: errorContaBanco, isLoading: isLoadingContaBanco } = useQuery(
    'contaBanco',
    async () => {
      const response = await get(`/contaBanco`);
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro',
        text: 'Você não tem permissão para cadastrar depósitos.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }


    const putData = {
      IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
      IDUSR: parseInt(usuarioLogado?.id),
      IDCONTABANCO: parseInt(contaBancoSelecionada?.value),
      DTDEPOSITO: data + " " + hora,
      DTMOVIMENTOCAIXA: dataMovCaixa + " " + horarioAtual,
      DSHISTORIO: dsHistorio,
      NUDOCDEPOSITO: numeroDocDeposito,
      VRDEPOSITO: removerFormatacaoMoeda(valorDeposito),
      STATIVO: 'True',
      STCANCELADO: 'False',
    }

    try {

      const response = await post('/cadastrar-deposito-loja', putData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Depósito cadastrado com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      setDSHistorio('');
      setNumeroDocDeposito('');
      setValorDeposito(0);
      setContaBancoSelecionada(null);
      setHorarioAtual('');
      setDataMovCaixa('');


      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/CADASTRO DEPOSITO ';
      const ipUsuario = await getIPUsuario();

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONÍVEL'
      }

      await post('/log-web', postData)

      handleClick();
      handleClose();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(putData)
      let textoFuncao = 'GERENCIA/ERRO AO CADASTRAR DEPOSITO ';
      const ipUsuario = await getIPUsuario();

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'INDISPONÍVEL'
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar Depósito',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      return responsePost.data;
    }

  }

  return {
    dsHistorio,
    setDSHistorio,
    numeroDocDeposito,
    setNumeroDocDeposito,
    valorDeposito,
    setValorDeposito,
    contaBancoSelecionada,
    setContaBancoSelecionada,
    horarioAtual,
    setHorarioAtual,
    hora,
    setHora,
    data,
    setData,
    dataMovCaixa,
    setDataMovCaixa,
    dadosContaBanco,
    onSubmit,
    isSubmitting,
    setIsSubmitting
  }

}