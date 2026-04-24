import React, { Fragment, useState, useEffect } from "react"
import { MdAdd } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";

import { ActionMain } from "../../../../Actions/actionMain";
import { InputField } from "../../../../Buttons/Input";
import { InputSelectAction } from "../../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../../Buttons/ButtonType";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { get } from "../../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../../utils/animationCarregamento";
import { useFetchData } from "../../../../../hooks/useFetchData";
import { MultSelectActionAsync } from "../../../../Select/MultSelectActionAsync";
import { FaDownload, FaUpload } from "react-icons/fa";
import { MultSelectAction } from "../../../../Select/MultSelectAction";


export const ActionManualAlteracaoPreco = ({ usuarioLogado }) => {
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
  const [precoInicial, setPrecoInicial] = useState('');
  const [precoFinal, setPrecoFinal] = useState('');
  const [estruturaSelecionada, setEstruturaSelecionada] = useState([]);
  const [subEstruturaSelecionada, setSubEstruturaSelecionada] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  useEffect(() => {
    const dataInicial = getDataAtual()
    const dataFim = getDataAtual()
    setDataPesquisaInicio(dataInicial)
    setDataPesquisaFim(dataFim)
  }, []);

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

  const { data: dadosGrupoEstrutura = [], error: errorGrupoEstrutura, isLoading: isLoadingGrupoEstrutura, refetch: refetchGrupoEstrutura } = useQuery(
    ['grupo-estrutura-mercadologica'],
    async () => {
      const response = await get(`/grupo-estrutura-mercadologica`);
      
      return response.data;
    },
    { enabled: true, staleTime: 60 * 60 * 1000,}
  );
 
  const { data: dadosSubGrupoEstrutura = [], error: errorSubGrupoEstrutura, isLoading: isLoadingSubGrupoEstrutura, refetch: refetchSubGrupoEstrutura } = useQuery(
    ['subgrupo-estrutura-mercadologica'],
    async () => {
      const response = await get(`/subgrupo-estrutura-mercadologica?idSubGrupo=${subGrupoSelecionado}`);
      
      return response.data;
    },
    { enabled: Boolean(subGrupoSelecionado), staleTime: 60 * 60 * 1000,}
  );
     

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
    ['alteracoes-de-precos-resumo', ],
    () => fetchListaPreco(),
    {
      enabled: false,
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
        title="Alteração Manual de Preços"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Início"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}


        InputFieldORComponent={InputField}
        labelInputFieldOR={"Descrição "}
        valueInputFieldOR={descricaoProduto}
        onChangeInputFieldOR={e => setDescricaoProduto(e.target.value)}
        placeHolderInputFieldOR={"Descrição do Produto"}

        InputFieldCodBarraComponent={InputField}
        labelInputFieldCodBarra={"Id. Produto"}
        valueInputFieldCodBarra={idProduto}
        onChangeInputFieldCodBarra={(e) => setIdProduto(e.target.value)}
        placeHolderInputFieldCodBarra={"Digite o Id. do Produto"}

        InputFieldComponent={InputField}
        labelInputField={"Cod.Barras"}
        valueInputField={codBarra}
        onChangeInputField={(e) => setCodBarra(e.target.value)}
        placeHolderInputFieldComponent={"Código de Barras"}

        InputFieldNumeroNFComponent={InputField}
        labelInputFieldNumeroNF={"Preço Inicial"}
        valueInputFieldNumeroNF={precoInicial}
        onChangeInputFieldNumeroNF={(e) => setPrecoInicial(e.target.value)}
        placeHolderInputFieldNumeroNF={"Preço Produto Inicial"}

        InputFieldDescricaoComponent={InputField}
        labelInputFieldDescricao={"Preço Final"}
        valueInputFieldDescricao={precoFinal}
        onChangeInputFieldDescricao={(e) => setPrecoFinal(e.target.value)}
        placeHolderInputFieldDescricao={"Preço Produto Final"}

        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Lista de Preço"}
        optionsEmpresas={dadosListaPreco.map((item) => ({
          value: item.listaPreco.IDRESUMOLISTAPRECO,
          label: item.listaPreco.NOMELISTA,
        }))}
        valueSelectEmpresa={listaPrecoSelecionada}
        onChangeSelectEmpresa={(e) => setListaPrecoSelecionada(e.value)}

        // InputSelectGrupoComponent={InputSelectAction}
        // labelSelectGrupo={"Responsável Alt."}
        // optionsGrupos={dadosResponsaveisAlteracao.map((item) => ({
        //   value: item.IDFUNCIONARIO,
        //   label: item.NOFUNCIONARIO,
        // }))}
        // valueSelectGrupo={responsavelSelcionado}
        // onChangeSelectGrupo={(e) => setResponsavelSelecionado(e.value)}

        MultSelectGrupoComponent={MultSelectAction}
        labelMultSelectGrupo={"Lista de Estruturas"}
        optionsMultSelectGrupo={dadosGrupoEstrutura.map((item) => ({
          value: item.IDGRUPOESTRUTURA,
          label: item.DSGRUPOESTRUTURA,
        })
      )}
        valueMultSelectGrupo={estruturaSelecionada}
        onChangeMultSelectGrupo={(e) => setEstruturaSelecionada(e.value)}

        MultSelectSubGrupoComponent={MultSelectAction}
        labelMultSelectSubGrupo={"Lista de SubEstruturas"}
        optionsMultSelectSubGrupo={dadosSubGrupoEstrutura.map((item) => ({
            value: item.IDSUBGRUPOESTRUTURA,
            label: item.DSSUBGRUPOESTRUTURA,
          })
        )}
        valueMultSelectSubGrupo={subEstruturaSelecionada}
        onChangeMultSelectSubGrupo={(e) => setSubEstruturaSelecionada(e.value)}

        ButtonSearchComponent={ButtonType}
        onButtonClickSearch={handleTabelaVisivel}
        linkNomeSearch={"Pesquisar"}
        IconSearch={AiOutlineSearch}
        corSearch={"primary"}

        ButtonTypeCadastro={ButtonType}
        linkNome={"Exportar"}
        // onButtonClickCadastro
        corCadastro={"info"}
        IconCadastro={FaDownload}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Importar"}
        onButtonClickCancelar
        corCancelar={"success"}
        IconCancelar={FaUpload}
      />


    </Fragment>
  )
}