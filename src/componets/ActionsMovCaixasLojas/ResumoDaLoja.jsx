import { Fragment } from "react"
import { AiOutlineUser } from 'react-icons/ai';
import { BsGem, BsGlobe } from 'react-icons/bs';
import { FaRegLightbulb } from 'react-icons/fa';


export const ResumoDaLoja = () => {
  return (

    <Fragment>
      <div className="row">
        <div className="col-sm-6 col-xl-2" >
          <div className="p-3 bg-primary-300 rounded overflow-hidden position-relative text-white mb-g">
            <div className="vendaLoja">
              <h3 className="display-4 d-block l-h-n m-0 fw-500">
                0,00

              </h3>
              <small className="m-0 l-h-n">Vendas Loja </small>
            </div>
            <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" />
          </div>
        </div>
        <div className="col-sm-6 col-xl-2" >
          <div className="p-3 bg-warning-400 rounded overflow-hidden position-relative text-white mb-g">
            <div className="quantidadeClienteVenda">
              <h3 className="display-4 d-block l-h-n m-0 fw-500">
                0
                <small className="m-0 l-h-n">Clientes</small>
              </h3>
            </div>
            <BsGem className="fal  position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "8rem" }} />
          </div>
        </div>
        <div className="col-sm-6 col-xl-2" >
          <div className="p-3 bg-success-200 rounded overflow-hidden position-relative text-white mb-g">
            <div className="ticketMedioVenda">
              <h3 className="display-4 d-block l-h-n m-0 fw-500">
                0,00
                <small className="m-0 l-h-n">Ticket Médio</small>
              </h3>
            </div>
            <FaRegLightbulb className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }} />

          </div>
        </div>
        <div className="col-sm-6 col-xl-2" >
          <div className="p-3 bg-info-200 rounded overflow-hidden position-relative text-white mb-g">
            <div className="despesaLoja">
              <h3 className="display-4 d-block l-h-n m-0 fw-500">
                0,00
                <small className="m-0 l-h-n">Despesas</small>
              </h3>
            </div>
            <BsGlobe className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }} />
          </div>
        </div>
        <div className="col-sm-6 col-xl-2" >
          <div className="p-3 bg-danger-200 rounded overflow-hidden position-relative text-white mb-g">
            <div className="ecommerce">
              <h3 className="display-4 d-block l-h-n m-0 fw-500">
                0,00
                <small className="m-0 l-h-n">E-Commerce</small>
              </h3>
            </div>
            <BsGlobe className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }} />
          </div>
        </div>
      </div>
    </Fragment>
  )
}