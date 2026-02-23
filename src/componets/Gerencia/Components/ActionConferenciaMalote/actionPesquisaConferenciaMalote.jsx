import { AiOutlineSearch } from "react-icons/ai"
import { ButtonType } from "../../../Buttons/ButtonType"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { InputField } from "../../../Buttons/Input"
import { ActionMain } from "../../../Actions/actionMain"
import { getDataAtual } from "../../../../utils/dataAtual"
import { Fragment, useEffect, useState } from "react"
import { useQuery } from "react-query"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { get } from "../../../../api/funcRequest"
import { ActionListaConferenciaMalotes } from "./actionListaConferenciaMalotes"


export const ActionPesquisaConferenciaMalote = ({ usuarioLogado }) => {
    const [dataPesquisaInicio, setDataPesquisaInicio] = useState("");
    const [dataPesquisaFim, setDataPesquisaFim] = useState("");
    const [tabelaVisivel, setTabelaVisivel] = useState(false);
    const [statusSelecionado, setStatusSelecionado] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [empresaSelecionada, setEmpresaSelecionada] = useState("");
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
    { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000,}
    );


    const fetchListaMalotes = async () => {
        const idEmpresa = empresaSelecionada == '' ? usuarioLogado?.IDEMPRESA : empresaSelecionada;
        const urlBase = `/malotes-por-loja?idEmpresa=${idEmpresa}&statusMalote=${statusSelecionado}&dataPesquisaInicio=${dataPesquisaInicio}&dataPesquisaFim=${dataPesquisaFim}`;
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

    const { data: dadosMalotes = [], error: errorMalotes, isLoading: isLoadingMalotes, refetch: refetch } = useQuery(
        ['malotes-por-loja', ],
        () => fetchListaMalotes(),
        { enabled: false, staleTime: 5 * 60 * 1000, }
    );
   

    const handleClick = () => {
        setCurrentPage(prevPage => prevPage + 1);
        setTabelaVisivel(true);
        refetch();
    }

    const optionsData = [
        { value: 'Malote', label: 'Data Caixa' },
        { value: 'Conferido', label: 'Data Conferido' },
    ]

    const optionsStatus = [
        { value: '', label: 'Selecione um Status' },
        { value: 'Pendente de Envio', label: 'Pendente de Envio' },
        { value: 'Enviado', label: 'Enviado' },
        { value: 'Recepcionado', label: 'Recepcionado' },
        { value: 'Devolvido', label: 'Devolvido'},
        { value: 'Conferido', label: 'Conferido'},
        { value: 'Reenviado', label: 'Reenviado'},
    ]
    
    return (

        <Fragment>

            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Envio Malotes"]}
                title="Lista de Malotes por Período"


                InputFieldDTInicioComponent={InputField}
                labelInputFieldDTInicio={"Data Início"}
                valueInputFieldDTInicio={dataPesquisaInicio}
                onChangeInputFieldDTInicio={(e) => setDataPesquisaInicio(e.target.value)}

                InputFieldDTFimComponent={InputField}
                labelInputFieldDTFim={"Data Fim"}
                valueInputFieldDTFim={dataPesquisaFim}
                onChangeInputFieldDTFim={(e) => setDataPesquisaFim(e.target.value)}

                InputSelectEmpresaComponent={InputSelectAction}
                labelSelectEmpresa={"Status"}
                optionsEmpresas={[
                    //{ value: '0', label: 'Selecione...' },
                    ...optionsStatus.map((item) => ({
                        value: item.value,
                        label: item.label,

                    }))
                ]}
                valueSelectEmpresa={statusSelecionado}
                onChangeSelectEmpresa={(e) => setStatusSelecionado(e.value)}            

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
                    usuarioLogado={usuarioLogado}
                    optionsModulos={optionsModulos}  
                    refetch={refetch}  
                />
            )}
        </Fragment>
    )
}