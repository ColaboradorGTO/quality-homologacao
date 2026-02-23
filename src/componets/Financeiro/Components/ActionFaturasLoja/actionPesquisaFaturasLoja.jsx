import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain"
import { InputField } from "../../../Buttons/Input"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaFaturasLoja } from "./actionListaFaturasLoja";
import { useQuery } from 'react-query';
import Swal from 'sweetalert2';
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { useFetchData } from "../../../../hooks/useFetchData"
import { ActionImportacaoArquivo } from "./actionImportacaoArquivo"
import { IoMdCheckmark } from "react-icons/io"
import { useConferirTodasFaturas } from "./hooks/useConfeririTodasFaturas"

export const ActionPesquisaFaturasLoja = ({ usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [actionArquivo, setActionArquivo] = useState(false);
  const [actionMain, setActionMain] = useState(true);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('')
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
  const [codigoFatura, setCodigoFatura] = useState('')
  const [isLoadingPesquisa, setIsLoadingPesquisa] = useState(true)
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    const dataInicial = getDataAtual();
    const dataFinal = getDataAtual();
    setDataPesquisaInicio(dataInicial);
    setDataPesquisaFim(dataFinal);
  }, [])

  const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas } = useFetchData('listaEmpresasIformatica', '/listaEmpresasIformatica');

  useEffect(() => {
    if (errorEmpresas) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Erro ao buscar empresas!',
      });
    }
  }, [errorEmpresas]);


  const fetchFatura = async () => {
    const urlBase = `/detalhe-faturas?idEmpresa=${empresaSelecionada}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&codigoFatura=${codigoFatura}`;
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

  }
  const { data: dadosDetalheFatura = [], error: erroFatura, isLoading: isLoadingFatura, refetch: refetchFatura } = useQuery(
    'detalhe-faturas',
    () => fetchFatura(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const fetchVendaMarcaPeriodo = async () => {
    const urlBase = `/vendas-marca-periodo?dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

  }
  const { data: dadosVendaMarcaPeriodo = [], error: erroVendaMarcaPeriodo, isLoading: isLoadingVendaMarcaPeriodo, refetch: refetchVendaMarcaPeriodo } = useQuery(
    'vendas-marca-periodo',
    () => fetchVendaMarcaPeriodo(),
    { enabled: false, staleTime: 5 * 60 * 1000 }
  );

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario-excecao',
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);
      console.log(response.data, 'response.data');
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const handleChangeEmpresa = (e) => {
    const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
    setEmpresaSelecionada(e.value);
    setEmpresaSelecionadaNome(empresa.NOFANTASIA);
  }


  const handleClick = () => {
    setTabelaVisivel(true)
    setIsLoadingPesquisa(true);
    refetchFatura()
  }
  const handleClickConciliar = () => {
    refetchVendaMarcaPeriodo()
    setActionArquivo(true)
    setActionMain(false)
    setTabelaVisivel(false)
  }

  const {
    conferirTodas
  } = useConferirTodasFaturas({ optionsModulos, usuarioLogado, handleClick, selectedItems });

  const conferirTodasSelecionadas = () => {

    if (selectedItems.length === 0) {
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Nenhuma fatura selecionada, selecione e tente novamente!',
        text: 'Nenhuma fatura selecionada, selecione e tente novamente!',
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
        html: `${usuarioLogado?.NOFUNCIONARIO} <br/> você não tem permissão para conferir a fatura.`,
        showConfirmButton: true,
        timer: 3000,
        customClass: {
          container: 'custom-swal',
        },
      });
      return;
    } else {
      conferirTodas();
    }

  }

  return (

    <Fragment>
      {actionMain && (

        <ActionMain
          linkComponentAnterior={["Home"]}
          linkComponent={["Lista de Faturas"]}
          title="Faturas por Lojas e Período"
          subTitle={empresaSelecionadaNome}

          InputFieldDTInicioComponent={InputField}
          labelInputFieldDTInicio={"Data Início"}
          valueInputFieldDTInicio={dataPesquisaInicio}
          onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

          InputFieldDTFimComponent={InputField}
          labelInputFieldDTFim={"Data Fim"}
          valueInputFieldDTFim={dataPesquisaFim}
          onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

          InputSelectEmpresaComponent={InputSelectAction}
          labelSelectEmpresa={"Empresa"}
          optionsEmpresas={[
            ...optionsEmpresas.map((empresa) => ({
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA,
            }))
          ]}
          valueSelectEmpresa={empresaSelecionada}
          onChangeSelectEmpresa={handleChangeEmpresa}

          InputFieldComponent={InputField}
          labelInputField={"Código Fatura"}
          valueInputField={codigoFatura}
          placeHolderInputFieldComponent={"Código Fatura"}
          onChangeInputField={(e) => setCodigoFatura(e.target.value)}

          ButtonSearchComponent={ButtonType}
          linkNomeSearch={"Pesquisar"}
          onButtonClickSearch={handleClick}
          IconSearch={AiOutlineSearch}
          corSearch={"primary"}

          ButtonTypeCadastro={ButtonType}
          linkNome={"Conciliar"}
          onButtonClickCadastro={handleClickConciliar}
          corCadastro={"info"}
          IconCadastro={AiOutlineSearch}

          ButtonTypeCancelar={ButtonType}
          linkCancelar={"Conferir Todos"}
          onButtonClickCancelar={conferirTodasSelecionadas}
          corCancelar={"warning"}
          IconCancelar={IoMdCheckmark}
          styleCancelar
        />
      )}

      {tabelaVisivel && (
        <ActionListaFaturasLoja
          dadosDetalheFatura={dadosDetalheFatura}
          optionsModulos={optionsModulos}
          usuarioLogado={usuarioLogado}
          handleClick={handleClick}
          selectedItems={selectedItems}
          setSelectedItems={setSelectedItems}
        />

      )}

      {actionArquivo && (
        <ActionImportacaoArquivo
          dadosVendaMarcaPeriodo={dadosVendaMarcaPeriodo}
          actionArquivo={actionArquivo}
          setActionArquivo={setActionArquivo}
          actionMain={actionMain}
          setActionMain={setActionMain}
        />
      )}

    </Fragment>
  )
}