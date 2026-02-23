import React, { Fragment, useEffect, useState } from "react"
import { useAuth } from "../Providers/AuthContext";;
import { IoMdArrowBack } from "react-icons/io";
import { allModulos } from "../../allUsers.json"
import { useNavigate } from "react-router-dom";
import { CardModulos } from "../componets/CardsModulos";
import { useFetchData } from "../hooks/useFetchData";
import { useQuery } from "react-query";
import { get } from "../api/funcRequest";

// import { imgAdministrativo } from '../../public/img/icons/administrativo.png';
// import { imgInformatica } from '../../public/img/icons/informatica.png';
// import { imgGerencia } from '../../public/img/icons/gerencia.png';
// import { imgRH } from '../../public/img/icons/rh.png';
// import { imgMarketing } from '../../public/img/icons/marketing.png';
// import { imgFinanceiro } from '../../public/img/icons/financeiro.png';
// import { imgCompras } from '../../public/img/icons/compras.png';
// import { imgComprasAdm } from '../../public/img/icons/compras.png';
// import { imgContabilidade } from '../../public/img/icons/contabilidade.png';
// import { imgExpedicao } from '../../public/img/icons/expedicao.png';
// import { imgConferenciaCega } from '../../public/img/icons/conferenciaCega.png';
// import { imgCadastro } from '../../public/img/icons/cadastro.png';
// import { imgEtiquetagem } from '../../public/img/icons/etiqueta.png';
// import { imgResumoVendas } from '../../public/img/icons/resumoVendas.png';
// import { imgComercial } from '../../public/img/icons/comercial.png';
// import { imgVoucher } from '../../public/img/icons/voucher.png';
// import { imgMalote } from '../../public/img/icons/malote.png';



export const Modulo = ({usuarioLogado}) => {
  const { handleLogout, usuario } = useAuth();
  const [selectedModule, setSelectedModule] = useState(null)

  const { data: optionsModulos = [], error: errorFuncionarios, isLoading: isLoadingFuncionarios, refetch: refetchFuncionarios } = useQuery(
    'modulos',
    async () => {
      const response = await get(`/menus-usuario?idUsuario=${usuarioLogado?.id}`);
      
      return response.data;
    },
    { enabled: Boolean(usuarioLogado?.id), staleTime: 5 * 60 * 1000, }
  );


  useEffect(() => {
    const storedModule = JSON.parse(localStorage.getItem('moduloselecionado'));
    if (storedModule) {
      setSelectedModule(storedModule);
    }
  }, [usuarioLogado, navigate]);

 
  const selecioneModulo = (moduloURL) => {
    const moduloSelecionado = allModulos.find((modulo) => modulo.url === moduloURL);
    console.log(allModulos, 'modulo')
    if (moduloSelecionado) {
      localStorage.setItem('moduloselecionado', JSON.stringify(moduloSelecionado));
      setSelectedModule(moduloSelecionado)
   
      navigate(moduloSelecionado.url);
      window.history.replaceState({}, document.title, window.location.pathname);
    
    }
  }


// Verifica se o módulo atual é o selecionado
  const isModuleSelected = selectedModule && window.location.pathname === selectedModule.url;

  return (

    <Fragment>

      <main  className="page-content page-inner bg-brand-gradient overflow-hidden" style={{overflow: "hidden"}}>
        <div className="row mt-4" >
          <div  className="col-lg-6 col-xl-6 order-lg-1 order-xl-1 mt-6">

            <div className=" mb-g rounded-top">
              <div className="row  ">

                <div className="col-12 mt-4">
                  <div className="text-center">

                    <h1 className="mb-0 " style={{ color: "#fff", fontWeight: 600, lineHeight: "25px", letterSpacing: "1px" }}>
                      Seja Bem-Vindo ao
                    </h1>
                  </div>
                  <div className="text-center py-3 d-flex justify-content-center">
                    <a href="javascript:void(0)" className="page-logo-link press-scale-down d-flex align-items-center" >
                      <img src="img/logo.png" alt="SmartAdmin WebApp" aria-roledescription="logo" />
                      <span className="page-logo-text mr-1">Softquality SAP</span>
                    </a>
                  </div>
                </div>
                <div className="col-12">

                  <div className="d-flex flex-column align-items-center justify-content-center p-4">
                    <img src="img/demo/avatars/avatar-m.png" className="rounded-circle shadow-2 img-thumbnail" alt="" />
                    <h5 className="mb-0 text-center mt-3" style={{ color: "#fff", fontWeight: 600, lineHeight: "25px", letterSpacing: "1px", textTransform: "uppercase" }}>
                      {usuarioLogado?.NOFUNCIONARIO}
                      <small className="text-muted mb-0">
                        {usuarioLogado?.NOFANTASIA}
                        </small>
                    </h5>

                  </div>
                </div>

                <div className="col-12">
                  <h3 style={{ color: "#fff", textAlign: 'center' }}>

                    Software de Gestão Unificada <br />
                    Sistema de Gerenciamento e Controle integrado com o ERP SAP.
                  </h3>
                </div>
              </div>
            </div>

          </div>

          <div className="col-lg-6 col-xl-6 order-lg-1 order-xl-1">
            <div class="mb-g">
              <div class="row ">
                <div class=" m-2">
                  <div class=" text-left ">
                    <a href="/" onClick={handleLogout} class="btn font-weight-bold" style={{ color: "#fff", fontSize: "22px" }}>
                      <IoMdArrowBack size={40} />

                    </a>
                  </div>
                </div>
                <div class="">
                  <div class="p-3">
                    <h1 class="mb-0 " style={{ color: "#fff", fontSize: "32px" }}>
                      Selecione o Modulo
                    </h1>
                  </div>
                </div>


              </div>
                <div className="row">

                  {allModulos.map((modulo) => (
                    <Fragment key={modulo.id}>


                      <CardModulos
                        src={modulo.src}
                        alt={modulo.alt}
                        nome={modulo.nome}
                        isSelected={isModuleSelected && modulo.url === selectedModule.url}
                        handleClick={() => selecioneModulo(modulo.url)}
                      />
                    </Fragment>

                  ))}
                </div>
            </div>
          </div>
        </div>
      </main>
    </Fragment >
  )
}