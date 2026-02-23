import React, { Fragment, useEffect, useRef, useState } from "react"
import { get } from "../api/funcRequest";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../utils/animationCarregamento";
import { FaAngleDown, FaRegSave } from "react-icons/fa";;
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { useCriarMenuFilho } from "../componets/ActionPermissoes/hooks/useCriarMenuFilho";
import { FormularioCriarMenuFilho } from "../componets/ActionPermissoes/ActionCriarMenuFilho/formulario";


export const DashBoardMenus = ({ }) => {

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
        usuarioLogado,
        setUsuarioLogado,
        navigate,
        optionsModulos,
        onSubmit
    } = useCriarMenuFilho();

    useEffect(() => {
        const storedModule = JSON.parse(localStorage.getItem('moduloselecionado'));
        if (storedModule) {
            setSelectedModule(storedModule);
        }
    }, [usuarioLogado, navigate]);

    const fetchListaModulos = async () => {
        try {
            const urlApi = `/menu-pai`;
            const response = await get(urlApi);

            if (response.data.length && response.data.length === pageSize) {

                let allData = [...response.data];
                animacaoCarregamento(`Carregando... Página ${currentPage} de ${response.data.length}`, true);

                async function fetchNextPage(currentPage) {
                    try {
                        currentPage++;
                        const responseNextPage = await get(`${urlApi}&page=${currentPage}`);
                        if (responseNextPage.data.length) {
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

    const { data: dadosModulos = [], error: errorModulos, isLoading: isLoadingModulos } = useQuery(
        ['modulos'],
        () => fetchListaModulos(),
        {
            enabled: true, staleTime: Infinity, cacheTime: Infinity,
        }
    );

    const selecioneModulos = (moduloURL) => {
        const modulos = optionsModulos[0]?.modulos || [];
        const moduloEncontrado = modulos.find(modulo => modulo.DSMODULO == moduloURL);

        if (moduloEncontrado) {
            setSelectedModule(moduloEncontrado);
            localStorage.setItem('moduloselecionado', JSON.stringify(moduloEncontrado));
            navigate(`/${moduloEncontrado.DSMODULO}`);
        }
    };
    const modulosDisponiveis = optionsModulos[0]?.modulos || [];
    const menuItems = modulosDisponiveis?.map((modulo) => ({
        label: modulo.NOME,
        icon: modulo.src,
        command: () => selecioneModulos(modulo.DSMODULO),
    }));

    return (
        <Fragment>
            <main className="page-content page-inner bg-brand-gradient overflow-hidden" >
                <div style={{ display: "flex", margin: '2rem 0rem 4rem 0rem', alignContent: 'center', textAlign: 'center' }} className="">
                    <div className="text-center" style={{ width: '100%' }}>

                        <h1 className=" " style={{ color: "#fff", fontWeight: 600 }}>
                            Modulo Criação de Menu Filho
                        </h1>
                        <div className="text-center py-3 d-flex justify-content-center">
                            <a href="javascript:void(0)" className="page-logo-link press-scale-down d-flex align-items-center" >
                                <img src="img/logo.png" alt="SmartAdmin WebApp" aria-roledescription="logo" />
                                <span className="page-logo-text mr-1">Softquality </span>
                            </a>
                        </div>
                    </div>
                    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Menu model={menuItems} popup ref={menuLeft} />
                        <Button
                            label="Módulos do Usuário"
                            icon={<FaAngleDown size={20} />}
                            onClick={(event) => menuLeft.current.toggle(event)}
                            style={{
                                backgroundColor: '#FFCA5B',
                                color: '#000',
                                fontWeight: 'bold',
                                borderRadius: '1rem',
                                margin: '1rem',
                                transition: '0.3s ease-in-out',
                                height: '3rem',
                            }}
                            className="p-3 surface-0 shadow-2"
                            type="button"
                        />
                    </div>
                </div>
                <FormularioCriarMenuFilho
                    moduloSelecionado={moduloSelecionado}
                    setModuloSelecionado={setModuloSelecionado}
                    complementoUrl={complementoUrl}
                    setComplementoUrl={setComplementoUrl}
                    urlFinal={urlFinal}
                    setUrlFinal={setUrlFinal}
                    nomeMenu={nomeMenu}
                    setNomeMenu={setNomeMenu}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    selectedModule={selectedModule}
                    setSelectedModule={setSelectedModule}
                    moduloUsuario={moduloUsuario}
                    setModuloUsuario={setModuloUsuario}
                    menuLeft={menuLeft}
                    usuarioLogado={usuarioLogado}
                    setUsuarioLogado={setUsuarioLogado}
                    navigate={navigate}
                    optionsModulos={optionsModulos}
                    onSubmit={onSubmit}
                    menuItems={menuItems}
                    dadosModulos={dadosModulos}


                />
            </main>
        </Fragment >
    )
}
