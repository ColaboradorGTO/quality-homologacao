import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import axios from 'axios'
import { getDataAtual } from "../../../../../utils/dataAtual";

export const useCriarCaixaPDV = ({ dadosListaCaixa, handleClose, refetchListaCaixa, usuarioLogado }) => {
  const [empresa, setEmpresa] = useState('');
  const [dsCaixa, setDSCaixa] = useState('');
  const [tipoEmissao, setTipoEmissao] = useState('');
  const [modeloImpressora, setModeloImpressora] = useState('');
  const [portaComunicacao, setPortaComunicacao] = useState('');
  const [numeroSerieProducao, setNumeroSerieProducao] = useState('');
  const [numeroUltimaNFCeProducao, setNumeroUltimaNFCeProducao] = useState('');
  const [tef, setTef] = useState('');
  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [statusLimpar, setStatusLimpar] = useState('');
  const [dataAlteracao, setDataAlteracao] = useState('');
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
    const dataAtual = getDataAtual();
    setDataAlteracao(dataAtual);
    if (dadosListaCaixa) {
      setEmpresa(dadosListaCaixa[0]?.NOFANTASIA);
      // setDSCaixa(dadosListaCaixa[0]?.DSCAIXA);
      // setTipoEmissao(dadosListaCaixa[0]?.TBEMISSAOFISCAL);
      // setModeloImpressora(dadosListaCaixa[0]?.NOIMPRESSORA);
      // setPortaComunicacao(dadosListaCaixa[0]?.DSPORTACOMUNICACAO);
      // setNumeroSerieProducao(dadosListaCaixa[0]?.NUSERIEPROD);
      // setNumeroUltimaNFCeProducao(dadosListaCaixa[0]?.NUNFCEPROD);
      // setTef(dadosListaCaixa[0]?.STTEF);
      // setStatusSelecionado(dadosListaCaixa[0]?.STATUALIZA);
      // setStatusLimpar(dadosListaCaixa[0]?.STLIMPA);
    }
  }, [dadosListaCaixa]);

  const onSubmit = async (data) => {
    const putData = {
      IDEMPRESA: Number(dadosListaCaixa[0]?.IDEMPRESA),
      DSCAIXA: String(dsCaixa),
      NUULTNFCE: Number(0),
      TBEMISSAOFISCAL: String(tipoEmissao),
      NOIMPRESSORA: String(modeloImpressora),
      DSPORTACOMUNICACAO: String(portaComunicacao),
      NUSERIEPROD: Number(numeroSerieProducao),
      NUNFCEPROD: Number(numeroUltimaNFCeProducao),
      DTULTALTERACAO: String(dataAlteracao),
      DSCAIXAWEB: String(dsCaixa),
      NUSERIE: Number(0),
      NULINHAIMPRESSORA: Number(48),
      NUBAUD: String('115200'),
      NULINHAENTRECUPOM: Number(10),
      STIMPRIMIRUMITEMPORLINHA: String('False'),
      STDANFCERESUMIDO: String('False'),
      STIGNORARTAGFORMATACAO: String('False'),
      STIMPRIMIRDESCACRESITEM: String('True'),
      STVIACONSUMIDOR: String('True'),
      STTEF: String('True'),
      // STTEF: tef,
      STBALANCA: String('False'),
      STGAVETEIRO: String('False'),
      STSANGRIA: String('True'),
      VRMAXSANGRIA: parseFloat(0),
      STCONTROLAHORARIO: String('False'),
      HRINICIOLOGIN: String('00:00:00'),
      HRFIMLOGIN: String('23:59:59'),
      STSTATUS: String('Livre'),
      NUSERIEHOM: Number(0),
      NUNFCEHOM: Number(0),
      STATIVO: String('True'),
      VSSISTEMA: String('2.5.2.0'),
      STATUALIZA: String(statusSelecionado),
      STLIMPA: String(statusLimpar)
    };

    try {
      const response = await post('/criar-caixas', putData);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Caixa Criado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      const textDados = JSON.stringify(putData);
      let textoFuncao = 'INFORMATICA/CRIAÇÃO DE CAIXA PDV';
      const ipUsuario = await getIPUsuario();

      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario,
      };

      await post('/log-web', postData);

      if (refetchListaCaixa && dadosListaCaixa[0]?.IDEMPRESA) {
        await refetchListaCaixa(dadosListaCaixa[0].IDEMPRESA);
      }
      handleClose();
      return response.data;
    } catch (error) {

      
      let textoFuncao = 'INFORMATICA/CRIAÇÃO DE CAIXA PDV';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: 'INFORMATICA/CRIAÇÃO DE CAIXA PDV',
        IP: ipUsuario,
      };

      const responsePost = await post('/log-web', postData);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao Criar Caixa!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500,
      });

      return responsePost.data;
    }
  };

  const atualizacaoDiario = [
    { value: "True", label: "SIM" },
    { value: "False", label: "NÃO" }
  ]

  const optionsNota = [
    { value: "NFCE", label: "NFCE" },
    { value: "NFE", label: "NFCE" }
  ]

  const optionsImpressoras = [
    { value: "ppEscPosEpson", label: "ppEscPosEpson", selected: false },
    { value: "ppEscBematech", label: "ppEscBematech", selected: false },
    { value: "ppEscDaruma", label: "ppEscDaruma", selected: false },
    { value: "ppEscDiebold", label: "ppEscDiebold", selected: false },
    { value: "ppEscElgin", label: "ppEscElgin", selected: false },
    { value: "ppTexto", label: "ppTexto", selected: false }
  ];

  return {
    empresa,
    setEmpresa,
    dsCaixa,
    setDSCaixa,
    tipoEmissao,
    setTipoEmissao,
    modeloImpressora,
    setModeloImpressora,
    portaComunicacao,
    setPortaComunicacao,
    numeroSerieProducao,
    setNumeroSerieProducao,
    numeroUltimaNFCeProducao,
    setNumeroUltimaNFCeProducao,
    tef,
    setTef,
    statusSelecionado,
    setStatusSelecionado,
    statusLimpar,
    setStatusLimpar,
    dataAlteracao,
    setDataAlteracao,
    usuarioLogado,
    atualizacaoDiario,
    optionsNota,
    optionsImpressoras,
    onSubmit
  }
}