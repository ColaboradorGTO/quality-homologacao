import './styles.css';
import { Fragment, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { useReactToPrint } from "react-to-print";

const chunkArray = (array, size) => {
  const expandedArray = array.flatMap(item =>
    Array(item.quantidade).fill({ ...item })
  );

  const chunks = [];
  for (let i = 0; i < expandedArray.length; i += size) {
    chunks.push(expandedArray.slice(i, i + size));
  }
  return chunks;
};

export const ActionImprimirAcumuladorEtiquetaModal = ({
  show,
  handleClose,
  dadosAcumuladorEtiquetas,
  copias
}) => {

  const dataTableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: "Lista de Etiquetas",
  });

  const etiquetas = dadosAcumuladorEtiquetas.map((item) => ({
    idEtiqueta: item.idEtiqueta,
    quantidade: item.quantidade,
    valor: item.valor,
  }));

  const quantidadeTotalEtiquetas = etiquetas.reduce((total, etiqueta) => total + etiqueta.quantidade, 0);
  const etiquetasPorPagina = chunkArray(etiquetas, 4);
  const totalPaginas = etiquetasPorPagina.length * copias;

  return (
    <Fragment>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        className="modal fade"
        role="dialog"
      >
        <HeaderModal
          title={"Etiquetas"}
          subTitle={"Etiquetas"}
          handleClose={handleClose}
        />
        <Modal.Body>
          <header>
            <p>Qtd: Páginas <b>{totalPaginas + ' ' + 'Páginas'}</b></p>
            <p>Qtd Etiquetas: <b>{quantidadeTotalEtiquetas + ' ' + 'unidades'} </b></p>
          </header>
          <div style={{ width: '100%' }} ref={dataTableRef}>
            {etiquetasPorPagina.map((pagina, pageIndex) => (
              <div
                className="etiqueta-remarcacao-page"
                key={pageIndex}
              >
                {pagina.map((etiqueta, etiquetaIndex) => (
                  <div
                    className="etiqueta-remarcacao-card border-dark rounded "
                    key={etiquetaIndex}
                    style={{ borderRadius: '4px', maxWidth: '100%' }}
                  >
                    <div
                      className="preco-remarcacao "
                      style={{
                        fontSize: 'em',
                        justifyContent: 'center',
                        backgroundColor: '',
                        maxWidth: '100%'
                      }}
                    >
                      <h2 style={{ margin: '1px' }}>
                        {formatMoeda(etiqueta?.valor)}
                      </h2>
                    </div>
                  </div>
                ))}
                <p className="etiqueta-remarcacao-page-number">{pageIndex + 1}</p>
              </div>
            ))}
          </div>
        </Modal.Body>
        <FooterModal
          ButtonTypeCadastrar={ButtonTypeModal}
          textButtonCadastrar={"Imprimir"}
          onClickButtonCadastrar={handlePrint}
          corCadastrar={"primary"}

          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar={"Fechar"}
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />
      </Modal>
    </Fragment>
  );
};