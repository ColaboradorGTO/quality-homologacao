import { Fragment } from "react";
import Modal from 'react-bootstrap/Modal';
import XMLViewer from 'react-xml-viewer';
import Swal from 'sweetalert2'; 
import { FooterModal } from "../../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { HeaderModal } from "../../../../Modais/HeaderModal/HeaderModal";
import { ScrollPanel } from 'primereact/scrollpanel';
import { ActionListaVendaSefaz } from "./actionListaVendaSefaz";


export const ActionConsultaSefazModal = ({ 
  show, 
  handleClose,
  dadosSefaz,
  usuarioLogado,
  optionsModulos
 }) => {
  
  const xmlData = dadosSefaz?.xml || '';

 
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
    const xmlBlob = new Blob([xmlData], { type: 'text/xml' });
    const newTabUrl = URL.createObjectURL(xmlBlob);
    window.open(newTabUrl, '_blank');
  };


  const handleDownloadXML = () => {
    const xmlBlob = new Blob([xmlData], { type: 'text/xml' });
    const downloadUrl = URL.createObjectURL(xmlBlob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `venda_${dadosSefaz[0]?.IDVENDA}.xml`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-hidden="true"
      >
        <div className="" role="document">
          <HeaderModal
            title={"XML Venda Nº " + dadosSefaz?.vendaData.data[0]?.venda.IDVENDA}
            handleClose={handleClose}
          />
     
          <Modal.Body>

            <ScrollPanel style={{ width: '100%', height: '400px', border:  '1px solid #000' }}>

              {xmlData ? (
                <XMLViewer xml={xmlData} />
              ) : (
                <p>XML não disponível</p>
              )}
            </ScrollPanel>
          
            <div 
              className="footer p-3"
              style={{display: 'flex', justifyContent: 'right', alignContent: 'center'}}
            >
              <div className="p-1">

                <ButtonTypeModal
                  textButton={"Copiar XML"}
                  onClickButtonType={handleCopyXML}
                  cor={"secondary"}
                />
              </div>
              <div className="p-1">
                
                <ButtonTypeModal
                  textButton={"Enviar XML para Sefaz"}
                  onClickButtonType={handleOpenNewTab}
                  cor={"info"}
                />
              </div>
              <div className="p-1">
                
                <ButtonTypeModal
                  textButton={"Download XML"}
                  onClickButtonType={handleDownloadXML}
                  cor={"success"}
                />
              </div>
              <div className="p-1">
                
                <ButtonTypeModal
                  textButton={"Cancelar XML"}
                  onClickButtonType
                  cor={"danger"}
                />
              </div>

              <div className="p-1">
                
                <ButtonTypeModal
                  textButton={"Inutilizar XML"}
                  onClickButtonType 
                  cor={"secondary"}
                />
              </div>

            </div>
            <ActionListaVendaSefaz 
              dadosSefaz={dadosSefaz} 
              usuarioLogado={usuarioLogado} 
              optionsModulos={optionsModulos}  
            />
          </Modal.Body>
            {/* <FooterModal
              
              ButtonTypeCadastrar={ButtonTypeModal}
              textButtonCadastrar={"Copiar XML"}
              onClickButtonCadastrar={handleCopyXML}
              corCadastrar={"primary"}

              ButtonTypeConfirmar={ButtonTypeModal}
              textButtonConfirmar={"Download"}
              onClickButtonConfirmar={handleDownloadXML}
              corConfirmar={"success"}

              ButtonTypeCancelar={ButtonTypeModal}
              textButtonCancelar={"Cancelar"}
              onClickButtonCancelar={handleClose}
              corCancelar={"danger"}
            /> */}
        </div>
      </Modal>
    </Fragment>
  );
};
