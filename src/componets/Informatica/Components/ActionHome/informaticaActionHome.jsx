import React, { Fragment, useEffect, useState } from "react"
import { get } from "../../../../api/funcRequest";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { GoDownload } from "react-icons/go";
import { ActionListaEmpresas } from "./actionListaEmpresas";
import { useQuery } from "react-query";
import { useAtualizarTodosCaixas } from "./hooks/useAtualizarTodosCaixas";

export const InformaticaActionHome = ({ usuarioLogado, ID }) => {
  const [clickContador, setClickContador] = useState(0);
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [actionVisivel, setActionVisivel] = useState(true);
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


  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch } = useQuery(
    'listaEmpresasIformatica',
    async () => {
      const response = await get(`/listaEmpresasIformatica`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, cacheTime: 5 * 60 * 1000 }
  );


  const { atualizarDiariaEmpresa } = useAtualizarTodosCaixas({ usuarioLogado, optionsModulos });

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      refetch();
    }
  }

  return (

    <Fragment>

      {actionVisivel && (
        <>
          <ActionMain
            linkComponentAnterior={["Home"]}
            linkComponent={["Tela Principal"]}
            title="Tela Principal Dashboard Informática"
            subTitle

            ButtonSearchComponent={ButtonType}
            linkNomeSearch={"Listar Caixas"}
            onButtonClickSearch={handleClick}
            corSearch={"primary"}
            IconSearch={AiOutlineSearch}

            ButtonTypeCadastro={ButtonType}
            linkNome={"Atualizar Todos os Caixas"}
            onButtonClickCadastro={atualizarDiariaEmpresa}
            corCadastro={"success"}
            IconCadastro={AiOutlineSearch}

            ButtonTypeCancelar={ButtonType}
            linkCancelar={"Exportar Caixas XLS"}
            onButtonClickCancelar
            corCancelar={"danger"}
            IconCancelar={GoDownload}

          />

        </>
      )}

      <ActionListaEmpresas
        dadosEmpresas={dadosEmpresas}
        setActionVisivel={setActionVisivel}
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}
