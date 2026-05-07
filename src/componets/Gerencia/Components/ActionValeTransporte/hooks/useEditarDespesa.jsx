import axios from "axios";
import { put, post } from "../../../../../api/funcRequest";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

export const useEditarDespesa = (usuarioLogado, optionsModulos, refetchDadosLoja) => {
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

  const onSubmit = async (row, status) => {
    if (optionsModulos[0]?.ALTERAR !== 'True') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Acesso Negado!',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> Você não tem permissão para alterar esta despesa.`,
        showConfirmButton: false,
        timer: 5000,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    }


    const postData = {
      IDDESPESASLOJA: row.IDDESPESASLOJA,
      STCANCELADO: status ? 'True' : 'False'
    };

    try {
      await put('/editar-status-despesa/:id', postData);
      
      const textDados = JSON.stringify(postData);
      const textoFuncao = 'FINANCEIRO/ATUALIZAÇÃO DE ESTATUS DA DESPESA';
      const ipUsuario = await getIPUsuario()
      
      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "Indisponível"
      };
      
      await post('/log-web', createData);
      Swal.fire({
        title: 'Sucesso',
        text: 'Despesa alterada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
      refetchDadosLoja()
    } catch (error) {
      const textDados = JSON.stringify(postData);
      const textoFuncao = 'FINANCEIRO/ERRO AO ATUALIZAR ESTATUS DA DESPESA';
      const ipUsuario = await getIPUsuario()

      const createData = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario || "Indisponível"
      };

      await post('/log-web', createData);

      Swal.fire({
        title: 'Erro',
        text: 'Erro ao Tentar Editar Despesa',
        icon: 'error',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      });
    }
  };

  return { onSubmit };
};
