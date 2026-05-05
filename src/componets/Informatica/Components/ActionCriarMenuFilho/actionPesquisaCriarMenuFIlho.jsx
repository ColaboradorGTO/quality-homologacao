import { Controller, useForm } from "react-hook-form";
import Select from 'react-select';
import { Fragment, useEffect } from 'react';
import { ButtonType } from "../../../Buttons/ButtonType";
import { FaAngleDown, FaRegSave } from "react-icons/fa";;
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import { InputFieldModal } from "../../../Buttons/InputFieldModal";
import { AlertError } from "../../../Inputs/alertError";
import FormField from "../../../Formularios/FormField";
//import { schema } from "./schema";
import { FormularioPesquisaCriarMenuFilho } from "./formularioCriarMenuFilho/formulario";
import { useQuery } from "react-query";
import { animacaoCarregamento, fecharAnimacaoCarregamento } from "../../../../utils/animationCarregamento";
import { get } from "../../../../api/funcRequest";
import { useState } from "react";
import { ActionMain } from "../../../Actions/actionMain";
//import { ActionListaCriarMenuFilho } from "./actionListaPesquisaCriarMenuFIlho";
import { ActionListaMenuFilho } from "./actionListaMenuFIlho";

export const ActionPesquisaCriarMenuFilho = ({

    moduloSelecionado,
    setModuloSelecionado,
    complementoUrl,
    setComplementoUrl,
    urlFinal,
    setUrlFinal,
    nomeMenu,
    setNomeMenu,
    onSubmit,

    usuarioLogado
}) => {

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


    /* const fetchListaModulos = async () => {
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
    }; */

    /*     const { data: dadosModulos = [], error: errorModulos, isLoading: isLoadingModulos } = useQuery(
            ['modulos'],
            () => fetchListaModulos(),
            {
                enabled: true,
            }
        ); */
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

    /*  const { handleSubmit, formState: { errors }, clearErrors, control, setError } = useForm({
         mode: "onChange"
     });
 
     const limparTexto = (texto) => {
         return texto
             .normalize("NFD")
             .replace(/[\u0300-\u036f]/g, "")
             .replace(/[^a-zA-Z0-9]/g, "")
             .toLowerCase();
     };
 
     const nomeModuloLimpo = moduloSelecionado?.label
         ? limparTexto(moduloSelecionado.label)
         : "";
 
     const prefixo = `/${nomeModuloLimpo}/ActionPesquisa`;
     const valorFinal = `${prefixo}${complementoUrl}`;
 
     const handleChange = (e) => {
         const texto = e.target.value;
 
         if (!texto.startsWith(prefixo)) return;
 
         let complemento = texto.slice(prefixo.length);
 
         if (complemento.length > 0) {
             complemento = complemento.charAt(0).toUpperCase() + complemento.slice(1);
         }
 
         setComplementoUrl(complemento);
         setUrlFinal(`${prefixo}${complemento}`)
     };
 
     const handleValidatedSubmit = async () => {
         try {
             const dadosParaValidar = {
                 moduloEscolhido: moduloSelecionado,
                 nomeMenuEscolhido: nomeMenu,
                 urlMenuFilho: urlFinal
             };
 
             await schema.validate(dadosParaValidar, { abortEarly: false });
             onSubmit(dadosParaValidar);
         } catch (validationError) {
             console.error('❌ Erro de validação:', validationError);
 
             clearErrors();
             if (validationError.inner && validationError.inner.length > 0) {
                 validationError.inner.forEach(error => {
                     if (error.path) {
                         setError(error.path, {
                             type: 'manual',
                             message: error.message
                         });
                     }
                 });
             }
             const errorMessages = validationError.errors || [validationError.message];
             console.log(`Erro de validação:\n${errorMessages.join('\n')}`);
         }
     }
     return (
         <Fragment>
             <form onSubmit={handleSubmit(handleValidatedSubmit)} style={{ paddingBottom: '4rem' }}>
                 <div className="" style={{ marginTop: "2rem", }} >
                     <div className=" " style={{ marginTop: "18px", width: '100%', }}>
                         <div className="row ">
                             <div className="col-4 mt-4">
                                 <div style={{ width: '100%' }} className="mb-2 ">
 
                                     <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">Selecione um Módulo</label>
                                 </div>
 
                                 <Select
                                     options={dadosModulos?.map((item) => ({
                                         value: item.IDMODULO,
                                         label: item.DSMENU
                                     }))}
                                     value={moduloSelecionado}
                                     onChange={(e) => setModuloSelecionado(e)}
                                 />
                                 {errors.moduloEscolhido && (
                                     <AlertError
                                         error={errors.moduloEscolhido?.value || errors.moduloEscolhido}
                                         onClose={clearErrors}
                                         fieldName="moduloEscolhido"
                                     />
                                 )}
                             </div>
                             {moduloSelecionado && (
                                 <Fragment>
                                     <div className="col-4 ">
                                         <div style={{ width: '100%' }} className="mb-2 ">
 
                                             <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">Nome do menu</label>
                                         </div>
                                         <Controller
                                             name="nomeMenuEscolhido"
                                             control={control}
                                             render={({ field }) => (
                                                 <FormField
                                                     name="nomeMenuEscolhido"
                                                     label={"Nome do Menu na Sidebar"}
                                                     type="text"
                                                     errors={errors}
                                                     clearErrors={clearErrors}
                                                     value={nomeMenu}
                                                     onChangeModal={(e) => {
                                                         const texto = e.target.value;
                                                         const capitalizado = texto.charAt(0).toUpperCase() + texto.slice(1);
                                                         setNomeMenu(capitalizado)
                                                     }
                                                     }
                                                 />
                                             )}
                                         />
                                     </div>
 
                                     <div className="col-4 " >
                                         <div style={{ width: '100%' }} className="mb-2 ">
 
                                             <label style={{ color: '#fff', fontSize: '1.5rem' }} htmlFor="">URL do menu filho</label>
                                         </div>
 
                                         <Controller
                                             name="urlMenuFilho"
                                             control={control}
                                             render={({ field }) => (
                                                 <FormField
                                                     name="urlMenuFilho"
                                                     label={"URL do menu filho"}
                                                     type="text"
                                                     errors={errors}
                                                     clearErrors={clearErrors}
                                                     value={valorFinal}
                                                     onChangeModal={handleChange}
                                                 />
                                             )}
                                         />
                                     </div>
                                     <div className="row mt-3 ml-1">
                                         <ButtonType
                                             className="col-12 mt-2 "
                                             textButton=" Salvar"
                                             cor="success"
                                             Icon={FaRegSave}
                                             iconColo="#FFF"
                                             iconSize={18}
                                             tipo={"submit"}
                                         />
                                     </div>
                                 </Fragment>
                             )}
                         </div>
                     </div>
                 </div>
 
             </form>
         </Fragment>
     ) */

    return (
        <Fragment>
            <h2 style={{ marginBottom: "20px", fontWeight: "bold", color: "#fff" }}>
                Criação de Menu Filho
            </h2>

            <FormularioPesquisaCriarMenuFilho
                dadosMenuPai={dadosMenuPai}
                usuarioLogado={usuarioLogado}
                optionsModulos={optionsModulos}
                refetchMenuFilho={refetchMenuFilho}

            />

            <ActionListaMenuFilho
                dadosMenuFilho={dadosMenuFilho}
                usuarioLogado={usuarioLogado}
                optionsModulos={optionsModulos}
                refetchMenuFilho={refetchMenuFilho}
            />

        </Fragment>
    )

}