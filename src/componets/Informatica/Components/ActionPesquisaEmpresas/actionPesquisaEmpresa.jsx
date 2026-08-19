import { Fragment, useState } from "react"
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento"
import { ActionMain } from "../../../Actions/actionMain"
import { useQuery } from "react-query"
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { get } from "../../../../api/funcRequest"
import { ButtonType } from "../../../Buttons/ButtonType"
import { AiOutlineSearch } from "react-icons/ai"
import { ActionListaEmpresas } from "./actionListaEmpresas"
import { useEffect } from "react"

export const ActionPesquisEmpresa = ({ usuarioLogado }) => {
    const [tableVisivel, setTableVisible] = useState(false)
    const [empresaSelecionada, setEmpresaSelecionada] = useState("")
    const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('')
    const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

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
        { enabled: Boolean(usuarioLogado?.id)}
    );

    const { data: optionsEmpresas = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas } = useQuery(
        "empresas",
        async () => {
            const response = await get(`/empresas`);
            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }

    );

    const fetchListEmpresas = async () => {
        const urlBase = `/listaEmpresas?idEmpresa=${empresaSelecionada}`;
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
            console.error('Erro ao buscar dados da api', error);
            throw error;
        } finally {
            fecharAnimacaoCarregamento();
        }
    };


    const { data: dadosEmpresas = [], error: errorListaEmpresas, isLoading: isLoadingEmpresa, refetch: refetchListaEmpresa } = useQuery(
        ["empresa"],
        () => fetchListEmpresas(),
        { enabled: false, staleTime: 60 * 60 * 1000 }
    );

    const handleChangeEmpresa = (e) => {
        if (e.value === "") {
            setEmpresaSelecionada("")
        } else {
            const empresa = optionsEmpresas.find((item) => item.IDEMPRESA === e.value);
            setEmpresaSelecionada(e.value)
            setEmpresaSelecionadaNome(empresa.NOFANTASIA);
        }
    }

    const handleClick = () => {
      
        refetchListaEmpresa()
        setTableVisible(true)

    }
    return (
        <Fragment>
            <ActionMain
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
                refetch={refetchEmpresas}
            />
        </Fragment>
    );
}