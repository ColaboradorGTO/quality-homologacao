import React, { useEffect, useState } from "react"
import { AuthLogin } from "../componets/Formularios/FormLogin"
import { getAnoAtual,  } from "../utils/dataAtual"



export const Home = () => {
  const [data, setData] = useState('')

  useEffect(() => {
    const dataAtual = getAnoAtual()
    setData(dataAtual)
  })
  return (
  
    <div className="page-wrapper overflow-hidden" style={{overflow: "hidden"}}>
      <div className="page-inner bg-brand-gradient">
        <div className="page-content-wrapper bg-transparent m-0">
          <div className="height-10 w-100 shadow-lg px-4 bg-brand-gradient">
            <div className="d-flex align-items-center container p-0">
              <div className="page-logo width-mobile-auto m-0 align-items-center justify-content-center p-0 bg-transparent bg-img-none shadow-0 height-9">
                <a href="#" className="page-logo-link press-scale-down d-flex align-items-center" >
                  <img src="img/logo.png" alt="SmartAdmin WebApp" aria-roledescription="logo" />
                  <span className="page-logo-text mr-1">Softquality SAP</span>
                </a>
              </div>
            </div>
          </div>
          <div className="flex-1" style={{ background: "url(img/svg/pattern-1.svg)", backgroundSize: "cover" }}>
            <div className="container py-4 py-lg-5 my-lg-5 px-4 px-sm-0">
              <div className="row mb-5">
                <div className="col col-md-6 col-lg-7 hidden-sm-down">
                  <h2 className="fs-xxl fw-500 mt-4 text-white">
                    Software de Gestão Unificada
                    <small className="h3 fw-300 mt-3 mb-5 text-white opacity-60">
                      Sistema de Gerenciamento e Controle integrado com o ERP SAP.
                    </small>
                  </h2>
                </div>
                <div className="col-sm-12 col-md-6 col-lg-5 col-xl-5 ml-auto">
                  <h1 className="text-white fw-300 mb-3 d-sm-block d-md-none">
                    Acesso ao Softquality SAP
                  </h1>
                  <div className="card p-4 rounded-plus bg-faded">
                    <AuthLogin  />
                  
                  </div>
                </div>
              </div>

              
              <div className="position-absolute pos-bottom pos-left pos-right p-3 text-center text-white ">
                
              {data} © MettaGroup by &nbsp;<a href='http://mettagroup.com.br' className='text-white opacity-40 fw-500' title='mettagroup.com.br' target='_blank'>mettagroup.com.br</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  
  )
}