import Swal from "sweetalert2";
import { put } from "../../../../../api/funcRequest";
import { useEffect, useState } from "react";
import { getDataHoraAtual } from "../../../../../utils/dataAtual";
import { registrarLogAuditoria } from "../../../../../services/auditLog";

export const useAtivarFuncionario = ({ handleClose, optionsModulos, usuarioLogado, handleClick }) => {
  const [dataAdmissao, setDataAdmissao] = useState('');

  useEffect(() => {
    const dataAtual = getDataHoraAtual()
    setDataAdmissao(dataAtual)
  }, [])

  const handleAtivarFuncionario = async (row, status) => {

    if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        title: 'Acesso Negado',
        text: 'Você não tem permissão para acessar esta funcionalidade.',
        icon: 'warning',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })
      return;
    }
    const putData = {
      DATAULTIMAALTERACAO: dataAdmissao,
      STATIVO: status ? 'True' : 'False',
      DATA_DEMISSAO: '',
      ID: Number(row.ID)
    }
    try {
      const response = await put('/inativarFuncionarioRH', putData)

      Swal.fire({
        title: 'Atualização',
        text: 'Atualizção Realizada com Sucesso',
        icon: 'success',
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        }
      })

      const textoFuncao = putData.STATIVO === 'True'
        ? 'RH/ATIVA DESLIGAMENTO DE FUNCIONARIO'
        : 'RH/DESLIGAMENTO DE FUNCIONARIO';

      await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: textoFuncao,
        dados: putData
      });

      handleClick()
      return response.data;
    } catch (error) {
      console.error('Erro ao ativar/inativar funcionário:', error);

      const responsePost = await registrarLogAuditoria({
        idFuncionario: usuarioLogado.id,
        pathFuncao: 'RH/ERRO AO ATIVAR/INATIVAR FUNCIONARIO',
        dados: putData
      });

      Swal.fire({
        title: 'Erro ao Atualizar',
        text: 'Erro ao Tentar Atualizar',
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
    handleAtivarFuncionario
  }
}
