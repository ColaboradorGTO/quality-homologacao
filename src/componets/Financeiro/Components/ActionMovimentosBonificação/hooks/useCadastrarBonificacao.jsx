import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios"
import { removerFormatacaoMoeda } from "../../../../../utils/formatMoeda";

export const useCadastrarBonificaoca = ({ handleClose, usuarioLogado, optionsModulos, funcionario }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [valorBonificacao, setValorBonificacao] = useState('');
  const [txtHistorico, setTxtHistorico] = useState('');

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

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'info',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para cadastrar!`,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      })
      return;
    }

    const data = {
      IDFUNCIONARIO: funcionario?.value,
      TIPOMOVIMENTO: tipoSelecionado?.value,
      VRMOVIMENTO: removerFormatacaoMoeda(valorBonificacao),
      OBSERVACAO: txtHistorico,
      IDFUNCIONARIORESP: usuarioLogado.id
    }

    try {

      const response = await post('/criar-movimento-saldo-bonificacao', data)
      const textDados = JSON.stringify(data)
      let textoFuncao = 'FINANCEIRO/CADASTRO DE BONIFICACAO';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }


      await post('/log-web', postData)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cadastrado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      })

      handleClose();
      return response.data;
    } catch (error) {
      const textDados = JSON.stringify(data)
      const textoFuncao = 'FINANCEIRO/ERRO NO CADASTRO DE BONIFICACAO';
      const ipUsuario = await getIPUsuario();
      const postData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || 'IP não disponível'
      }

      const responsePost = await post('/log-web', postData)

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });

      return responsePost.data;
    }
  }

  const OptionsStatus = [
    { id: 0, value: "Credito", label: "Crédito" },
    { id: 1, value: "Debito", label: "Débito" },
  ]

  return {
    valorBonificacao,
    setValorBonificacao,
    tipoSelecionado,
    txtHistorico,
    OptionsStatus,
    setTipoSelecionado,
    setTxtHistorico,
    onSubmit,

  }
}