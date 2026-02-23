import React, { Fragment, useEffect, useState, Suspense, lazy } from "react"
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { HeaderMain } from "../componets/Header";
import { MenuButton } from "../componets/Buttons/menuButton";
import { FooterMain } from "../componets/Footer";
import { useQuery } from "react-query";
import { get } from "../api/funcRequest";

const ResumoDashBoardContabilidade = lazy(() => import("../componets/Contabilidade/Components/ResumoContabilidade/ResumoDashBoardContabilidade").then(module => ({ default: module.ResumoDashBoardContabilidade })));
const ActionPesquisaVendasMarca = lazy(() => import("../componets/Contabilidade/Components/ActionVendasMarca/actionPesquisaVendasMarca").then(module => ({ default: module.ActionPesquisaVendasMarca })));
const ActionPesquisaVendasContingencia = lazy(() => import("../componets/Contabilidade/Components/ActionVendas/actionPesquisaVendasContingencia").then(module => ({ default: module.ActionPesquisaVendasContingencia })));
const ActionPesquisaVendasXML = lazy(() => import("../componets/Contabilidade/Components/ActionVendasXML/actionPesquisaVendasXML").then(module => ({ default: module.ActionPesquisaVendasXML })));
const ActionPesquisaProductoPreco = lazy(() => import("../componets/Contabilidade/Components/ActionProdutoPreco/actionPesquisaProdutosPreco").then(module => ({ default: module.ActionPesquisaProductoPreco })));
const ActionPesquisaAlvaraEmpresa = lazy(() => import("../componets/Contabilidade/Components/ActionAlvaraEmpresas/actionPesquisaAlvaraEmpresa").then(module => ({ default: module.ActionPesquisaAlvaraEmpresa })));

export const DashBoardContabilidade = () => {
  const [resumoVisivel, setResumoVisivel] = useState(true);
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [componentToShow, setComponentToShow] = useState("");
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);

  const navigate = useNavigate();

  function handleShowComponent(componentName) {
    setComponentToShow(componentName);
  }

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');

    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);;
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {

  }, [usuarioLogado]);

  const { data: optionsModulosPage = [], error: errorModulos, isLoading: isLoadingModulos, refetch: refetchModulos } = useQuery(
    'menus-usuario',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}&idModulo=${selectedModule?.ID}`);

      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 5 * 60 * 1000, }
  );
  const permissaoUsuario = selectedModule.menuPai.menuFilho;
  const {
    ID,
  } = permissaoUsuario.map(item => ({
    ID: item.ID,
  })).reduce((acc, curr) => {
    return { ...acc, ...curr };
  }, {});


  let component = null;

  switch (componentToShow) {
    case "/contabilidade/ResumoDashBoardContabilidade":
      component = <ResumoDashBoardContabilidade />;
      break;
    case "/contabilidade/ActionPesquisaVendasMarca":
      component = <ActionPesquisaVendasMarca />;
      break;
    case "/contabilidade/ActionPesquisaVendasContingencia":
      component = <ActionPesquisaVendasContingencia usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/contabilidade/ActionPesquisaVendasXML":
      component = <ActionPesquisaVendasXML />;
      break;
    case "/contabilidade/ActionPesquisaProductoPreco":
      component = <ActionPesquisaProductoPreco />;
      break;
    case "/contabilidade/ActionPesquisaAlvaraEmpresa":
      component = <ActionPesquisaAlvaraEmpresa  usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    default:
      break;
  }

  return (

    <Fragment>
      {usuarioLogado && (
        <SidebarProvider>

          <div className="page-wrapper">
            <div className="page-inner">
              <MenuSidebarAdmin
                componentToShow={componentToShow}
                handleShowComponent={handleShowComponent}
              />
              <div className="page-content-wrapper">
                <HeaderMain optionsModulosPage={optionsModulosPage}/>

                <main id="js-page-content" role="main" className="page-content">
                  <div className="row">
                    <div className="col-xl-12">
                      <div id="panel-1" className="panel">
                        <div className="panel-container show">
                          <div className="panel-content">
                            <Suspense fallback={<div>Loading...</div>}>
                              {resumoVisivel && !componentToShow && (
                                <ResumoDashBoardContabilidade />
                              )}
                              {componentToShow && component}
                            </Suspense>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </main>

                <Fragment>
                  <MenuButton />
                  <FooterMain />
                </Fragment>
              </div>
            </div>
          </div>
        </SidebarProvider>
      )}

    </Fragment>
  )
}