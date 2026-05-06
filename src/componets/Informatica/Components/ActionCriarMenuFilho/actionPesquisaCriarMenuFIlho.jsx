import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment, useEffect } from 'react';
import { ButtonType } from "../../../Buttons/ButtonType";
import { FaAngleDown, FaRegSave } from "react-icons/fa";;
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputSelectAction } from "../../../Inputs/InputSelectAction"
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { AlertError } from "../../../Inputs/alertError";
import FormField from "../../../Formularios/FormField";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { get } from "../../../../api/funcRequest";
import { useState } from "react";
import { ActionMain } from "../../../Actions/actionMain";
import { ActionListaMenuFilho } from "./actionListaMenuFIlho";
import { FiSend } from "react-icons/fi";
import { useCriarMenuFilho } from "./hook/useCriarMenuFilho";
import { InputField } from "../../../Buttons/Input";

export const ActionPesquisaCriarMenuFilho = ({ usuarioLogado }) => {
   
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
        { enabled: Boolean(usuarioLogado?.id), staleTime: 60 * 60 * 1000, }
    );

    const fetchListaMenuFilho = async () => {
        const urlBase = `/listaMenusFilhos`;
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

    const { data: dadosMenuFilho = [], error: errorMenuFilho, isLoading: isLoadingMenuFilho, refetch: refetchMenuFilho } = useQuery(
        'fetchListaMenuFilho',
        () => fetchListaMenuFilho(),
        { enabled: true, staleTime: 60 * 60 * 1000 }
    );

    const { data: dadosMenuPai = [], error: errorMenuPai, isLoading: isLoadingMenuPai, refetch: refetchMenuPai } = useQuery(
        ['menus-pai'],
        async () => {
            const response = await get(`/menu-pai`);

            return response.data;
        },
        { enabled: true, staleTime: 60 * 60 * 1000, }
    );

    const {
        moduloSelecionado,
        setModuloSelecionado,
        complementoUrl,
        setComplementoUrl,
        urlFinal,
        setUrlFinal,
        nomeMenu,
        setNomeMenu,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        selectedModule,
        setSelectedModule,
        moduloUsuario,
        setModuloUsuario,
        menuLeft,
        valorFinal,
        handleChange,
        onSubmit

    } = useCriarMenuFilho({
        usuarioLogado,
        optionsModulos,
        refetchMenuFilho
    });

    return (
        <Fragment>
            <ActionMain
                linkComponentAnterior={["Home"]}
                linkComponent={["Criar Menu Filho"]}
                title="Criar Menu Filho"

                InputSelectEmpresaComponent={InputSelectAction}
                optionsEmpresas={[
                    ...dadosMenuPai.map((item) => ({
                        value: item.IDMODULO,
                        label: item.DSMENU
                    }))
                ]}
                labelSelectEmpresa={"Empresas"}
                valueSelectEmpresa={moduloSelecionado}
                onChangeSelectEmpresa={setModuloSelecionado}

                InputFieldComponent={InputField}
                labelInputField={'Nome do menu'}
                placeHolderInputFieldComponent={'Nome do Menu na Sidebar'}
                valueInputField={nomeMenu}
                onChangeInputField={(e) => {
                    const texto = e.target.value;
                    const capitalizado = texto.charAt(0).toUpperCase() + texto.slice(1);
                    setNomeMenu(capitalizado)
                }}

                InputFieldVendaCPFCNPJComponent={InputField}
                placeHolderInputFieldVendaCPFCNPJ={"URL do menu filho"}
                labelInputFieldVendaCPFCNPJ={"URL do menu filho"}
                valueInputFieldVendaCPFCNPJ={valorFinal}
                onChangeInputFieldVendaCPFCNPJ={handleChange}

                ButtonTypeCadastro={ButtonType}
                linkNome={'Salvar'}
                corCadastro={"success"}
                onButtonClickCadastro={onSubmit}
                IconCadastro={FaRegSave}
                styleCadastro={moduloSelecionado ? { display: 'block' } : { display: 'none' }}
            />

            <ActionListaMenuFilho
                dadosMenuFilho={dadosMenuFilho}
                usuarioLogado={usuarioLogado}
                optionsModulos={optionsModulos}
                refetchMenuFilho={refetchMenuFilho}
                dadosMenuFilho={dadosMenuFilho}
                dadosMenuPai={dadosMenuPai}

            />

        </Fragment>
    )
}