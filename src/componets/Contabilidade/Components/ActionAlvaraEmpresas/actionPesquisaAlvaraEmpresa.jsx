import React, { Fragment, useEffect, useState } from "react"
import { ActionListaAlvaras } from "./actionListaAlvaraEmpresa";
import { ActionMain } from "../../../Actions/actionMain";
import { ButtonType } from "../../../Buttons/ButtonType";
import { AiOutlineSearch } from "react-icons/ai";
import { InputField } from "../../../Buttons/Input";
import { get } from "../../../../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import Swal from "sweetalert2";
import { InputSelectAction } from "../../../Inputs/InputSelectAction";
import { useFetchData } from "../../../../hooks/useFetchData";

export const ActionPesquisaAlvaraEmpresa = ({ usuarioLogado, ID }) => {
    const [filtros, setFiltros] = useState({});
    const [marcaSelecionada, setMarcaSelecionada] = useState('');
    const [ufSelecionada, setUfSelecionada] = useState('');
    const [satusFilialSelecionada, setSatusFilialSelecionada] = useState('');
    const [empresaSelecionada, setEmpresaSelecionada] = useState('');
    const [tipoAlvara, setTipoAlvara] = useState('');
    const [tipoAvaraAplicado, setTipoAvaraAplicado] = useState('');
    const [tabelaVisivel, setTabelaVisivel] = useState(false);
    const [idEmpresaSelecionada, setIdEmpresaSelecionada] = useState(null);
    const [produto, setProduto] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(1000);

    //console.log(marcaSelecionada, 'marcaSelecionada')
    //console.log(ufSelecionada, 'uf')
    //console.log(satusFilialSelecionada, 'status')
    //console.log(empresaSelecionada, 'empresa')
    //console.log(tipoAlvara, 'tipoAlvara')
    //console.log(usuarioLogado.id, 'usuarioLogado')

    const { data: optionsModulos = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
        'menus-usuario-excecao',
        async () => {
            const response = await get(`/menus-usuario-excecao?idUsuario=${usuarioLogado?.id}&idMenuFilho=${ID}`);

            return response.data;
        },
        { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
    );

    const { data: marcas = [], error: errorMarcas, isLoading: isLoadingMarcas } = useFetchData('marcasLista', '/marcasLista');

    const { data: alvarasLista = [], error: errorAlvara, isLoading: isLoadingAlvara, refetch: refetchAlvara
    } = useQuery(
        ['alvarasLista'],
        async () => {
            const response = await get(`/alvaras`);

            return response.data;
        },
        {
            staleTime: 5 * 60 * 1000
        }
    );


    const { data: empresasLista = [], error: errorEmpresas, isLoading: isLoadingEmpresas, refetch: refetchEmpresas
    } = useQuery(
        ['empresasLista', marcaSelecionada, ufSelecionada, satusFilialSelecionada],
        async () => {
            const response = await get(
                `/todas-empresas?idSubGrupoEmpresa=${marcaSelecionada || ""}&uf=${ufSelecionada || ""}&stAtivo=${satusFilialSelecionada || ""}`
            );

            return response.data;
        },
        {
            staleTime: 5 * 60 * 1000
        }
    );
    // console.log(empresasLista, 'empresasLista')

    const fetchListaAlvaraEmpresa = async () => {
        try {

            const urlApi = `/alvaras-empresa?idFilial=${empresaSelecionada}&idSubGrupoEmpresa=${marcaSelecionada}&stAtivo=${satusFilialSelecionada}&ufFiliais=${ufSelecionada}`;
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
            console.error('Erro ao buscar dados:', error);
            throw error;
        } finally {
            fecharAnimacaoCarregamento();
        }
    };

    const { data: dadosAlvaraEmpresa = [], error: errorAlvaraEmpresa, isLoading: isLoadingAlvaraEmpresa, refetch: refetchAlvaraEmpresa } = useQuery(
        ['fetchListaAlvaraEmpresa', empresaSelecionada, marcaSelecionada, satusFilialSelecionada, ufSelecionada],
        fetchListaAlvaraEmpresa,
        { enabled: false },
    );

    const {
        data: dadosAlvaraEmpresaSelecionada = [],  refetch: refetchAlvaraSelecionado, isLoading : isLoadingAlvaraSelecionado} = useQuery(
        ['vinculo-alvara', idEmpresaSelecionada],
        async () => {
            const response = await get(
                `/alvaras-empresa-detalhe?idFilial=${idEmpresaSelecionada}`
            );
            return response.data;
        },
        {
            enabled: !!idEmpresaSelecionada,
           
        }
    );

    const optionsUf = [
        { value: '', label: 'Todos' },
        { value: 'DF', label: 'DF' },
        { value: 'GO', label: 'GO' },
        { value: 'MG', label: 'MG' },

    ]

    const optionStatusFilial = [
        { value: '', label: 'Todos' },
        { value: 'True', label: 'Ativo' },
        { value: 'False', label: 'Inativo' },

    ]

    const handleClick = () => {
        setTipoAvaraAplicado(tipoAlvara)
        refetchAlvaraEmpresa()
        setTabelaVisivel(true);
    }

    return (

        <Fragment>
            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Alvarás Empresas"]}
                title="Alvarás Empresas"
                subTitle

                InputSelectUFComponent={InputSelectAction}
                labelSelectUF={'UF'}
                optionsSelectUF={[
                    ...optionsUf.map((uf) => ({
                        value: uf.value,
                        label: uf.label
                    }))
                ]}
                valueSelectUF={ufSelecionada}
                onChangeSelectUF={(e) => setUfSelecionada(e.value)}

                labelSelectEmpresa={"Marca"}
                InputSelectEmpresaComponent={InputSelectAction}
                optionsEmpresas={[

                    { value: '', label: 'Todos' },
                    { value: 'OUTLET', label: 'OT - OUTLET' },
                    ...marcas.map((marcas) => ({
                        value: marcas.IDGRUPOEMPRESARIAL,
                        label: marcas.DSGRUPOEMPRESARIAL,
                    }))
                ]}

                valueSelectEmpresa={marcaSelecionada}
                onChangeSelectEmpresa={(e) => setMarcaSelecionada(e.value)}

                InputSelectFilialComponent={InputSelectAction}
                labelSelectFilial={'Filiais'}
                optionsFilial={[
                    { value: "", label: "Todos" },
                    ...empresasLista.map((item) => ({
                        value: item.IDEMPRESA,
                        label: item.NOFANTASIA
                    }))
                ]}
                valueSelectFilial={empresaSelecionada}
                onChangeSelectFilial={(e) => setEmpresaSelecionada(e.value)}

                InputSelectStatusFiliaisComponent={InputSelectAction}
                LabelSelectStatusFiliais={'Status Filiais'}
                optionStatusFiliais={[
                    ...optionStatusFilial.map((item) => ({
                        value: item.value,
                        label: item.label
                    }))
                ]}
                valueSelectStatusFiliais={satusFilialSelecionada}
                onChangeStatusFiliais={(e) => setSatusFilialSelecionada(e.value)}

                InputSelectAlvarasComponent={InputSelectAction}
                LabelSelectAlvaras={'Alvarás'}
                optionAlvaras={[
                    { value: "", label: "Todos" },
                    ...alvarasLista.map((item) => ({
                        value: item.IDALVARA,
                        label: item.DESCRICAO
                    }))
                ]}
                valueSelectAlvaras={tipoAlvara}
                onChangeAlvaras={(e) => setTipoAlvara(e.value)}

                ButtonSearchComponent={ButtonType}
                linkNomeSearch={"Pesquisar"}
                onButtonClickSearch={handleClick}
                corSearch={"primary"}
                IconSearch={AiOutlineSearch}

            />


            {tabelaVisivel && (
                <ActionListaAlvaras
                    dadosAlvaraEmpresa={dadosAlvaraEmpresa}
                    tipoAvaraAplicado={tipoAvaraAplicado}
                    optionsModulos={optionsModulos}
                    usuarioLogado={usuarioLogado}
                    refetchAlvaraEmpresa={refetchAlvaraEmpresa}
                    dadosAlvaraEmpresaSelecionada={dadosAlvaraEmpresaSelecionada}
                    refetchAlvaraSelecionado={refetchAlvaraSelecionado}
                    idEmpresaSelecionada = {idEmpresaSelecionada}
                    setIdEmpresaSelecionada={setIdEmpresaSelecionada}

                />
            )}

        </Fragment>
    )
}

