import { Fragment, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { useReactToPrint } from "react-to-print";
import Swal from "sweetalert2";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";

export const ActionConhecimentoEntrega = ({ show, handleClose, dadosConhecimentoEntrega }) => {

  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Conhecimento_Entrega',
  });

  const agrupado = dadosConhecimentoEntrega.reduce((acc, item) => {
    const key = item.EMPRESADESTINO;

    if (!acc[key]) {
      acc[key] = [];
    }

    acc[key].push(item);
    return acc;
  }, {});

  const handleImprimir = () => {
    Swal.fire({
      title: 'Imprimir?',
      text: 'Deseja imprimir o conhecimento de entrega?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sim',
      cancelButtonText: 'Cancelar',
      customClass: {
        container: 'custom-swal'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handlePrint();
      }
    });
  };

  const dataAtual = new Date().toLocaleDateString();

  return (
    <Fragment>
      <Modal show={show} onHide={handleClose} size="xl">
        <HeaderModal title={"Conhecimento de Entrega"} handleClose={handleClose} />
        <Modal.Body>
          <div>

            <div ref={printRef} className="p-5"
              style={{
                boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
                backgroundImage: `url('/img/svg/pattern-1.svg')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center'
              }}
            >

              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: '20px' }}>
                <img
                  src="/img/logo-gto.png"
                  width="120"
                  alt="logo"
                />
              </div>
              <h3 style={{ textAlign: 'center' }}><b>Conhecimento Entrega</b></h3>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div></div>
                <div><b>Data:</b> {dataAtual}</div>
              </div>

              {Object.keys(agrupado).map((empresa, idx) => {
                let totalLoja = 0;

                return (
                  <div key={idx} style={{ marginTop: '20px' }}>

                    <h4><b>{empresa}</b></h4>

                    <div style={{ display: 'flex', fontWeight: 'bold', borderBottom: '1px solid #000' }}>
                      <div style={{ width: '15%' }}>Nº OT</div>
                      <div style={{ width: '15%' }}>Nota</div>
                      <div style={{ width: '55%' }}>Status Nota</div>
                      <div style={{ width: '15%' }}>Volumes</div>
                    </div>

                    {agrupado[empresa].map((item, i) => {
                      const cor = item.CODIGORETORNOSEFAZ !== "100" ? 'red' : 'black';

                      totalLoja += item.NUTOTALVOLUMES;

                      return (
                        <div key={i} style={{ display: 'flex', marginTop: '5px' }}>
                          <div style={{ width: '15%' }}>{item.IDRESUMOOT}</div>
                          <div style={{ width: '15%' }}>{item.NUMERONOTASEFAZ}</div>
                          <div style={{ width: '55%', color: cor }}>{item.MSGSEFAZ}</div>
                          <div style={{ width: '15%', textAlign: 'right' }}>{item.NUTOTALVOLUMES}</div>
                        </div>
                      );
                    })}

                    <div style={{ textAlign: 'right', marginTop: '10px' }}>
                      <b>Total: {totalLoja}</b>
                    </div>

                  </div>
                );
              })}

              <div style={{ textAlign: 'right', marginTop: '20px' }}>
                <b>
                  Total Geral: {
                    dadosConhecimentoEntrega.reduce((acc, item) => acc + item.NUTOTALVOLUMES, 0)
                  }
                </b>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '5em' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  __________________________________________
                  <br />
                  <h4>Assinatura Gerente</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  __________________________________________
                  <br />
                  <h4>Data/Hora Chegada</h4>
                </div>
              </div>

              <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '5em' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  __________________________________________
                  <br />
                  <h4>Assinatura Motorista</h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  __________________________________________
                  <br />
                  <h4>Data/Hora Saída</h4>
                </div>
              </div>

              <div style={{ marginTop: '30px' }}>
                <h3>Ocorrências:</h3>
              </div>

            </div>
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

      </Modal>
    </Fragment>
  );
};