import { Fragment, useRef, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { ReactBarcode } from 'react-jsbarcode';
import { useReactToPrint } from "react-to-print";
import jsPDF from 'jspdf';

import Swal from "sweetalert2";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";

 

export const ActionImprimirEtiquetaOT = ({ show, handleClose, dadosImprimirOT }) => {
  const [layout, setLayout] = useState('layout-normal');


  const dataTableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'voucher',
  });



  const dados = dadosImprimirOT.map((item) => {
    return {
      IDRESUMOOT: item.IDRESUMOOT,
      EMPRESAORIGEM: item.EMPRESAORIGEM,
      EMPRESADESTINO: item.EMPRESADESTINO,
      DATAEXPEDICAOFORMATADA: item.DATAEXPEDICAOFORMATADA,
      NUTOTALVOLUMES: item.NUTOTALVOLUMES ? item.NUTOTALVOLUMES : 1,
      TPVOLUME: item.TPVOLUME,
      CODIGOBARRAS: item.CODIGOBARRAS,
      NUMEROVOLUME: item.NUMEROVOLUME,
    };
  });



  const toggleLayout = () => {
    setLayout(layout === 'layout-normal' ? 'layout-cupom' : 'layout-normal');
  };

  const handleImprimir = (NUVOUCHER) => {

    Swal.fire({
      icon: 'question',
      title: 'Escolha o Formato Desejado?',
      showCloseButton: true,
      showCancelButton: true,
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'CUPOM',
      cancelButtonText: 'NORMAL',
      customClass: {
        container: 'custom-swal',
      },
      preConfirm: () => {
        return new Promise((resolve) => {

          toggleLayout();
          setTimeout(() => {
            handlePrint();
            resolve();
          }, 500);
        });
      }
    }).then((result) => {
      if (result.value) {
        toggleLayout();
        setTimeout(() => {
          handlePrint();
          resolve();
        }, 500)
      } else if (result.dismiss === 'cancel') {
        toggleLayout();
        setTimeout(() => {
          handlePrint();
          resolve();
        }, 500)
      }
    });
  };



  return (
    <Fragment>
      <Modal show={show} onHide={handleClose} size="lg" className="modal fade" tabIndex={-1} role="dialog" aria-hidden="true">
        
          <HeaderModal title={"Etiqueta"} handleClose={handleClose} />

          <Modal.Body>
            <div ref={dataTableRef} className={layout} >
              {dados.map((item, index) => (
                <Fragment>
                  <div 
                    style={{
                      padding: '10px',
                      width: '60%',
                      margin: 'auto',
                      justifyContent: 'center',
                      alignContent: 'center',

                      
                    }} 
                  >
                   
                    <div style={{
                        padding: '10px', 
                        marginTop: '10px', 
                       
                        boxShadow: '0px 0px 0.5cm rgba(0, 0, 0, 0.5)',
                        backgroundImage: 'url("/img/svg/pattern-1.svg")',
                        backgroundSize: 'cover',
                       
                    }}>
                      <p style={{fontSize: '18px'}}>
                        <strong>Origem: </strong>
                        
                        {dados[0]?.EMPRESAORIGEM}
                      </p>

                      <p style={{fontSize: '18px'}}>
                        <strong>Destino: </strong>
                        {dados[0]?.EMPRESADESTINO}
                      </p>

                      <p style={{fontSize: '18px'}}>
                        <strong>Nº da OT: </strong>
                        {dados[0]?.IDRESUMOOT}
                      </p>

                      <p style={{fontSize: '18px'}}>
                        <strong>Data da OT: </strong>
                        {dados[0]?.DATAEXPEDICAOFORMATADA}
                      </p>

                      <p style={{fontSize: '18px'}}>
                        <strong>Volume: </strong>
                        {dados[0]?.NUMEROVOLUME}/{dados[0]?.NUTOTALVOLUMES}
                      </p>

                      <p style={{fontSize: '18px'}}>
                        <strong> {dados[0]?.TPVOLUME} </strong>
                      </p>
                      <div style={{ display: "flex",  }}>
                        <ReactBarcode 
                          value={dados[0]?.CODIGOBARRAS} 
                          options={{ 
                            format: 'code128',
                            width: 5,
                            height: 100,
                            displayValue: true,
                          }} 
                          renderer="svg" 
                        />
                      </div>
                    </div>
                  </div>
              
                  
                </Fragment>
              ))}
            </div>


          </Modal.Body>

          <FooterModal
            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Fechar"}
            onClickButtonConfirmar={handleClose}
            corConfirmar={"secondary"}

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Imprimir"}
            onClickButtonFechar={handleImprimir}
            corFechar="primary"
          />
        
      </Modal >
    </Fragment >
  );
};
