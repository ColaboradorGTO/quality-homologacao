import React, { Fragment, useEffect, useState } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionMain } from "../../../Actions/actionMain"
import { get } from "../../../../api/funcRequest";
import { MdAdd } from "react-icons/md";
import { ActionListaRelatorioBi } from "./actionListaRelatorioBI";
import { ActionCadastrarRelatorioBIModal } from "./ActionCadastrar/actionCadastrarRelatorioBIModal";
import { useQuery } from "react-query";
import Swal from "sweetalert2";

export const ActionPesquisaRelatorioBI = ({ usuarioLogado }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  
  useEffect(() => {
    const menuSalvo = localStorage.getItem('menuFilhoSelecionado');
    if (menuSalvo) {
      const menuParsed = JSON.parse(menuSalvo);
      setMenuFilhoAtual(menuParsed);
    }
  }, []);
  
  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosBI = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'relatorioInformaticaBI',
    async () => {
      const response = await get(`/relatorioInformaticaBI`);
      return response.data;
    },
    {
      staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000
    }
  );


  const handleModalCadastro = () => {
    if (optionsModulos[0]?.CRIAR == 'True') {
      setModalVisivel(true)
    } else {
      Swal.fire({
        title: 'Atenção',
        text: 'Você não tem permissão para cadastrar Relatório BI.',
        icon: 'warning',
        confirmButtonText: 'OK'
      });
    }
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Relatório BI"]}
        title="Listagem dos Relatórios do BI"


        ButtonTypeCadastro={ButtonType}
        linkNome={"Cadastrar Relatório BI"}
        onButtonClickCadastro={handleModalCadastro}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

      <ActionListaRelatorioBi
        dadosBI={dadosBI}
        optionsModulos={optionsModulos}
        refetch={refetch}
        usuarioLogado={usuarioLogado}

      />

      <ActionCadastrarRelatorioBIModal
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        refetch={refetch}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
      />
    </Fragment>
  )
}