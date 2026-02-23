import React, { Fragment, useEffect, useState, Suspense, lazy } from "react"
import { useNavigate } from "react-router-dom";
import { SidebarProvider } from "../componets/Sidebar/SidebarContext";
import { MenuSidebarAdmin } from "../componets/Sidebar/sidebar";
import { HeaderMain } from "../componets/Header";
import { MenuButton } from "../componets/Buttons/menuButton";
import { FooterMain } from "../componets/Footer";
import { get } from "../api/funcRequest";
import { useQuery } from "react-query";

const InformaticaActionHome = lazy(() => import("../componets/Informatica/Components/ActionHome/informaticaActionHome").then(module => ({ default: module.InformaticaActionHome })));
const ActionPesquisaVendas = lazy(() => import("../componets/Informatica/Components/ActionListaVendas/actionPequisaVendas").then(module => ({ default: module.ActionPesquisaVendas })));
const ActionPesquisaFuncionarios = lazy(() => import("../componets/Informatica/Components/ActionFuncionarios/actionPesquisaFuncionarios").then(module => ({ default: module.ActionPesquisaFuncionarios })));
const ActionPesquisaProdutosPreco = lazy(() => import("../componets/Informatica/Components/ActionProdutoPreco/actionPesquisaProdutosPreco").then(module => ({ default: module.ActionPesquisaProdutosPreco })));
const ActionPesquisaVendasAlloc = lazy(() => import("../componets/Informatica/Components/ActionVendasAlloc/actionPesquisaVendasAlloc").then(module => ({ default: module.ActionPesquisaVendasAlloc })));
const ActionPesquisaVendasContigencia = lazy(() => import("../componets/Informatica/Components/ActionVendasContigencia/actionPesquisaVendasContigencia").then(module => ({ default: module.ActionPesquisaVendasContigencia })));
const ActionPesquisaCliente = lazy(() => import("../componets/Informatica/Components/ActionCliente/actionPesquisaCliente").then(module => ({ default: module.ActionPesquisaCliente })));
const ActionPesquisaExportarDadosCSVCredSystem = lazy(() => import("../componets/Informatica/Components/ActionExportarDadosCSV/actionPesquisaExportarDadosCSVCredSystem").then(module => ({ default: module.ActionPesquisaExportarDadosCSVCredSystem })));
const ActionPesquisaLinkRelatorioBi = lazy(() => import("../componets/Informatica/Components/ActionLinkRelatorioBI/actionPesquisaLinkRelatorioBI").then(module => ({ default: module.ActionPesquisaLinkRelatorioBi })));
const ActionPesquisaRelatorioBI = lazy(() => import("../componets/Informatica/Components/ActionRelatorioBI/actionPesquisaRelatorioBI").then(module => ({ default: module.ActionPesquisaRelatorioBI })));
const ActionPesquisaDuplicarPermissao = lazy(() => import("../componets/Informatica/Components/ActionPermissao/actionPesquisaPerfilPermissao").then(module => ({ default: module.ActionPesquisaPerfilPermissao })));
const ActionPesquisEmpresa = lazy(() => import("../componets/Informatica/Components/ActionPesquisaEmpresas/actionPesquisaEmpresa").then(module => ({ default: module.ActionPesquisEmpresa })));
const ActionPesquisaNfce = lazy(() => import("../componets/Informatica/Components/ActionValidaVendasContigencia/actionPesquisaNfce").then(module => ({ default: module.ActionPesquisaNfce })));

export const DashBoardInformatica = () => {
  const [actionVisivel, setActionVisivel] = useState(true);
  const storedModule = localStorage.getItem('moduloselecionado');
  const selectedModule = JSON.parse(storedModule);
  const [componentToShow, setComponentToShow] = useState("");
 const [usuarioLogado, setUsuarioLogado] = useState(null);

  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');
    if (usuarioArmazenado) {
      const parsedUsuario = JSON.parse(usuarioArmazenado);
      setUsuarioLogado(parsedUsuario);
    }
  }, []);

  useEffect(() => {

  }, [usuarioLogado]);
  function handleShowComponent(componentName) {
    setComponentToShow(componentName);
  }

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
    case "/informatica/InformaticaActionHome":
      component = <InformaticaActionHome usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/informatica/ActionPesquisaVendas":
      component = <ActionPesquisaVendas />;
      break;
    case "/informatica/ActionPesquisaFuncionarios":
      component = <ActionPesquisaFuncionarios usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/informatica/ActionPesquisaProdutosPreco":
      component = <ActionPesquisaProdutosPreco />;
      break;
    case "/informatica/ActionPesquisaVendasAlloc":
      component = <ActionPesquisaVendasAlloc />;
      break;
    case "/informatica/ActionPesquisaVendasContigencia":
      component = <ActionPesquisaVendasContigencia />;
      break;
    case "/informatica/ActionPesquisaCliente":
      component = <ActionPesquisaCliente />;
      break;
    case "/informatica/ActionPesquisaExportarDadosCSVCredSystem":
      component = <ActionPesquisaExportarDadosCSVCredSystem usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/informatica/ActionPesquisaRelatorioBI":
      component = <ActionPesquisaRelatorioBI usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
    case "/informatica/ActionPesquisaLinkRelatorioBi":
      component = <ActionPesquisaLinkRelatorioBi usuarioLogado={usuarioLogado} ID={ID} />;
      break;
    case "/informatica/ActionPesquisaDuplicarPermissao":
      component = <ActionPesquisaDuplicarPermissao usuarioLogado={usuarioLogado} ID={ID}/>;
      break;
      case "/informatica/ActionPesquisaEmpresas":
        component = <ActionPesquisEmpresa usuarioLogado={usuarioLogado} ID={ID} />;
        break;
      case "/informatica/ActionPesquisaNfce":
        component = <ActionPesquisaNfce usuarioLogado={usuarioLogado} ID={ID} />;
        break;
    default:
      component = null;
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
                        {actionVisivel && !componentToShow && (<InformaticaActionHome usuarioLogado={usuarioLogado} ID={ID} />)}

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
