import { AiOutlineSearch } from "react-icons/ai"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { InputField } from "../../../Buttons/Input"
import { ActionMain } from "../../../Actions/actionMain"
import { getDataAtual } from "../../../../utils/dataAtual"
import { Fragment, useEffect, useState } from "react"
import { useFetchData, useFetchEmpresas } from "../../../../hooks/useFetchData"
import { useQuery } from "react-query"
import { ActionListaConferenciaMalotes } from "./actionListaConferenciaMalotes"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { get } from "../../../../api/funcRequest"

export const ActionPesquisaConferenciaMalote = ({ usuarioLogado }) => {
    const [dataPesquisaInicio, setDataPesquisaInicio] = useState("");
    const [dataPesquisaFim, setDataPesquisaFim] = useState("");
    const [marcaSelecionada, setMarcaSelecionada] = useState("");
    const [empresaSelecionada, setEmpresaSelecionada] = useState("");
    const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState("");
    const [tabelaVisivel, setTabelaVisivel] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState("");
    const [pendenciaSelecionada, setPendenciaSelecionada] = useState("");
    const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

    useEffect(() => {
        const dataInicial = getDataAtual();
        const dataFinal = getDataAtual();
        setDataPesquisaInicio(dataInicial);
        setDataPesquisaFim(dataFinal);

    }, [])

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
   
    const { data: optionsMarcas = [] } = useFetchData('marcasLista', '/marcasLista');
    const { data: optionsEmpresas = [], refetch: refetchEmpresas } = useFetchEmpresas(marcaSelecionada);
    const { data: optionsPendenciasMalotes = [] } = useFetchData('pendencias-malotes', '/pendencias-malotes');

    const fetchListaMalotes = async () => {
        const urlBase = `/malotes-loja?idEmpresa=${empresaSelecionada}&idMarca=${marcaSelecionada}&statusMalote=${statusSelecionado}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}&idPendenciaMalote=${pendenciaSelecionada}`;
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
            console.error('Erro ao buscar dados:', error);
            throw error;
        } finally {
            fecharAnimacaoCarregamento();
        }
    };
    
    const { data: dadosMalotes = [], error: errorMalotes, isLoading: isLoadingMalotes, refetch } = useQuery(
        ['malotes-loja'],
        () => fetchListaMalotes(),
        { enabled: false, staleTime: 60 * 60 * 1000, }
    );

    const handleChangeEmpresa = (e) => {
        const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
        setEmpresaSelecionada(e.value);
        setEmpresaSelecionadaNome(empresa.NOFANTASIA);
      }

      
    const handleClick = () => {
        setTabelaVisivel(true);
        refetch();
    }

    const optionsData = [
        { value: 'Malote', label: 'Data Caixa' },
        { value: 'Conferido', label: 'Data Conferido' },
    ]

    const optionsStatus = [
        { value: '0', label: 'Selecione um Status' },
        { value: 'Pendente de Envio', label: 'Pendente de Envio' },
        { value: 'Enviado', label: 'Enviado' },
        { value: 'Recepcionado', label: 'Recepcionado' },
        { value: 'Devolvido', label: 'Devolvido' },
        { value: 'Conferido', label: 'Conferido' },
        { value: 'Reenviado', label: 'Reenviado' },
    ]
    return (

        <Fragment>

            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Lista de Vendas"]}
                title="Vendas por Marcas e Período"
                subTitle={empresaSelecionadaNome}

                InputFieldDTInicioComponent={InputField}
                labelInputFieldDTInicio={"Data Início"}
                valueInputFieldDTInicio={dataPesquisaInicio}
                onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

                InputFieldDTFimComponent={InputField}
                labelInputFieldDTFim={"Data Fim"}
                valueInputFieldDTFim={dataPesquisaFim}
                onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

                InputSelectEmpresaComponent={InputSelectAction}
                labelSelectEmpresa={"Grupo Empresarial"}
                optionsEmpresas={[
                    { value: '0', label: 'Selecione uma Marca' },
                    ...optionsMarcas.map((item) => ({
                        value: item.IDGRUPOEMPRESARIAL,
                        label: item.DSGRUPOEMPRESARIAL,

                    }))
                ]}
                valueSelectEmpresa={marcaSelecionada}
                onChangeSelectEmpresa={(e) => setMarcaSelecionada(e.value)}


                InputSelectGrupoComponent={InputSelectAction}
                labelSelectGrupo={"Empresa"}
                optionsGrupos={[
                    // { value: '0', label: 'Selecione uma Empresa' },
                    ...optionsEmpresas.map((item) => ({
                        value: item.IDEMPRESA,
                        label: item.NOFANTASIA,

                    }))
                ]}
                valueSelectGrupo={empresaSelecionada}
                onChangeSelectGrupo={handleChangeEmpresa}


                InputSelectSubGrupoComponent={InputSelectAction}
                labelSelectSubGrupo={"Status"}
                optionsSubGrupos={[
                    { value: '0', label: 'Selecione...' },
                    ...optionsStatus.map((item) => ({
                        value: item.value,
                        label: item.label,

                    }))
                ]}
                valueSelectSubGrupo={statusSelecionado}
                onChangeSelectSubGrupo={(e) => setStatusSelecionado(e.value)}


                InputSelectMarcasComponent={InputSelectAction}
                labelSelectMarcas={"Pendências"}
                optionsMarcas={[
                    ...optionsPendenciasMalotes.map((item) => ({
                        value: item.IDPENDENCIA,
                        label: item.TXTPENDENCIA

                    }))
                ]}
                valueSelectMarca={pendenciaSelecionada}
                onChangeSelectMarcas={(e) => setPendenciaSelecionada(e.value)}

                InputSelectPendenciaComponent={InputSelectAction}
                labelSelectPendencia={"Modo Pesquisa"}
                optionsPendencia={[           
                    ...optionsData.map((item) => ({
                        value: item.value,
                        label: item.label,

                    }))
                ]}
                valueSelectPendencia={pendenciaSelecionada}
                onChangeSelectPendencia={(e) => setPendenciaSelecionada(e.value)}

                ButtonSearchComponent={ButtonType}
                linkNomeSearch={"Pesquisar"}
                IconSearch={AiOutlineSearch}
                corSearch={"primary"}
                onButtonClickSearch={handleClick}

            />

            {tabelaVisivel && (
                <ActionListaConferenciaMalotes 
                    dadosMalotes={dadosMalotes} 
                    handleClick={handleClick} 
                    optionsModulos={optionsModulos}
                    usuarioLogado={usuarioLogado}
                />
            )}
        </Fragment>
    )
}
