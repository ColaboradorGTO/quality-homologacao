import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import XMLViewer from 'react-xml-viewer';
import Swal from 'sweetalert2';
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ScrollPanel } from 'primereact/scrollpanel';
import axios from 'axios';
export const ActionVendaXMLModal = ({ show, handleClose, dadosVendasXML }) => {

  const xmlData = dadosVendasXML[0]?.XML_FORMATADO;

  // const gerarDanfeViaApi = async () => {
  //   try {
  //     const idVenda = dadosVendasXML[0]?.IDVENDA;
  //     const xmlData = dadosVendasXML[0]?.XML_FORMATADO;

  //     const response = await axios.post(
  //       'https://quality-api.vercel.app/gerar-danfe',
  //       { xml: xmlData, idVenda, consulta: '' },
  //       {
  //         responseType: 'arraybuffer',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Accept': 'application/pdf'
  //         },
  //         timeout: 80000
  //       }
  //     );

  //     if (!response.data || response.data.byteLength === 0) {
  //       throw new Error('Resposta da API vazia');
  //     }

  //     // Crie o Blob e baixe
  //     const blob = new Blob([response.data], { type: 'application/pdf' });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', `DANFE_${idVenda}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);

  //     Swal.fire({
  //       title: 'Sucesso!',
  //       text: 'DANFE gerado e baixado com sucesso.',
  //       icon: 'success',
  //       customClass: {
  //         container: 'custom-swal',
  //       },
  //     });
  //   } catch (error) {
  //     console.error('Erro detalhado:', {
  //       message: error.message,
  //       response: error.response,
  //       stack: error.stack
  //     });

  //     Swal.fire({
  //       title: 'Falha na geração',
  //       text: error.message || 'Erro ao gerar DANFE',
  //       icon: 'error',
  //       customClass: {
  //         container: 'custom-swal',
  //       },
  //     });
  //   }
  // };

  const handleCopyXML = () => {
    if (xmlData) {
      navigator.clipboard.writeText(xmlData).then(() => {
        Swal.fire({
          icon: 'success',
          title: 'XML copiado com sucesso!',
          text: 'XML copiado com sucesso!',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            container: 'custom-swal',
          },
        });

      }).catch(() => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível copiar o XML',
          customClass: {
            container: 'custom-swal',
          },
        });

      });
    }
  };

  const handleOpenNewTab = () => {
    if (xmlData) {
      const xmlBlob = new Blob([xmlData], { type: 'text/xml' });
      const newTabUrl = URL.createObjectURL(xmlBlob);
      window.open(newTabUrl, '_blank');
    }
  };

  const handleDownloadXML = () => {
    if (xmlData) {
      const xmlBlob = new Blob([xmlData], { type: 'text/xml' });
      const downloadUrl = URL.createObjectURL(xmlBlob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `venda_${dadosVendasXML[0]?.IDVENDA}.xml`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="lg"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="" role="document">
          <HeaderModal
            title={"XML Venda Nº " + dadosVendasXML[0]?.IDVENDA}
            handleClose={handleClose}
          />

          <Modal.Body>
            <ScrollPanel style={{ width: '100%', height: '400px', border: '1px solid #000' }}>
              {xmlData ? (
                <XMLViewer xml={xmlData} />
              ) : (
                <p>XML não disponível</p>
              )}
            </ScrollPanel>
          </Modal.Body>

          <FooterModal
            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={"Nova Aba"}
            onClickButtonFechar={handleOpenNewTab}
            corFechar={"info"}

            ButtonTypeCadastrar={ButtonTypeModal}
            textButtonCadastrar={"Copiar XML"}
            onClickButtonCadastrar={handleCopyXML}
            corCadastrar={"primary"}

            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Download XML"}
            onClickButtonConfirmar={handleDownloadXML}
            corConfirmar={"success"}
          />

          {/* Botão adicional para download XML */}
          {/* <div style={{ padding: '15px', textAlign: 'center', borderTop: '1px solid #dee2e6' }}>
            <ButtonTypeModal
              textButton={"Download XML"}
              onClickButtonType={handleDownloadXML}
              cor={"success"}
            />
          </div> */}

        </div>
      </Modal>
    </Fragment>
  );
};