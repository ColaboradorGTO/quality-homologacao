import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { get } from "../../../../api/funcRequest"
import { getDataAtual } from "../../../../utils/dataAtual"
import { ActionListaCaixaZerado } from "./actionListaCaixaZerado"
import { ActionListaCaixaStatus } from "./actionListaCaixaStatus"
import { AiOutlineSearch } from "react-icons/ai"
import { useQuery } from 'react-query';
import Swal from 'sweetalert2'
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"

export const ActionPesquisaCaixaStatus = ({usuarioLogado, ID}) => {
  const [tabelaCaixaStatus, setTabelaCaixaStatus] = useState(false);
  const [tabelaCaixaZerado, setTabelaCaixaZerado] = useState(false);
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(false);
  const [isQueryCaixaZerado, setIsQueryCaixaZerado] = useState(false);
  const [isQueryCaixaStatus, setIsQueryCaixaStatus] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const { data: optionsMarcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');
  const { data: optionsEmpresas = [],} = useFetchEmpresas(marcaSelecionada);

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
  );

  const fetchCaixaStatus = async () => {
    const urlBase = `/lista-caixas-status?idMarca=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {
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

  const { data: dadosCaixaStatus = [], error: errorCaixaStatus, isLoading: isLoadingCaixaStatus, refetch: refetchCaixaStatus } = useQuery(
    ['lista-caixas-status'],
    () => fetchCaixaStatus(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );


  const fetchCaixaZerado = async () => {
    const urlBase = `/lista-caixas-zerados?idMarca=${marcaSelecionada}&idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
    let urlApi = urlBase.includes('?') ? urlBase : urlBase + '?';
    urlApi = urlApi.replace('&page=1', '').replace('page=1', '');
    try {

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

  const { data: dadosCaixaZerados = [], error: errorCaixaZerado, isLoading: isLoadingCaixaZerado, refetch: refetchCaixaZerado } = useQuery(
    ['lista-caixas-zerados', ],
    () => fetchCaixaZerado(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
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


  const handleSelectMarca = (e) => {
    const selectId = e.value
    if (selectId) {
      setMarcaSelecionada(selectId)
    }
  }

  const handleClick = () => {
    if (marcaSelecionada) {
      setTabelaCaixaStatus(true)
      setTabelaCaixaZerado(false)
      refetchCaixaStatus()
    } else {
      Swal.fire('Erro', 'Por favor, Verifique os Campos', 'error');
    }
  }

  const handleClickPesqCaixaStatus = () => {


    if (marcaSelecionada) {
      setTabelaCaixaZerado(true)
      setTabelaCaixaStatus(false)
      refetchCaixaZerado()

    } else {
      Swal.fire('Erro', 'Por favor, Verifique os Campos', 'error');
    }
  }


  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Status Caixa por Loja e Período"]}
        title="Status Caixa por Loja e Período"
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
          { value: '', label: 'Selecione uma loja' },
          ...optionsEmpresas.map((empresa) => ({
            value: empresa.IDEMPRESA,
            label: empresa.NOFANTASIA,
          }))
        ]}
        labelSelectEmpresa={"Empresa"}

        InputSelectMarcasComponent={InputSelectAction}
        labelSelectMarcas={"Marca"}
        optionsMarcas={[
          ...optionsMarcas.map((marca) => ({
            value: marca.IDGRUPOEMPRESARIAL,
            label: marca.DSGRUPOEMPRESARIAL
          }))
        ]}
        valueSelectMarca={marcaSelecionada}
        onChangeSelectMarcas={handleSelectMarca}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}

        ButtonTypeBalanco={ButtonType}
        linkNomeBalanco={"Pesquisar Caixas Zerados"}
        onButtonClickTypeBalanco={handleClickPesqCaixaStatus}

      />

      {tabelaCaixaStatus && (
        <ActionListaCaixaStatus dadosCaixaStatus={dadosCaixaStatus} />
      )}
      {tabelaCaixaZerado && (
        <ActionListaCaixaZerado 
          dadosCaixaZerados={dadosCaixaZerados} 
          usuarioLogado={usuarioLogado}
          optionsModulos={optionsModulos}  
          refetchCaixaZerado={refetchCaixaZerado}
        />
      )}
    </Fragment>
  )
}

