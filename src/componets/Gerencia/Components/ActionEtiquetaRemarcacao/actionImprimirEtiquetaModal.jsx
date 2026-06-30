import { Fragment, useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import './styles.css';
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { generateZPLEtiquetas, printZPLDirect } from "../../../../utils/zplGenerator";
import { enviarZPLParaImpressora, gerarZPLEtiquetas } from "../../../../utils/labelPrinterService";
import Swal from "sweetalert2";

const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

export const ActionImprimirEtiquetaModal = ({ show, handleClose, dadosEtiquetas, copias, quantidadeEtiquetas }) => {
  const dataTableRef = useRef();
  const handlePrintZPLWebSocket = async () => {
    try {
      
      let comandosZPL = '';
      
      for (let numCopia = 0; numCopia < copias; numCopia++) {
        etiquetasPorPagina.forEach((paginaEtiquetas, indicePagina) => {
        
          comandosZPL += `
            ^XA
            ^PR2
            ^MD15
            ^FWN
            ^PW800
            ^LL80
            ^CI28
          `;
          
          const posicoes = [
            { x: 32, y: 25 },   // Primeira posição: ^FO32,25
            { x: 216, y: 25 },  // Segunda posição: ^FO216,25
            { x: 400, y: 25 },  // Terceira posição: ^FO400,25
            { x: 584, y: 25 }   // Quarta posição: ^FO584,25
          ];
          
         
          paginaEtiquetas.forEach((etiqueta, indiceEtiqueta) => {
            const posicao = posicoes[indiceEtiqueta];
            if (posicao) {
              const valorFormatado = formatMoeda(etiqueta.valor);
              comandosZPL += `^FO${posicao.x},${posicao.y}^A0,40,30^FB184,1,1,C,0^FD${valorFormatado}^FS`;
              console.log(`  💰 Etiqueta ${indiceEtiqueta + 1}: ${valorFormatado} na posição (${posicao.x}, ${posicao.y})`);
            }
          });
          
          // Finaliza a página
          comandosZPL += `^XZ`;
        });
      }

      await enviarZPLParaImpressora(comandosZPL.trim());

    } catch (error) {
      console.error('❌ Erro na impressão WebSocket:', error);
    }
  };



  const etiquetas = dadosEtiquetas.map((item) => ({
    idEtiqueta: item.idEtiqueta,
    quantidade: item.quantidade,
    valor: item.valor
  }));

  const etiquetasPorPagina = chunkArray(etiquetas, 4);
  const totalPaginas = etiquetasPorPagina.length * copias;

  const paginasCompias = [];
  for(let copia = 0; copia < copias; copia++) {
    etiquetasPorPagina.forEach((pagina, indexPagina) => {
      paginasCompias.push({
        pagina: pagina,
        numeroPagina: (copia * etiquetasPorPagina.length) + indexPagina + 1,
        copia: copia + 1,
        indexOriginal: indexPagina
      });
    });
  }

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
            <p>Qtd Etiquetas: <b>{quantidadeEtiquetas + ' ' + 'unidades'} </b></p>
          </header>
          <div style={{ width: '100%' }} ref={dataTableRef}>
            {paginasCompias.map((item, pageIndex) => (
              <div
                className="etiqueta-remarcacao-page rounded"
                key={pageIndex}
              >
                {item.pagina.map((etiqueta, etiquetaIndex) => (
                  <div
                    className="etiqueta-remarcacao-card border-dark rounded "
                    key={`etiqueta-${etiquetaIndex}-${item.copia}`}
                    style={{ borderRadius: '4px', maxWidth: '100%' }}
                  >
                    <div className="etiqueta-remarcacao-card-body"></div>
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
          
          ButtonTypeConfirmar={ButtonTypeModal}
          textButtonConfirmar="🌐 Imprimir"
          onClickButtonConfirmar={handlePrintZPLWebSocket}
          corConfirmar="primary"
        
     
          ButtonTypeFechar={ButtonTypeModal}
          textButtonFechar="Fechar"
          onClickButtonFechar={handleClose}
          corFechar="secondary"
        />
      </Modal>
    </Fragment>
  );
};