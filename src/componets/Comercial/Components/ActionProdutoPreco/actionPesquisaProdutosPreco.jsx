import React, { Fragment, useEffect, useState } from "react"
import { ActionListaProductoPreco } from "./actionListaProdutosPreco";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { useQuery } from "react-query";
import { get } from "../../../../api/funcRequest";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";

export const ActionPesquisaProductoPreco = () => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [marcaSelecionada, setMarcaSelecionada] = useState('')

  const { data: dadosMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas, refetch: refetchMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    'listaEmpresaComercial',
    async () => {
      const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
      return response.data;
    },
    { staleTime: 60 * 60 * 1000, }
  );

  useEffect(() => {
    if (marcaSelecionada) {
      refetchEmpresas();
    }
    refetchMarcas()
  }, [marcaSelecionada, refetchEmpresas])

  const fetchListaProdutos = async () => {
    const urlBase = `/lista-produtos?idEmpresa=${empresaSelecionada}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
      animacaoCarregamento('Carregando dados...', true);

      const primeiraPagina = 1;
      const primeiraResposta = await get(`${urlApi}&page=${primeiraPagina}`);
      const page = primeiraResposta.page || primeiraPagina;
      const pageSize = primeiraResposta.pageSize || 1000;
      const totalRows = primeiraResposta.rows || primeiraResposta.data?.length || 0;
      const totalPages = Math.ceil(totalRows / pageSize);

      let allData = [...(primeiraResposta.data || [])];

      if (totalPages > 1) {
        for (let currentPage = 2; currentPage <= totalPages; currentPage++) {
          animacaoCarregamento(`Página ${currentPage} de ${totalPages}`, true);
          const responsePage = await get(`${urlApi}&page=${currentPage}`);
          allData.push(...(responsePage.data || []));
        }
      }

      return allData;
    } catch (error) {
      console.error('Erro ao buscar dados da api:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosProdutos = [], error: errorPrdoutos, isLoading: isLoadingProdutos, refetch: refetchListaProdutos } = useQuery(
    ['produtos',],
    () => fetchListaProdutos(),
    { enabled: false, staleTime: 60 * 60 * 1000 }
  );
 
  const handleClick = () => {
    if(empresaSelecionada) {

      refetchListaProdutos();
      setTabelaVisivel(true);
    } else {
      Swal.fire({
        title:'Atenção',
        text:'Por favor, selecione uma empresa para realizar a pesquisa dos produtos e preços.',
        icon:'warning',
        confirmButtonText:'OK'
      });
    }
  }

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Produtos - Preços"]}
        title="Produtos - Preços"
        subTitle

        InputSelectEmpresaComponent={InputSelectAction}
        optionsEmpresas={[
          { value: '', label: 'Selecione uma loja' },
          ...dadosEmpresas.map((empresa) => ({
            value: String(empresa.IDEMPRESA),
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        valueSelectEmpresa={empresaSelecionada}
        onChangeSelectEmpresa={(e) => setEmpresaSelecionada(e.value)}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marcas"}
        optionsMarcas={[
          { value: null, label: 'Selecione uma Marca' },
          ...dadosMarcas.map((empresa) => ({
            value: empresa.IDGRUPOEMPRESARIAL,
            label: empresa.DSGRUPOEMPRESARIAL,

          }))
        ]}
        valueSelectMarcas={marcaSelecionada}
        onChangeSelectMarcas={(e) => setMarcaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

      />

      {tabelaVisivel && (
        <ActionListaProductoPreco dadosProdutos={dadosProdutos} />
      )}

    </Fragment>
  )
}