import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { put } from "../../../../../api/funcRequest";


export const useEditarRelatorioBi = ({ handleClose, refetch, dadosRelatorios, optionsModulos, usuarioLogado }) => {

  const [statusSelecionado, setStatusSelecionado] = useState('');
  const [descricao, setDescricao] = useState('');
  const optionsStatus = [
    { value: "True", label: "Ativo" },
    { value: "False", label: "Inativo" },
  ]

  useEffect(() => {
    if (dadosRelatorios && dadosRelatorios[0]?.DSRELATORIOBI) {
      setDescricao(dadosRelatorios[0]?.DSRELATORIOBI)
    }
  }, [dadosRelatorios])

  useEffect(() => {
    if (dadosRelatorios && dadosRelatorios[0]?.STATIVO) {
      setStatusSelecionado(dadosRelatorios[0]?.STATIVO)
    }

  }, [dadosRelatorios])

  const onSubmit = async (data) => {

    if (optionsModulos?.ALTERAR === 'False') {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }

    if (!descricao || !statusSelecionado) {
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Preencha todos os campos!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
    const postData = {
      DSRELATORIOBI: descricao,
      STATIVO: statusSelecionado,
      IDRELATORIOBI: dadosRelatorios[0]?.IDRELATORIOBI

    }
    try {

      const response = await put('/relatorioInformaticaBI/:id', postData)

      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Relatório atualizado com sucesso!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      })
      refetch()
      handleClose()
      return response;
    } catch (error) {

      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'Erro ao atualizar Relatório!',
        customClass: {
          container: 'custom-swal',
        },
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
  return {
    onSubmit,
    descricao,
    setDescricao,
    statusSelecionado,
    setStatusSelecionado,
    usuarioLogado,
    optionsStatus
  }

}