import { Fragment, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import './styles.css';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { useReactToPrint } from "react-to-print";

import { enviarZPLParaImpressora, gerarZPLEtiquetas } from "../../../../utils/labelPrinterService";

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

export const ActionImprimirAcumuladorEtiquetaModal = ({ show, handleClose,  dadosAcumuladorEtiquetas, copias, setDadosEtiquetas, quantidadeEtiquetas }) => {
  const dataTableRef = useRef();

 
  const handlePrint = async () => {
    try {
      
      let comandosZPL = '';
      
      etiquetasPorPagina.forEach((paginaEtiquetas) => {
        const posicoes = [
          { x: 32, y: 25 },
          { x: 216, y: 25 },
          { x: 400, y: 25 },
          { x: 584, y: 25 }
        ];

        comandosZPL += `^XA^PR2^MD15^FWN^PW800^LL80^CI28`;

        paginaEtiquetas.forEach((etiqueta, indiceEtiqueta) => {
          const posicao = posicoes[indiceEtiqueta];
          if (posicao) {
            const valorFormatado = formatMoeda(etiqueta.valor);
            comandosZPL += `^FO${posicao.x},${posicao.y}^A0,40,30^FB184,1,1,C,0^FD${valorFormatado}^FS`;
          }
        });

        comandosZPL += `^PQ1^XZ\n`;
      });

      await enviarZPLParaImpressora(comandosZPL.trim());

    } catch (error) {
      console.error('❌ Erro na impressão WebSocket:', error);
    }
  };


  const etiquetas =  dadosAcumuladorEtiquetas.map((item) => ({
    idEtiqueta: item.idEtiqueta,
    quantidade: item.quantidade,
    valor: item.valor,
  }));

  const quantidadeTotalEtiquetas = etiquetas.reduce((total, etiqueta) => total + etiqueta.quantidade, 0);

  const etiquetasPorPagina = chunkArray(etiquetas, 4);
  const totalPaginas = etiquetasPorPagina.length;
  console.log(totalPaginas, 'totalPaginas')
  console.log(quantidadeTotalEtiquetas, 'quantidadeTotalEtiquetas')


  const paginasCompias = etiquetasPorPagina.map((pagina, indexPagina) => ({
    pagina,
    numeroPagina: indexPagina + 1,
    copia: 1,
    indexOriginal: indexPagina
  }));
  
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
            {paginasCompias.map((item, pageIndex) => (
              <div
                className="etiqueta-remarcacao-page"
                key={pageIndex}
              >
                {item.pagina.map((etiqueta, etiquetaIndex) => (
                  <div
                    className="etiqueta-remarcacao-card border-dark rounded "
                     key={`etiqueta-${etiquetaIndex}-${item.copia}`}
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