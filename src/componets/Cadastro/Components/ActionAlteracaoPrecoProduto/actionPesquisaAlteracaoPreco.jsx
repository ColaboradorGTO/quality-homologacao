import React, { Fragment, useState, useEffect } from "react"
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { ActionListaAlteracaoPreco } from "./actionListaAlteracaoPreco";
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../utils/dataAtual";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../hooks/useFetchData";


export const ActionPesquisaAlteracaoPreco = () => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [grupoSelecionado, setGrupoSelecionado] = useState('');
  const [subGrupoSelecionado, setSubGrupoSelecionado] = useState(null);
  const [listaPrecoSelecionada, setListaPrecoSelecionada] = useState('');
  const [responsavelSelcionado, setResponsavelSelecionado] = useState('');
  const [codBarra, setCodBarra] = useState('');
  const [numeroAlteracao, setNumeroAlteracao] = useState('');
  const [descricaoProduto, setDescricaoProduto] = useState('');
  const [idProduto, setIdProduto] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);


  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFim)
  }, []);



  const { data: dadosResponsaveisAlteracao = [] } = useFetchData('responsaveisAlteracaoPrecos', '/responsaveisAlteracaoPrecos');
  // const { data: dadosMarcas = [] } = useFetchData('listaMarcaProduto', '/listaMarcaProduto');
  const { data: dadosListaPreco = [] } = useFetchData('lista-de-preco', '/lista-de-preco');
  
  const fetchListaPreco = async () => {
    try {
      const urlApi = `/alteracoes-de-precos-resumo?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idLista=${listaPrecoSelecionada}&idUsuario=${responsavelSelcionado}&descproduto${descricaoProduto}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };
   
  const { data: dadosAlteracaoPreco = [], error: errorEstilos, isLoading: isLoadingEstilos, refetch: refetchListaPreco } = useQuery(
    ['alteracoes-de-precos-resumo', listaPrecoSelecionada, responsavelSelcionado, descricaoProduto, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaPreco(listaPrecoSelecionada, responsavelSelcionado, descricaoProduto, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: Boolean(listaPrecoSelecionada),
    }
  );


  // const getListaAlteraPreco = async () => {

  //   try {
  //     // idEmpresa=${idEmpresa}&idgrupo=${idGrupo}&idsubgrupo=${idSubGrupo}&descproduto${descricaoProduto}&dtinicial=${dataPesquisa}
  //     const response = await get(`/listaPreco`)
  //     if (response.data) {
  //       setDadosAlteracaoPreco(response.data)
  //     }
  //     return response.data;

  //   } catch (error) {
  //     console.log('Erro ao buscar empresas: ', error)
  //   }
  // }


  const handleTabelaVisivel = () => {
    setCurrentPage(prevPage => prevPage + 1);
    refetchListaPreco();
    setTabelaVisivel(false);

  };

  const handleActionVisivel = () => {
    setContadorClickAction((prevClickCount) => prevClickCount + 1);
    if (contadorClickAction % 2 === 0) {
      setActionVisivel(false);

    }
  };

  const optionsEmpresas = dadosListaPreco.map((item) => ({
    value: item.IDRESUMOLISTAPRECO,
    label: item.NOMELISTA,
    title: item.TITLE, // Presumo que "title" está nos dados originais.
  }));

  return (

    <Fragment>


      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Alteração de Preços"]}
        title="Alteração de Preços"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}


        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Cód.Barras "}
        valueInputFieldCodBarra={codBarra}
        onChangeInputFieldCodBarra={e => setCodBarra(e.target.value)}
        placeHolderInputFieldCodBarra={"Digite o Código de Barras"}

        InputFieldComponent={InputField}
        labelInputField={"N° Alteração"}
        valueInputField={numeroAlteracao}
        onChangeInputField={(e) => setNumeroAlteracao(e.target.value)}
        placeHolderInputFieldComponent={"Digite o Número da Alteração"}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Id. Produto"}
        valueInputFieldNumeroNF={idProduto}
        onChangeInputFieldNumeroNF={(e) => setIdProduto(e.target.value)}
        placeHolderInputFieldNumeroNF={"Digite o Id. do Produto"}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Descrição do Produto"}
        placeHolderInputFieldDescricao={"Digite a descrição do produto"}
        valueInputFieldDescricao={descricaoProduto}
        onChangeInputFieldDescricao={(e) => setDescricaoProduto(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lista de Preço"}
        optionsEmpresas={dadosListaPreco.map((item) => ({
          value: item.listaPreco.IDRESUMOLISTAPRECO,
          label: item.listaPreco.NOMELISTA,
        }))}
        valueSelectEmpresa={listaPrecoSelecionada}
        onChangeSelectEmpresa={(e) => setListaPrecoSelecionada(e.value)}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Responsável Alt."}
        optionsGrupos={dadosResponsaveisAlteracao.map((item) => ({
          value: item.IDFUNCIONARIO,
          label: item.NOFUNCIONARIO,
        }))}
        valueSelectGrupo={responsavelSelcionado}
        onChangeSelectGrupo={(e) => setResponsavelSelecionado(e.value)}


        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleTabelaVisivel}
        linkNomeSearch={"Pesquisar"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Inserir Alteração"}
        onButtonClickCadastro
        corCadastro={"success"}
        IconCadastro={MdAdd}

      />

      <ActionListaAlteracaoPreco dadosAlteracaoPreco={dadosAlteracaoPreco} />


    </Fragment>
  )
}


