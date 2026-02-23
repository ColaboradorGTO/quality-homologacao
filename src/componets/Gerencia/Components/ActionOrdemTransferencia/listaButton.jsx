import React, { Fragment, useState } from "react";
import { CiEdit } from "react-icons/ci";
import { FaCheck, FaExclamation } from "react-icons/fa";
import { MdOutlineLocalPrintshop } from "react-icons/md";
import { BsTrash3 } from "react-icons/bs";
import Swal from "sweetalert2";
import { get, put } from "../../../../api/funcRequest";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";

const ListaButton = ({ 
    row, 
    usuarioLogado,
    handleClickDetalhar,
    handleClickEdit,
    handleCancelar,
    handleClickImprimir,
    handleClickStatusNota,
    
}) => {
    const renderButtons = (row) => {
        if (usuarioLogado?.IDEMPRESA == 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "15rem",
              }}
            >
              <div>
                <ButtonTable
                  titleButton={"Ajustar Pedido"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={CiEdit}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={row.IDSTATUSOT != 1}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Liberar Pedido"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={CiEdit}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={usuarioLogado?.IDEMPRESA == 101 && [10, 11, 12].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Conferir Itens"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"warning"}
                  disabledBTN={[11].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Conferir Volume"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"info"}
                  disabledBTN={[12].indexOf(row.IDSTATUSOT) >= 0}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Imprimir Etiqueta"}
                  onClickButton={() => handleClickImprimir(row)}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"dark"}
                />
              </div>
            </div>
          );
        } else if (row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA) {
          return (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "15rem",
              }}
            >
              <div>
                <ButtonTable
                  titleButton={"Editar / Visualizar"}
                  onClickButton={() => handleClickEdit(row)}
                  Icon={CiEdit}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"info"}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Cancelar"}
                  onClickButton={() => handleCancelar(row)}
                  Icon={BsTrash3}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"danger"}
                  disabledBTN={row.IDSTATUSOT != 1}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Finalizar OT"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"warning"}
                  disabledBTN={row.IDSTATUSOT != 1}
                />
              </div>
              <div>
                <ButtonTable
                  titleButton={"Imprimir Etiqueta"}
                  onClickButton={() => handleClickImprimir(row)}
                  Icon={MdOutlineLocalPrintshop}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"dark"}
                />
              </div>
            </div>
          );
        } else {
          return (
            <Fragment>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "15rem",
                }}
              >
                <ButtonTable
                  titleButton={"Conferir OT"}
                  onClickButton={() => handleClickDetalhar(row)}
                  Icon={FaCheck}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                  disabledBTN={row.NUMERONOTASEFAZ === ''}
                />
              </div>
              {[8, 5].indexOf(row.IDSTATUSOT) >= 0 && (
                <div>
                  <ButtonTable
                    titleButton={"Finalizar Recebimento OT"}
                    onClickButton={() => handleClickDetalhar(row)}
                    Icon={MdOutlineLocalPrintshop}
                    iconSize={20}
                    iconColor={"#fff"}
                    cor={"warning"}
                    disabledBTN={row.NUMERONOTASEFAZ === ''}
                  />
                </div>
              )}
            </Fragment>
          );
        }
      };
    
      const renderStatusNotaFiscalButton = (row) => {
        if (row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA) {
          if (row.ERRORLOGSAP !== "" && row.ERRORLOGSAP !== null) {
            return (
              <div>
                <ButtonTable
                  titleButton={"Status Nota Fiscal"}
                  onClickButton={() => handleClickStatusNota(row)}
                  Icon={FaExclamation}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"danger"}
                />
              </div>
            );
          } else if ((row.ERRORLOGSAP === "" || row.ERRORLOGSAP === null) && row.IDSAPORIGEM > 0 && row.IDSAPDESTINO > 0) {
            return (
              <div>
                <ButtonTable
                  titleButton={"Status Nota Fiscal"}
                  onClickButton={() => handleClickStatusNota(row)}
                  Icon={FaExclamation}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"success"}
                />
              </div>
            );
          } else {
            return (
              <div>
                <ButtonTable
                  titleButton={"Status Nota Fiscal"}
                  onClickButton={() => handleClickStatusNota(row)}
                  Icon={FaExclamation}
                  iconSize={20}
                  iconColor={"#fff"}
                  cor={"warning"}
                />
              </div>
            );
          }
        }
        return null;
      };
      
    //   console.log(row);
      return (
        <Fragment>
          {renderButtons(row)}
          {renderStatusNotaFiscalButton(row)}
          {row.IDEMPRESAORIGEM === usuarioLogado?.IDEMPRESA && (
            <div>
              <ButtonTable
                titleButton={"Imprimir Nota Fiscal"}
                onClickButton={() => window.open(`http://164.152.244.96:3000/files/NFe53230636769602000236550000000106301779108247.pdf`, '_blank')}
                Icon={MdOutlineLocalPrintshop}
                iconSize={20}
                iconColor={"#fff"}
                cor={"danger"}
              />
            </div>
          )}
        </Fragment>
      );
};

export default ListaButton;