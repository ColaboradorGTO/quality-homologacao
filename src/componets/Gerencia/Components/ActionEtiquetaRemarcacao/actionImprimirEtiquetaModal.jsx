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
console.log(dadosEtiquetas, "dadosEtiquetas")
  // Função original jQuery adaptada para React - garante impressão na ZPL
  const imprimirEtiquetasZPL = () => {
    try {
      // Mostra loading
      Swal.fire({
        title: 'Aguardando o processo de impressão...',
        text: 'Favor finalizar a impressão',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Cria HTML ultra-simplificado para ZPL - SEM CSS complexo
      let htmlSimples = '';
      
      etiquetas.forEach((etiqueta) => {
        for (let copia = 0; copia < copias; copia++) {
          htmlSimples += `
            <div style="
              width: 6cm; 
              height: 2.5cm; 
              border: 1px solid black; 
              display: flex; 
              align-items: center; 
              justify-content: center; 
              font-size: 24px; 
              font-weight: bold; 
              page-break-after: always;
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            ">
            <h2 style="margin: 1px;">
              ${formatMoeda(etiqueta.valor)}
            </h2>
            </div>
          `;
        }
      });

      console.log('HTML gerado para ZPL:', htmlSimples);

      // HTML mínimo para impressora ZPL
      const htmlToPrint = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Etiquetas</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: Arial, sans-serif; }
              @media print {
                @page { 
                  size: 6cm 2.5cm; 
                  margin: 0; 
                }
              }
            </style>
          </head>
          <body>
            ${htmlSimples}
            <script>
              window.onload = function() {
                setTimeout(function() {
                  window.print();
                }, 500);
              };
              window.onafterprint = function() {
                window.close();
              };
            </script>
          </body>
        </html>
      `;

      // Método window.open tradicional
      const tela_impressao = window.open('', '_blank', 'width=800,height=600');
      tela_impressao.document.open();
      tela_impressao.document.write(htmlToPrint);
      tela_impressao.document.close();

      // Remove loading
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Processo de Impressão Finalizado!',
          showConfirmButton: false,
          timer: 1500
        });
      }, 2000);

    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: 'error',
        title: 'Erro ao tentar imprimir',
        text: 'Recarregue e tente novamente'
      });
    }
  };

  // Função EXATA do jQuery - imprimirEtiquetasRemarcacao() adaptada para React
  const handlePrint = () => {
    try {
      console.log('🖨️ Iniciando impressão jQuery...');
      console.log('📄 Dados das etiquetas:', etiquetas);
      console.log('📑 Referência do elemento:', dataTableRef.current);

      // Exatamente igual ao jQuery
      Swal.fire({
        title: 'Aguardando o processo de impressão...',
        text: 'Favor finalizar a impressão',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Verificar se a referência existe
      if (!dataTableRef.current) {
        console.error('❌ Referência não encontrada!');
        throw new Error('Elemento não encontrado para impressão');
      }

      // Pega o HTML exato do elemento - igual ao jQuery: document.getElementById('resultadoImpEtiquetaRemarcacao').innerHTML
      let htmlEtiquetas = dataTableRef.current.innerHTML;
      console.log('📋 HTML capturado:', htmlEtiquetas.substring(0, 200) + '...');
      
      // HTML EXATO do jQuery - sem alterações
      let htmlToPrint = `
      <html>
          <head>
              <meta charset="utf-8">
              <title>Impressão</title>
              <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"> 
              <style>
                  body {
                      display: flex;
                      justify-content: center;
                      font-family: 'Roboto', sans-serif !important;
                      font-size: 13px;
                      letter-spacing: -0.05px !important;
                      margin: 1px !important;
                      transform: rotate(0deg);
                      transform-origin: center;
                  }

                  @media print{

                      body {
                          display: block;
                      }

                      @page {
                              size: 6cm 2.5cm;
                              margin: -3.45cm -2.9cm;;
                              orientation: landscape;
                          }

                      .etiqueta-remarcacao-page {
                          display: flex;
                          flex-wrap: wrap;
                          align-content: flex-start;
                          margin: 0 0 0 6%;
                          width: 100%;
                          height: 95%;
                          padding: 0;
                      }

                      .etiqueta-remarcacao-page-number {
                          display: none;
                      }

                      .etiqueta-remarcacao-card {
                          width: 24% ;
                          height: 100%;
                          margin-right: 0;
                          margin-bottom: 0;
                          padding: 29% 0 0 3px !important;
                          box-sizing: border-box;
                          display: flex;
                          flex-direction: column;
                          justify-content: flex-start;
                          align-items: center;
                          page-break-after: always;
                      }

                      .preco-remarcacao{
                          font-weight: bold;
                          letter-spacing: -2px !important;
                          display: flex !important;
                          align-items: center !important;
                          width: 100% !important;
                      }

                      h2{
                          font-size: 1.31em !important;
                          margin: 0% !important;
                      }
                  }
              </style>
              <script>
                  window.onafterprint = function() {
                      window.close();
                  };

                  window.document.addEventListener('DOMContentLoaded', function() {
                      window.focus();
                      window.print();
                  });
              </script>
          </head>
          <body>
              ${htmlEtiquetas}
          </body>
      </html>
      `;

      // Método EXATO do jQuery - sem alterações
      console.log('🪟 Abrindo window.open...');
      let tela_impressao = window.open('', '', '');
      
      if (!tela_impressao) {
        console.error('❌ Window.open foi bloqueado!');
        throw new Error('Pop-up foi bloqueado pelo navegador');
      }

      console.log('✅ Janela aberta com sucesso');
      console.log('📝 Escrevendo HTML na janela...');
      
      tela_impressao = tela_impressao.document;

      tela_impressao.open();
      tela_impressao.write(htmlToPrint);
      tela_impressao.close();
      
      console.log('✅ HTML escrito com sucesso na janela');

      // Feedback igual ao jQuery (com msgSuccess adaptado para Swal)
      setTimeout(() => {
        Swal.fire({
          icon: 'success',
          title: 'Processo de Impressão Finalizado!',
          showConfirmButton: false,
          timer: 1500
        });
      }, 2000);

    } catch (error) {
      console.error('❌ Erro na impressão:', error);
      Swal.close();
      
      if (error.message.includes('Pop-up foi bloqueado')) {
        Swal.fire({
          icon: 'warning',
          title: 'Pop-up Bloqueado!',
          text: 'Permita pop-ups para esta página e tente novamente',
          confirmButtonText: 'Tentar Novamente',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            handlePrint(); // Tenta novamente
          }
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao tentar imprimir',
          text: error.message || 'Recarregue e tente novamente'
        });
      }
    }
  };

  // Função usando o serviço WebSocket adaptado do jQuery - FORMATO CORRETO 4x4
  const handlePrintZPLWebSocket = async () => {
    try {
      console.log('🌐 Iniciando impressão via WebSocket...');
      console.log('📊 Dados:', { etiquetas, copias, quantidadeEtiquetas });
      console.log('📄 Etiquetas por página:', etiquetasPorPagina);
      
      let comandosZPL = '';
      
      // Para cada cópia solicitada
      for (let numCopia = 0; numCopia < copias; numCopia++) {
        console.log(`🔄 Processando cópia ${numCopia + 1} de ${copias}`);
        
        // Para cada página (4 etiquetas por página)
        etiquetasPorPagina.forEach((paginaEtiquetas, indicePagina) => {
          console.log(`📄 Página ${indicePagina + 1} com ${paginaEtiquetas.length} etiquetas`);
          
          // Inicia uma página ZPL (baseado no exemplo fornecido)
          comandosZPL += `
            ^XA
            ^PR2
            ^MD15
            ^FWN
            ^PW800
            ^LL80
            ^CI28
          `;
          
          // Posições das 4 etiquetas (baseado no exemplo ZPL fornecido)
          const posicoes = [
            { x: 32, y: 25 },   // Primeira posição: ^FO32,25
            { x: 216, y: 25 },  // Segunda posição: ^FO216,25
            { x: 400, y: 25 },  // Terceira posição: ^FO400,25
            { x: 584, y: 25 }   // Quarta posição: ^FO584,25
          ];
          
          // Adiciona cada etiqueta da página nas posições corretas
          paginaEtiquetas.forEach((etiqueta, indiceEtiqueta) => {
            const posicao = posicoes[indiceEtiqueta];
            if (posicao) {
              const valorFormatado = formatMoeda(etiqueta.valor);
              // Formato exato do exemplo: ^FO32,25^A0,40,30^FB184,1,1,C,0^FDR$ 1,00^FS
              comandosZPL += `^FO${posicao.x},${posicao.y}^A0,40,30^FB184,1,1,C,0^FD${valorFormatado}^FS
`;
              console.log(`  💰 Etiqueta ${indiceEtiqueta + 1}: ${valorFormatado} na posição (${posicao.x}, ${posicao.y})`);
            }
          });
          
          // Finaliza a página
          comandosZPL += `^XZ

`;
        });
      }

      console.log('📋 Comandos ZPL finais (formato 4x4):', comandosZPL);
      console.log('📏 Total de páginas a imprimir:', etiquetasPorPagina.length * copias);

      // Envia para impressora via WebSocket
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

/* 
  estou criando uma rotina para impressão direta em uma impressora ZPL
  via comandos html simples eu já tenho um código que esta em javascript com jquery que faz isso,
  eu consumo o serviço da impressão direto no driver da impressora, que está instalado no meu windows.
  agora estou adaptando esse código para funcionar dentro do meu projeto React.
  no contexto do código eu estou colando o arquivo etiqueta.js que é o código original em jquery.
  que já faz tudo isso.
  e também o meu código react que estou desenvolvendo. porém o meu codigo react não está funcionando.
  a impressão não esta sainda da mesma forma que o código em jquery.
  o que pode estar errado no meu código react?
  o que eu posso fazer para corrigir isso?

  qual seria a melhor forma de imprimir etiquetas em react?
  seria com o window.open?
  existi alguma biblioteca melhor para fazer isso?
  
*/
