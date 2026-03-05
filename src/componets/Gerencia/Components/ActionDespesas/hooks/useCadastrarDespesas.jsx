import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { get, post } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import axios from "axios";
import { getDataAtual, getHoraAtual } from "../../../../../utils/dataAtual";
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";

export const useCadastrarDespesas = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
  const [dsHistorio, setDSHistorio] = useState('');
  const [dsPagoA, setDsPagoA] = useState('');
  const [vrDespesa, setVrDespesa] = useState('');
  const [hora, setHora] = useState('');
  const [dtDespesa, setDtDespesa] = useState('');
  const [despesaSelecionada, setDespesaSelecionada] = useState('')
  const [tpNota, setTpNota] = useState('');
  const [nuNotaFiscal, setNuNotaFiscal] = useState('');
  const [categoriaRecDesp, setCategoriaRecDesp] = useState('')
  const [ipUsuario, setIpUsuario] = useState('')
  const [empresa, setEmpresa] = useState(usuarioLogado?.NOFANTASIA || '')

  useEffect(() => {
    const horaAtual = getHoraAtual()
    const dataAtual = getDataAtual()
    setHora(horaAtual)
    setDtDespesa(dataAtual)
  }, [])

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

  const { data: dadosReceitaDespesa = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'categoria-receita-despesa',
    async () => {
      const response = await get(`/categoria-receita-despesa`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        title: 'Erro',
        text: 'Você não tem permissão para cadastrar despesas.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }

    if (despesaSelecionada && dsHistorio && dsPagoA && tpNota && nuNotaFiscal && vrDespesa) {
      Swal.fire({
        title: 'Erro',
        text: 'Por favor, preencha todos os campos obrigatórios.',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }
    const data = dtDespesa + ' ' + hora;
    const postData = {
      IDEMPRESA: parseInt(usuarioLogado?.IDEMPRESA),
      IDUSR: parseInt(usuarioLogado?.id),
      DTDESPESA: data,
      IDCATEGORIARECEITADESPESA: parseInt(despesaSelecionada?.value),
      DSHISTORIO: dsHistorio,
      DSPAGOA: dsPagoA,
      TPNOTA: tpNota?.value,
      NUNOTAFISCAL: nuNotaFiscal,
      VRDESPESA: removerFormatacaoMoeda(vrDespesa),
      STATIVO: 'True',
      STCANCELADO: 'False',
    }

    try {
      const response = await post('/cadastrar-despesa-loja', postData)

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/CADASTRO DE DESPESA';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      }

      await post('/log-web', createData)
      Swal.fire({
        title: 'Cadastro',
        text: 'Despesa cadastrado com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      setDtDespesa('')
      setCategoriaRecDesp('')
      setDSHistorio('')
      setDsPagoA('')
      setTpNota('')
      setNuNotaFiscal('')
      setVrDespesa('')

      handleClick();
      handleClose();
      return response.data;
    } catch (error) {

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'GERENCIA/ERRO AO CADASTRAR DESPESA';
      const ipUsuario = await getIPUsuario();

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "INDISPONÍVEL"
      }

      const responsePost = await post('/log-web', createData)


      Swal.fire({
        title: 'Cadastro',
        text: 'Erro ao Tentar Cadastrar Despesa',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return responsePost.data;
    }
  }

  const Options = [
    { id: 1, value: "NFCe", label: "NFCe" },
    { id: 2, value: "NFe", label: "NFe" },
  ]

  return {
    onSubmit,
    errorEmpresas,
    isLoadingEmpresas,
    refetch,
    despesaSelecionada,
    setDespesaSelecionada,
    dsHistorio,
    setDSHistorio,
    dsPagoA,
    setDsPagoA,
    vrDespesa,
    setVrDespesa,
    dtDespesa,
    setDtDespesa,
    categoriaRecDesp,
    setCategoriaRecDesp,
    tpNota,
    setTpNota,
    nuNotaFiscal,
    setNuNotaFiscal,
    empresa,
    setEmpresa,
    Options,
    dadosReceitaDespesa,
    hora,
    setHora,
  }
}