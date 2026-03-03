import React, { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { ActionListaValeTransporte } from "./actionListaValeTransporte"
import { MdAdd } from "react-icons/md"
import { ActionCadastrarValeTransporte } from "./ActionCadastrarValeTransporte/actionCadastrarValeTransporte"
import { getDataAtual } from "../../../../utils/dataAtual"
import { useQuery } from "react-query"
import Swal from "sweetalert2"

export const ActionPesquisaValeTransporte = ({ usuarioLogado, ID }) => {
  const [modalVisivel, setModalVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
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

  useEffect(() => {
    const dataAtual = getDataAtual()
    setDataPesquisaInicio(dataAtual)
  }, [])

  const { data: dadosDespesasLoja = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchDadosLoja } = useQuery(
    'despesas-loja-empresa',
    async () => {
      const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
      const response = await get(`/despesas-loja-empresa?idEmpresa=${idEmpresa}&dataPesquisa=${dataPesquisaInicio}`);
      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000, cacheTime: 60 * 60 * 1000 }
  );

  const handleShowModal = () => {
    if (optionsModulos[0]?.CRIAR == 'True') {
      setModalVisivel(true);
    } else {
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
  };

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Vale Transporte da Loja"]}
        title="Vale Transporte da Loja"
        subTitle={`${usuarioLogado?.NOFANTASIA}`}

        ButtonTypeCadastro={ButtonType}
        linkNome="Cadastrar Vale Transporte"
        onButtonClickCadastro={handleShowModal}
        IconCadastro={MdAdd}
        corCadastro={"success"}
      />

      <ActionListaValeTransporte 
        dadosDespesasLoja={dadosDespesasLoja} 
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}  
        refetchDadosLoja={refetchDadosLoja}
      />

      <ActionCadastrarValeTransporte
        show={modalVisivel}
        handleClose={() => setModalVisivel(false)}
        usuarioLogado={usuarioLogado}
        optionsModulos={optionsModulos}
        refetchDadosLoja={refetchDadosLoja}
      />

    </Fragment >
  )
}


