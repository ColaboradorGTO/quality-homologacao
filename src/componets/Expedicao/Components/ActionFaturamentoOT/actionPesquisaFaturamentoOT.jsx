import { Fragment, useEffect, useState } from "react"
import { ActionMain } from "../../../Actions/actionMain";
import { InputField } from "../../../Buttons/Input";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { get } from "../../../../api/funcRequest";
import { getDataAtual } from "../../../../utils/dataAtual";
import { ActionListaFaturasOT } from "./ActionListaFaturasOT";
import { useQuery } from "react-query";
import { MdFormatListBulleted } from "react-icons/md";
import { FcProcess } from "react-icons/fc";
import { GrDocumentDownload } from "react-icons/gr";
import { FaTruckFast } from "react-icons/fa6";
import { FaTrashAlt } from "react-icons/fa";
import { useProcessarSefazOT } from "./hooks/useProcessarSefazOT";
import { useProcessarFaturamentoOT } from "./hooks/useProcessarFaturamentoOT";
import { useDowloadNotasSaida } from "./hooks/useDowloadNotas";
import { ActionConhecimentoEntrega } from "./ActionConhecimentoEntrega/actionConhecimentoEntrega";
import Swal from "sweetalert2";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";

export const ActionPesquisaFaturamentoOT = ({ usuarioLogado }) => {
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [dataPesquisaInicioA, setDataPesquisaInicioA] = useState('');
  const [dataPesquisaFimA, setDataPesquisaFimA] = useState('');
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [clickContador, setClickContador] = useState(0);
  const [dadosStatusOT, setDadosStatusOT] = useState([])
  const [empresaDestino, setEmpresaDestino] = useState('')
  const [empresaOrigem, setEmpresaOrigem] = useState('')
  const [statusSelecionado, setStatusSelecionado] = useState('')
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1000);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [modalConhecimentoEntrega, setModalConhecimentoEntrega] = useState(false);
  const [dadosConhecimentoEntrega, setDadosConhecimentoEntrega] = useState([]);


  useEffect(() => {
    const dataInicial = getDataAtual();
    /*      setDataPesquisaInicio(dataInicial);
         setDataPesquisaFim(dataInicial); */

    getListaStatusOT()
  }, [])

  const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    ['menus-usuario-excecao', menuFilhoAtual?.ID],
    async () => {
      const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${menuFilhoAtual?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
  );

  const { data: dadosEmpresas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/empresas`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000 }
  );

  const fetchListaFaturasOT = async () => {
    try {

      const urlApi = `/faturasOT?idtipofiltro=1&idLojaOrigem=${empresaOrigem}&idLojaDestino=${empresaDestino}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idStatusOt=${statusSelecionado}&dataInicioFatura=${dataPesquisaInicioA}&dataFimFatura=${dataPesquisaFimA}`;
      const response = await get(urlApi);

      if (response.data.length && response.data.length === pageSize) {
        let allData = [...response.data];
        animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

        async function fetchNextPage(page) {
          try {
            page++;
            const responseNextPage = await get(`${urlApi}&page=${page}`);
            if (responseNextPage.data.length) {
              allData.push(...responseNextPage.data);
              return fetchNextPage(page);
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

  const { data: dadosFaturaOT = [], error: errorFaturaOT, isLoading: isLoadingFaturaOT, refetch: refetchFaturaOT } = useQuery(
    ['fetchListaFaturasOT', empresaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize],
    () => fetchListaFaturasOT(empresaDestino, dataPesquisaInicio, dataPesquisaFim, currentPage, pageSize),
    {
      enabled: Boolean(empresaDestino && dataPesquisaInicio && dataPesquisaFim),
      staleTime: 5 * 60 * 1000,
    }
  );


  const getListaStatusOT = async () => {
    try {
      const response = await get(`/statusOrdemTransferencia`)
      if (response.data) {
        setDadosStatusOT(response.data)
      }
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }

  const handleEmpresaDestino = (e) => {
    setEmpresaDestino(e.value)
  }

  const handleEmpresaOrigem = (e) => {
    setEmpresaOrigem(e.value)
  }

  const handleClick = () => {
    setClickContador(prevContador => prevContador + 1);

    if (clickContador % 2 === 0) {
      setTabelaVisivel(true)
      refetchFaturaOT()
    }
  }

  const selecionarRegistros = () => {
    Swal.fire({
      title: '<strong>Selecionar <u>OT</u></strong>',
      icon: 'info',
      html: 'A rotina irá selecionar os <b>10 (dez) primeiros</b>, registros de acordo com a opção escolhida!',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText: 'Faturamento',
      confirmButtonColor: '#ffc241',
      cancelButtonText: 'SEFAZ',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      let selectedIdsTemp = [];
      let selectedRowsTemp = [];
      let count = 0;

      if (result.isConfirmed) {
        // Faturamento
        dadosFaturaOT.forEach((item) => {
          if (count < 10 && (item.IDSAPORIGEM == null || item.IDSAPORIGEM === 0)) {
            selectedIdsTemp.push(parseInt(item.IDRESUMOOT));
            selectedRowsTemp.push(item);
            count++;
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // SEFAZ
        dadosFaturaOT.forEach((item) => {
          if (count < 10 && item.IDSAPORIGEM !== 0 && item.IDSTATUSOT === 9) {
            selectedIdsTemp.push(parseInt(item.IDRESUMOOT));
            selectedRowsTemp.push(item);
            count++;
          }
        });
      }

      setSelectedIds(selectedIdsTemp);
      setSelectedRows(selectedRowsTemp);
    });
  };

  const handleConhecimentoEntrega = async (selectedIds) => {
    try {
      const response = await get(`/impressao-entrega?idResumoOT=${selectedIds}`)

      if (response.data && response.data.length > 0) {
        setDadosConhecimentoEntrega(response.data);
        setModalConhecimentoEntrega(true);

      }
    } catch (error) {
      console.error('Erro ao buscar detalhes da OT ', error);
    }
  };

  const handleClickConhencimentoEntrega = (selectedIds) => {

    if (selectedIds) {
      handleConhecimentoEntrega(selectedIds);
    }
  };

  const {
    handleProcessarSefaz
  } = useProcessarSefazOT({ usuarioLogado, refetchFaturaOT, optionsModulos });

  const {
    handleProcessarFaturamento
  } = useProcessarFaturamentoOT({ usuarioLogado, refetchFaturaOT, optionsModulos });

  const {
    downloadNFE
  } = useDowloadNotasSaida({ usuarioLogado, refetchFaturaOT, optionsModulos });

  return (

    <Fragment>
      <ActionMain
        linkComponentAnterior={["Home"]}
        linkComponent={["Faturamento O.T"]}
        title="Faturamento Ordem de Transferência"
        subTitle="Nome da Loja"

        InputFieldDTInicioComponent={InputField}
        labelInputFieldDTInicio={"Data Inicial das Notas Faturadas"}
        valueInputFieldDTInicio={dataPesquisaInicio}
        onChangeInputFieldDTInicio={e => setDataPesquisaInicio(e.target.value)}

        InputFieldDTFimComponent={InputField}
        labelInputFieldDTFim={"Data Final das Notas Faturadas"}
        valueInputFieldDTFim={dataPesquisaFim}
        onChangeInputFieldDTFim={e => setDataPesquisaFim(e.target.value)}

        InputFieldDTInicioAComponent={InputField}
        labelInputDTInicioA={"Data Início"}
        onChangeInputFieldDTInicioA={(e) => setDataPesquisaInicioA(e.target.value)}
        valueInputFieldDTInicioA={dataPesquisaInicioA}

        InputFieldDTFimAComponent={InputField}
        labelInputDTFimA={"Data Fim"}
        onChangeInputFieldDTFimA={(e) => setDataPesquisaFimA(e.target.value)}
        valueInputFieldDTFimA={dataPesquisaFimA}

        InputSelectGrupoComponent={InputSelectAction}
        labelSelectGrupo={"Loja Origem"}
        optionsGrupos={[
          ...dadosEmpresas.map((empresa) => {
            return {
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA
            }
          })
        ]}
        valueSelectGrupo={empresaOrigem}
        onChangeSelectGrupo={handleEmpresaOrigem}


        InputSelectEmpresaComponent={InputSelectAction}
        labelSelectEmpresa={"Loja Destino"}
        optionsEmpresas={[
          ...dadosEmpresas.map((empresa) => {
            return {
              value: empresa.IDEMPRESA,
              label: empresa.NOFANTASIA
            }
          })
        ]}
        valueSelectEmpresa={empresaDestino}
        onChangeSelectEmpresa={handleEmpresaDestino}


        InputSelectSubGrupoComponent={InputSelectAction}
        labelSelectSubGrupo={"Status"}
        optionsSubGrupos={[
          ...dadosStatusOT.map((status) => {
            return {
              value: status.IDSTATUSOT,
              label: status.DESCRICAOOT
            }
          })
        ]}
        valueSelectSubGrupo={statusSelecionado}
        onChangeSelectSubGrupo={(e) => setStatusSelecionado(e.value)}

        ButtonSearchComponent={ButtonType}
        linkNomeSearch={"Pesquisar"}
        onButtonClickSearch={handleClick}
        corSearch={"primary"}
        IconSearch={AiOutlineSearch}
      />

      <div className="row mb-4 " style={{ marginTop: '1rem' }}>

        <ButtonType
          Icon={MdFormatListBulleted}
          iconSize="16px"
          textButton="Selecionar Registros"
          cor="primary"
          tipo="button"
          onClickButtonType={selecionarRegistros}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar Faturamento"
          cor="warning"
          tipo="button"
          onClickButtonType={() => handleProcessarFaturamento(selectedIds, true)}
        />
        <ButtonType
          Icon={FcProcess}
          iconSize="16px"
          textButton="Processar SEFAZ"
          cor="info"
          tipo="button"
          onClickButtonType={() => handleProcessarSefaz(selectedIds)}
        />
        <ButtonType
          Icon={GrDocumentDownload}
          iconSize="16px"
          textButton="Download Notas"
          cor="danger"
          tipo="button"
          onClickButtonType={() => downloadNFE(selectedRows, selectedIds)}
        />
        <ButtonType
          Icon={FaTruckFast}
          iconSize="16px"
          textButton="Conhecimento Entrega"
          cor="danger"
          tipo="button"
          onClickButtonType={() => handleClickConhencimentoEntrega(selectedIds)}
        />

      </div>

      {tabelaVisivel && (
        <div className="card">

          <ActionListaFaturasOT
            dadosFaturaOT={dadosFaturaOT}
            optionsModulos={optionsModulos}
            usuarioLogado={usuarioLogado}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            selectedIds={selectedIds}
            setSelectedIds={setSelectedIds}
            refetchFaturaOT={refetchFaturaOT}
            modalConhecimentoEntrega={modalConhecimentoEntrega}
            setModalConhecimentoEntrega={setModalConhecimentoEntrega}
          />
        </div>

      )}
      <ActionConhecimentoEntrega
        show={modalConhecimentoEntrega}
        handleClose={() => setModalConhecimentoEntrega(false)}
        dadosConhecimentoEntrega={dadosConhecimentoEntrega}
        usuarioLogado={usuarioLogado}
      />
    </Fragment>
  )
}
