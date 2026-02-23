import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useState } from "react";
import axios from "axios"

export const useCadastrarBonificaoca = ({ handleClose, usuarioLogado, optionsModulos }) => {
  const [ipUsuario, setIpUsuario] = useState('');
  const [funcionario, setFuncionario] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState('');
  const [valorBonificao, setValorBonificacao] = useState('');
  const [txtHistorico, setTxtHistorico] = useState('');

  const getIPUsuario = async () => {
    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      let usuarioIP = ipWhoisData?.ip;

      if (!usuarioIP) {
      const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
      usuarioIP = ipifyData?.ip;
      }

      setIpUsuario(usuarioIP);
      return usuarioIP;
    } catch (error) {
      console.error("Erro ao buscar IP:", error);
      return null;
    }
  };

  const onSubmit = async () => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Você não tem permissão para cadastrar!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    if (tipoSelecionado == '') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Informe o tipo de movimento!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    if (funcionario == '') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Informe o funcionário!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    if (valorBonificao == '' || valorBonificao == '0') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Informe o valor da bonificação!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    if (txtHistorico == '') {
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Informe o histórico!',
        timer: 3000,
        customClass: {
          confirmButton: "btn btn-primary btn-lg",
          cancelButton: "btn btn-danger btn-lg",
          container: 'custom-swal',
        },
      })
      return;
    }

    const data = {
      IDFUNCIONARIO: funcionario,
      TIPOMOVIMENTO: tipoSelecionado,
      VRMOVIMENTO: valorBonificao,
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
        IP: ipUsuario
      }


      await post('/log-web', postData)
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Cadastrado com sucesso!',
        customClass:{
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
        IP: ipUsuario
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
    funcionario,
    setFuncionario,
    valorBonificao,
    setValorBonificacao,
    tipoSelecionado,
    txtHistorico,
    OptionsStatus,
    setTipoSelecionado,
    setTxtHistorico,
    onSubmit,

  }
}