import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonType } from "../../../Buttons/ButtonType"
import { ActionListaCampanha } from "./actionListaCampanha"
import { MdAdd } from "react-icons/md"
import { get } from "../../../../api/funcRequest"
import { useQuery } from "react-query"
import { ActionCadastrarCampanhaModal } from "./ActionCadastrarCampanha/actionCadastrarCampanhaModal"

export const ActionPesquisaCampanha = ({usuarioLogado }) => {
  const [modalCadastrarCampanha, setModalCadastrarCampanha] = useState(false)
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: dadosListaCampanha = [], error: errorPromocao, isLoading: isLoadingPromocao, refetch: refetchPromocao } = useQuery(
    'campanha',
    async () => {
      const response = await get(`/campanha`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000 }
  );

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Cadastro de Campanhas"]}
        title="Cadsatro de Campanhas"

        ButtonTypeCadastro={ButtonType}
        onButtonClickCadastro={(e) => setModalCadastrarCampanha(true)}
        linkNome={"Cadastrar Campanha"}
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

      <ActionListaCampanha dadosListaCampanha={dadosListaCampanha} />

      <ActionCadastrarCampanhaModal 
        show={modalCadastrarCampanha} 
        handleClose={(e) => setModalCadastrarCampanha(false)} 
        refetchPromocao={refetchPromocao} 
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment >
  )
}