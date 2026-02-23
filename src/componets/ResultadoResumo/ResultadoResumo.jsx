import React, { Fragment } from "react";
import { AiOutlineUser } from "react-icons/ai";
import { BsGem, BsGlobe } from "react-icons/bs";
import { FaCashRegister, FaRegLightbulb } from "react-icons/fa";
import { MdOutlinePayment } from "react-icons/md";
import { FaRegMoneyBillAlt } from "react-icons/fa";


export const ResultadoResumo = ({ 
  cardVoucher,
  cardVendas,
  cardCliente,
  cardTicketMedio,
  cardDespesas,
  cardEcommerce,
  cardCartao,


  valorVendas,
  nomeVendas,
  valorTicketMedio,
  nomeTicketMedio,
  valorDespesas,
  nomeDespesas,
  valorEcommerce,
  nomeEcommerce,
  valorCartao,
  nomeCartao,
  nomeCliente,
  numeroCliente,
  valorVoucher,
  nomeVoucher,
  
  Icon,
  IconVendas,
  IconNumeroCliente,
  IconTicketMedio,
  IconValorDespesas,
  IconValorEcommerce,
  IconCartao,
  IconVoucher,


  iconSize,
  iconColor
}) => {
  
  return (
    <Fragment>
      <div className="row">
        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3" >
          {cardVendas && (
            <div className="p-3 bg-primary-300 rounded overflow-hidden position-relative text-white mb-g">
              <div className="vendaLoja">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {valorVendas}
                  <small className="m-0 l-h-n"> {nomeVendas}</small>
                </h3>
              </div>
              {/* <AiOutlineUser size={100} style={{ fontSize: "8rem" }} class="fa position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" /> */}
              { IconVendas && 
                <IconVendas 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3 " >
          {cardCliente && (
            <div className="p-3 bg-warning-400 rounded overflow-hidden position-relative text-white mb-g">
              <div className="quantidadeClienteVenda">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {numeroCliente}
                  <small className="m-0 l-h-n"> {nomeCliente}</small>
                </h3>
              </div>
              {/* <BsGem className="fal  position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "8rem" }} /> */}
              { IconNumeroCliente && 
                <IconNumeroCliente 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3 " >
          {cardTicketMedio && (
            <div className="p-3 bg-success-200 rounded overflow-hidden position-relative text-white mb-g">
              <div className="ticketMedioVenda">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {valorTicketMedio}
                  <small className="m-0 l-h-n">{nomeTicketMedio}</small>
                </h3>
              </div>
              {/* <FaRegLightbulb className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }} /> */}
              { IconTicketMedio && 
                <IconTicketMedio 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3 " >
          {cardDespesas && (
            <div className="p-3 bg-info-200 rounded overflow-hidden position-relative text-white mb-g">
              <div className="despesaLoja">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                    {valorDespesas}
                  <small className="m-0 l-h-n"> {nomeDespesas} </small>
                </h3>
              </div>
              {/* <FaCashRegister className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }} /> */}
              { IconValorDespesas && 
                <IconValorDespesas 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3 " >
          {cardEcommerce && ( 
            <div className="p-3 bg-danger-200 rounded overflow-hidden position-relative text-white mb-g">
              <div className="ecommerce">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {valorEcommerce}
                  <small className="m-0 l-h-n">  {nomeEcommerce}</small>
                </h3>
              </div>
              {/* <BsGlobe className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }}  /> */}
              { IconValorEcommerce && 
                <IconValorEcommerce 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>

        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3 " >
          {cardCartao && (
            <div className="p-3 bg-warning-400 rounded overflow-hidden position-relative text-white mb-g">
              <div className="ecommerce">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {valorCartao}
                  <small className="m-0 l-h-n">  {nomeCartao}</small>
                </h3>
              </div>
              {/* <MdOutlinePayment className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }}  /> */}
              { IconCartao && 
                <IconCartao 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>
        <div className="col-sm-6 col-lg-4 col-xl-4 col-xxl-3">
          {cardVoucher && (
            <div className="p-3 bg-info-200 rounded overflow-hidden position-relative text-white mb-g">
              <div className="ecommerce">
                <h3 className="display-4 d-block l-h-n m-0 fw-500">
                  {valorVoucher}
                  <small className="m-0 l-h-n">  {nomeVoucher}</small>
                </h3>
              </div>
              {/* <MdOutlinePayment className="fal fa-lightbulb position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1" size={100} style={{ fontSize: "6rem" }}  /> */}


              { IconVoucher && 
                <IconVoucher 
                  className="position-absolute pos-right pos-bottom opacity-15 mb-n1 mr-n1"
                  size={iconSize}  
                  color={iconColor} 
                />
              }
            </div>

          )}
        </div>
      </div> 
    </Fragment>
  )
}