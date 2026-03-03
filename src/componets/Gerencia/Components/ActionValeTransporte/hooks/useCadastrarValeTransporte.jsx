import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import axios from "axios";
import { useQuery } from "react-query";
import { getDataAtual, getHoraAtual } from "../../../../../utils/dataAtual";
import { useEffect, useState } from "react";
import { set } from "date-fns";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";

export const useCadastrarValeTransporte = ({ handleClose, usuarioLogado, optionsModulos, refetchDadosLoja }) => {
  const [dsHistorio, setDSHistorio] = useState('');
  const [dsPagoA, setDsPagoA] = useState('');
  const [vrDespesa, setVrDespesa] = useState('');
  const [horarioAtual, setHorarioAtual] = useState('');
  const [dtDespesa, setDtDespesa] = useState('');
  const [usuarioSelecionado, setUsuarioSelecionado] = useState()
  const [ipUsuario, setIpUsuario] = useState('')
  const [empresa, setEmpresa] = useState(usuarioLogado?.NOFANTASIA || '');

  useEffect(() => {
    const hora = getHoraAtual()
    const dataAtual = getDataAtual()
    setDtDespesa(dataAtual)
    setHorarioAtual(hora)
  }, [])

  const { data: dadosFuncionarios = [], error: errorGrupo, isLoading: isLoadingGrupo } = useQuery(
    'todos-funcionario',
    async () => {
      const response = await get(`/todos-funcionario?idEmpresa=${usuarioLogado.IDEMPRESA}`);
      return response.data;
    },
    { enabled: true, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 }
  );

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

  const onSubmit = async (data) => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Você não tem permissão para cadastrar!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 3000,
      })
      return;
    }

    const postData = {
      IDEMPRESA: parseInt(usuarioLogado.IDEMPRESA),
      IDUSR: parseInt(usuarioLogado.id),
      DTDESPESA: dtDespesa + ' ' + horarioAtual,
      IDCATEGORIARECEITADESPESA: 248,
      DSHISTORIO: dsHistorio,
      DSPAGOA: "",
      IDFUNCIONARIO: parseInt(usuarioSelecionado?.value),
      TPNOTA: '',
      NUNOTAFISCAL: '',
      VRDESPESA: removerFormatacaoMoeda(vrDespesa),
      STATIVO: 'True',
      STCANCELADO: 'False'
    }
    try {

      const response = await post('/cadastrar-despesa-loja', postData)
      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE VALE TRANSPORTE';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Cadastro Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      handleClose()
      refetchDadosLoja()
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/ERRO AO CADASTRAR O VALE TRANSPORTE';
      const ipUsuario = await getIPUsuario()

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }

      const responsePost = await post('/log-web', createData)

      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      console.error('Erro ao parsear o usuário do localStorage:', error);
      responsePost.data;
    }

  }

  return {
    onSubmit,
    handleClose,
    dsHistorio,
    setDSHistorio,
    dsPagoA,
    setDsPagoA,
    vrDespesa,
    setVrDespesa,
    horarioAtual,
    setHorarioAtual,
    dtDespesa,
    setDtDespesa,
    usuarioSelecionado,
    setUsuarioSelecionado,
    empresa,
    setEmpresa,
    dadosFuncionarios
  }
}