import React, { Fragment, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { get } from "../../../../api/funcRequest";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionListaEmpresas } from "./actionListaEmpresas";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from 'react-query';
import { useFetchData } from "../../../../hooks/useFetchData";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaEmpresas = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false)
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useFetchData('empresas', '/empresas');

  const fetchListaEmpresas = async () => {
    try {

      const urlApi = `/listaEmpresas?idEmpresa=${empresaSelecionada}`;
      const response = await get(urlApi);

      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

        async function fetchNextPage(currentPage) {
          try {
            currentPage++;
            const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
            if (responseNextPage.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(currentPage);
            } else {
              return allData;
            }
          } catch (error) {
            console.error('Erro ao buscar próxima página:', error);
            throw error;
          }
        }

        await fetchNextPage(currentPage);
        return allData;
      } else {

        return response.data;
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosEmpresas = [], error: errorListaEmpresas, isLoading: isLoadingListaEmpresas, refetch: refetchListaEmpresas } = useQuery(
    ['empresas'],
    () => fetchListaEmpresas(),
    { enabled: true, staleTime: 5 * 60 * 1000 }
  );

  const handleChangeEmpresa = (e) => {
    if( e.value === '') {
      setEmpresaSelecionada('');
    } else {
      const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
      setEmpresaSelecionada(e.value);
      setEmpresaSelecionadaNome(empresa.NOFANTASIA);
    }
  }

  const handleClick = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaEmpresas()
    setTabelaVisivel(true)
    setIsLoadingPesquisa(true);
  }

  return (

    <Fragment>
      <ActionMain
        style={{ marginTop: "200px" }}
        linkComponentAnterior={["Home"]}
        linkComponent={["Empresas"]}
        title="Empresas"
        subTitle={empresaSelecionadaNome}

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={handleChangeEmpresa}
        valueSelectEmpresa={empresaSelecionada}

        optionsEmpresas={[
          { value: '', label: 'Selecione' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <ActionListaEmpresas 
        dadosEmpresas={dadosEmpresas} 
        optionsModulos={optionsModulos}
        usuarioLogado={usuarioLogado}  
      />
    
    </Fragment>
  )
}