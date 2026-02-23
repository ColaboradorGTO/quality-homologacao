import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { get } from "../../../../api/funcRequest"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { getDataAtual } from "../../../../utils/dataAtual"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaAdiantamentoSalarioLoja } from "./actionListaAdiantamentoSalarioLoja"
import { useQuery } from 'react-query';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"
import { IoMdCheckmark } from "react-icons/io"
import Swal from "sweetalert2"
import { useIntegrarTodosAdiantamento } from "./hooks/useIntegrarTodosAdiantamento"

export const ActionPesquisaAdiantamentoSalarioLoja = ({usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('0');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ufSelecionado, setUfSelecionado] = useState('0')
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  
  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'marcasLista',
    async () => {
      const response = await get(`/marcasLista`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
    ['listaEmpresaComercial', marcaSelecionada],
    async () => {
      if (marcaSelecionada) {
        const response = await get(`/listaEmpresaComercial?idMarca=${marcaSelecionada}`);
        return response.data;
      } else {
        return [];
      }
    },
    { enabled: Boolean(marcaSelecionada), staleTime: 5 * 60 * 1000 }
  );

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );
  

  const fetchListaVendasPCJ = async () => {
    const urlBase = `/adiantamento-loja?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idMarca=${marcaSelecionada}`;
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
      console.error('Error fetching data:', error);
      throw error;
    } finally {
      fecharAnimacaoCarregamento();
    }
  };

  const { data: dadosAdiantamentoFuncionarios = [], error: errorAdiantamento, isLoading: isLoadingAdiantamento, refetch } = useQuery(
    ['adiantamento-loja'],
    () => fetchListaVendasPCJ(),
    { enabled: false, staleTime: 60 * 60 * 1000,}
  )

  const handleChangeEmpresa = (e) => {
    const selectedEmpresa = optionsEmpresas.find(empresa => empresa.IDEMPRESA === e.value);
    setEmpresaSelecionadaNome(selectedEmpresa.NOFANTASIA);
    setEmpresaSelecionada(e.value);
  }

  const handleSelectMarca = (e) => {
    setMarcaSelecionada(e.value)  
  }

  const handleClick = () => {
    refetch()
    setTabelaVisivel(true)
  }

  const optionsUF = [
    {
      value: "0",
      label: 'Todos'
    },
    {
      value: "DF",
      label: 'DF'
    },
    {
      value: "GO",
      label: 'GO'
    },
  ]

  const {
    integrarTodos
  } = useIntegrarTodosAdiantamento({
    optionsModulos,
    usuarioLogado,
    handleClick,
    selectedItems,
  })
  const integrarTodasSelecionadas = () => {
    
    if (selectedItems.length === 0) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Nenhum Adiantamento selecionado, selecione e tente novamente!',
        text: 'Nenhum adiantamento selecionado, selecione e tente novamente!',
        showConfirmButton: true,
        timer: 6000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else if (optionsModulos[0]?.ALTERAR == 'False') {
      Swal.fire({
        position: 'center',
        icon: 'error',
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> você não tem permissão para integrar o adiantamento.`,
        showConfirmButton: true,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {
      integrarTodos();
    }
  }

  return (

    <Fragment>

      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Adiantamento Salarial"]}
        title="Adiantamento Salarial das Lojas"
        subTitle={empresaSelecionadaNome}
        
        InputFieldDTInicioComponent={InputField}
        valueInputFieldDTInicio={dataPesquisaInicio}
        labelInputFieldDTInicio={"Data Início"}
        onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}
        
        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Fim"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

        InputSelectEmpresaComponent={InputSelectAction}
        onChangeSelectEmpresa={handleChangeEmpresa}
        valueSelectEmpresa={empresaSelecionada}
        optionsEmpresas={[
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}
        

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          { value: 0, label: 'Selecione uma loja' },
          ...optionsMarcas.map((marca) => ({
            value: marca.IDGRUPOEMPRESARIAL,
            label: marca.DSGRUPOEMPRESARIAL
          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

        InputSelectUFComponent={InputSelectAction}
        labelSelectUF={"UF"}
        optionsSelectUF={optionsUF.map((item) => ({
          value: item.value,
          label: item.label,
        }))}   
        valueSelectUF={ufSelecionado}
        onChangeSelectUF={(e) => setUfSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeCancelar={ButtonType}
        linkCancelar={"Integrar Todos"}
        onButtonClickCancelar={integrarTodasSelecionadas}
        corCancelar={"warning"}
        IconCancelar={IoMdCheckmark}
        styleCancelar
      />

      {tabelaVisivel && (
        <ActionListaAdiantamentoSalarioLoja 
          dadosAdiantamentoFuncionarios={dadosAdiantamentoFuncionarios} 
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
          handleClick={handleClick}
        />
      )}

    </Fragment>
  )
}