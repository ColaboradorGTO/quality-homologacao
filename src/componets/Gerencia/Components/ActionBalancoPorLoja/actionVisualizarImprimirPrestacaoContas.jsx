import { Fragment, useRef, useState } from "react";
import Modal from 'react-bootstrap/Modal';
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { useReactToPrint } from "react-to-print";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";
import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";

export const ActionVisualizarImprimirPrestacaoContas = ({ show, handleClose, dadosListaContasBalanco }) => {
  const [visualizarImpressao, setVisualizarImpressao] = useState(false);
  const [tabela, setTabela] = useState(true);
  const dataTableRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: '',
  });

  const calculoTotalGeralEntrada = (item) => {

    return (
      toFloat(item?.listagem.VRESTOQUEANTERIOR) +
      toFloat(item?.entmerrec.VLRTOTALENTRADA) 
      // toFloat(item?.entsobmer.VLRTOTALSOBRA) +
      // toFloat(item?.entaltmer.VLRTOTALALTA) +
      // toFloat(item?.entvoucher.VLRTOTALVOUCHER)
    )
  }

  const calculoTotalGeralSaida = (item) => {

    return (
  
      toFloat(item?.saidevmer.VLRTOTALDEVOLUCAO) +
      toFloat(item?.saivenda.VLRDESCONTOCAIXA) +
      toFloat(item?.saivenda.VLRVENDACAIXA) 
      // toFloat(item?.saifalmer.VLRTOTALFALTA) 
      // toFloat(item?.saibaimer.VLRTOTALBAIXA)
    );
  }

  const dadosModalImprimir = dadosListaContasBalanco.map((item) => {
    let VlrTotalGeralEntrada = calculoTotalGeralEntrada(item);
    let VlrTotalGeralSaida = calculoTotalGeralSaida(item);
    let VlrTotalPrestarContas = calculoTotalGeralEntrada(item) - calculoTotalGeralSaida(item);
    let VlrTotalDiferenca = VlrTotalPrestarContas - item?.listagem.VRESTOQUEATUAL;
    // let TotalPercentualFalta = (parseFloat(VlrTotalDiferenca) / parseFloat(item?.saivenda.VLRVENDACAIXA)) * 100;
    if(parseFloat(item?.saivenda.VLRVENDACAIXA) == 0) {
      var TotalPercentualFalta = 0
    } else {
      TotalPercentualFalta = (parseFloat(VlrTotalDiferenca) / parseFloat(item?.saivenda.VLRVENDACAIXA)) * 100;
    }

    return {
      VRESTOQUEANTERIOR: item?.listagem.VRESTOQUEANTERIOR,
      VLRTOTALENTRADA: item?.entmerrec.VLRTOTALENTRADA,
      VLRTOTALDEVOLUCAO: item?.saidevmer.VLRTOTALDEVOLUCAO,
      VLRDESCONTOCAIXA: item?.saivenda.VLRDESCONTOCAIXA,
      VLRVENDACAIXA: item?.saivenda.VLRVENDACAIXA,
      VLRTOTALFALTA: item?.saifalmer.VLRTOTALFALTA,
      VRESTOQUEATUAL: item?.listagem.VRESTOQUEATUAL,
      VLRTOTALSOBRA: item?.entsobmer.VLRTOTALSOBRA,
      VLRTOTALALTA: item?.entaltmer.VLRTOTALALTA,
      VLRTOTALVOUCHER: item?.entvoucher.VLRTOTALVOUCHER,
      TotalPercentualFalta: toFloat(TotalPercentualFalta),
      VlrTotalGeralEntrada: parseFloat(VlrTotalGeralEntrada),
      VlrTotalGeralSaida: parseFloat(VlrTotalGeralSaida),
      VlrTotalPrestarContas: toFloat(VlrTotalPrestarContas),
      VlrTotalDiferenca: toFloat(VlrTotalDiferenca),
    }
  })


  return (
    <Fragment>
      <Modal show={show} onHide={handleClose} size="xl" className="modal fade" tabIndex={-1} role="dialog" aria-hidden="true">
        <div style={{ padding: "10px" }}>
          <HeaderModal title={"PRESTAÇÃO DE CONTAS DO BALANÇO"} handleClose={handleClose} />

          <Modal.Body>
            {tabela && (

              <div ref={dataTableRef}>
                <header class="table table-hover table-striped w-100 table-sm">
                  <div>
                    <div>
                      <p>Balanço Nº: <b>{dadosListaContasBalanco[0]?.listagem.IDRESUMOBALANCO} </b> </p>
                      <p> Loja: <b> {dadosListaContasBalanco[0]?.listagem.NOFANTASIA} </b> </p>
                      <p>Período: <b>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA} </b> </p>
                    </div>
                  </div>
                </header>

                <table class="table table-hover table-striped  table-sm" style={{ border: 'none' }}>
                  <tr>
                    <th colspan="4" style={{ fontWeight: 800, border: 'none' }}>HISTÓRICO DE ENTRADAS</th>

                  </tr>
                  <tr>
                    <th width="30%" style={{ border: 'none' }}>Estoque Anterior</th>
                    <td width="35%" style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEANTERIOR))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>

                  </tr>
                  <tr>
                    <th width="30%">Mercadorias Recebidas (Romaneios)</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.entmerrec.VLRTOTALENTRADA))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  {/* <tr>
                    <th>Sobra Mercadoria</th>
                    <td style={{ border: 'none' }}>
                      {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entsobmer.VLRTOTALSOBRA))}
                    </td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr> */}
                  <tr>
                    <th>Alta de Mercadoria</th>
                    <td style={{ border: 'none' }}>
                      {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entaltmer.VLRTOTALALTA))}
                    </td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  {/* <tr>
                    <th>Voucher</th>
                    <td style={{ border: 'none' }}>
                      {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entvoucher.VLRTOTALVOUCHER))}
                    </td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr> */}
                  <tr>
                    <th style={{ fontWeight: 800 }}>TOTAL GERAL ENTRADAS</th>
                    <th style={{ border: 'none' }}>{formatMoeda(dadosModalImprimir[0]?.VlrTotalGeralEntrada)}</th>
                  </tr>
                  <tr>
                    <td colspan="4" style={{ border: 'none' }}></td>
                  </tr>
                  <tr>
                    <th colspan="4" style={{ border: 'none' }}>HISTÓRICO DE SAÍDA</th>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Devolução de Mercadorias</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saidevmer.VLRTOTALDEVOLUCAO))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  {/* <tr>
                    <th style={{ border: 'none' }}>Falta de Mercadorias</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saifalmer.VLRTOTALFALTA))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr> */}
                  <tr>
                    <th style={{ border: 'none' }}>Baixa de Mercadorias</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saibaimer.VLRTOTALBAIXA))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Venda Geral</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRVENDACAIXA))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Desconto de Mercadoria</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRDESCONTOCAIXA))}</td>
                    <th style={{ border: 'none' }}>Data</th>
                    <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
                  </tr>
                  <tr>
                    <th style={{ fontWeight: 800 }}>TOTAL GERAL SAÍDAS</th>
                    <th style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalGeralSaida))}</th>
                  </tr>
                  <tr>
                    <td colspan="4" style={{ border: 'none' }}></td>
                  </tr>
                  <tr>
                    <th colspan="4" style={{ border: 'none' }}>PRESTAÇÃO DE CONTAS</th>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Total à Prestar Contas</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalPrestarContas))}</td>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Estoque Atual</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEATUAL))}</td>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Diferença</th>
                    <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalDiferenca))}</td>
                  </tr>
                  <tr>
                    <th style={{ border: 'none' }}>Falta Percentual</th>
                    <td style={{ border: 'none' }}>{formatarPorcentagem(dadosModalImprimir[0]?.TotalPercentualFalta, 3)}</td>
                  </tr>

                </table>
              </div>
            )}

            {visualizarImpressao && (
              <div className="container" ref={dataTableRef}>

                <div className="row" >
                  <header className="col-sm-12" >
                    <h1 style={{ fontWeight: 800 }}>Balanço Nº: {dadosListaContasBalanco[0]?.listagem.IDRESUMOBALANCO}  </h1>
                    <h2 style={{ fontWeight: 800 }}> Loja:  {dadosListaContasBalanco[0]?.listagem.NOFANTASIA}  </h2>
                    <h3 style={{ fontWeight: 800 }}>Período: {toFloat(dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR)} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA} </h3>
                  </header>
                </div>
                <div class="row">
                  <div class="col-sm-4 d-flex">
                    <div class="table-responsive">

                      <table class="table table-clean table-sm align-self-end" style={{ border: 'none' }}>
                        <tbody>
                          <tr>
                            <th colspan="4" style={{ fontWeight: 800, borderBottom: '1px solid', textAlign: 'center' }}>HISTÓRICO DE ENTRADAS</th>

                          </tr>
                          <tr>
                            <td width="30%" style={{ border: 'none' }}>Estoque Anterior</td>
                            <td width="35%" style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEANTERIOR))}</td>

                          </tr>
                          <tr>
                            <td width="30%" style={{ border: 'none' }}>Mercadorias Recebidas (Romaneios)</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(dadosListaContasBalanco[0]?.entmerrec.VLRTOTALENTRADA)}</td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Alta de Mercadoria</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>
                              {formatMoeda(dadosListaContasBalanco[0]?.entaltmer.VLRTOTALALTA)}
                            </td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>TOTAL GERAL ENTRADAS</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(dadosModalImprimir[0]?.VlrTotalGeralEntrada)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-sm-4 d-flex">
                    <div class="table-responsive">
                      <table class="table table-clean table-sm align-self-end">
                        <tbody>
                          <tr>
                            <th colspan="2" style={{ fontWeight: 800, borderBottom: '1px solid', textAlign: 'center' }}>HISTÓRICO DE SAÍDA</th>
                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Devolução de Mercadorias</td>
                            <td style={{ border: 'none',textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saidevmer.VLRTOTALDEVOLUCAO))}</td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Baixa de Mercadorias</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saibaimer.VLRTOTALBAIXA))}</td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Venda Geral</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRVENDACAIXA))}</td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Desconto de Mercadoria</td>
                            <td style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRDESCONTOCAIXA))}</td>

                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>TOTAL GERAL SAÍDAS</td>
                            <th style={{ border: 'none', textAlign: 'end' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalGeralSaida))}</th>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-sm-4 d-flex">
                    <div class="table-responsive">
                      <table class="table table-clean table-sm align-self-end">
                        <tbody>
                          <tr>
                            <th colspan="2" style={{ fontWeight: 800, textAlign: 'center', borderBottom: '1px solid', }}>PRESTAÇÃO DE CONTAS</th>
                          </tr>
                          <tr>

                            <td style={{ border: 'none' }}>Total à Prestar Contas</td>
                            <td style={{ border: 'none',textAlign: 'end' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalPrestarContas))}</td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Estoque Atual</td>
                            <td style={{ border: 'none',textAlign: 'end' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEATUAL))}</td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Diferença</td>
                            <td style={{ border: 'none',textAlign: 'end' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalDiferenca))}</td>
                          </tr>
                          <tr>
                            <td style={{ border: 'none' }}>Falta Percentual</td>
                            <td style={{ border: 'none',textAlign: 'end' }}>{formatarPorcentagem(dadosModalImprimir[0]?.TotalPercentualFalta)}</td>
                          </tr>

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

            )}

          </Modal.Body>

          <FooterModal
            ButtonTypeConfirmar={ButtonTypeModal}
            textButtonConfirmar={"Fechar"}
            onClickButtonConfirmar={handleClose}
            corConfirmar={"secondary"}

            ButtonTypeFechar={ButtonTypeModal}
            textButtonFechar={!visualizarImpressao ? "Visualizar Impressão" : "Visualizar Tabela"}
            onClickButtonFechar={() => { setVisualizarImpressao(!visualizarImpressao), setTabela(!tabela) }}
            corFechar="primary"

            ButtonTypeCadastrar={ButtonTypeModal}
            onClickButtonCadastrar={handlePrint}
            textButtonCadastrar={"Imprimir"}
            corCadastrar={"success"}

          />
        </div>

      </Modal>
    </Fragment>
  );
};



// import { Fragment, useRef, useState } from "react"
// import Modal from 'react-bootstrap/Modal';
// import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
// import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
// import { FooterModal } from "../../../Modais/FooterModal/footerModal";
// import { formatMoeda } from "../../../../utils/formatMoeda";
// import { toFloat } from "../../../../utils/toFloat";
// import { useReactToPrint } from "react-to-print";
// import { formatarPorcentagem } from "../../../../utils/formatarPorcentagem";

// export const ActionVisualizarImprimirPrestacaoContas = ({ show, handleClose, dadosListaContasBalanco }) => {
//   const [visualizarImpressao, setVisualizarImpressao] = useState(false);
//   const [tabela, setTabela] = useState(true);
//   const dataTableRef = useRef();

//   const handlePrint = useReactToPrint({
//     content: () => dataTableRef.current,
//     documentTitle: '',
//   });

//   const calculoTotalGeralEntrada = (item) => {

//     return (
//       toFloat(item?.listagem.VRESTOQUEANTERIOR) +
//       toFloat(item?.entmerrec.VLRTOTALENTRADA) +
//       toFloat(item?.entsobmer.VLRTOTALSOBRA) +
//       toFloat(item?.entaltmer.VLRTOTALALTA) +
//       toFloat(item?.entvoucher.VLRTOTALVOUCHER)
//     )
//   }

//   const calculoTotalGeralSaida = (item) => {

//     return (
  
//       toFloat(item?.saidevmer.VLRTOTALDEVOLUCAO) +
//       toFloat(item?.saivenda.VLRDESCONTOCAIXA) +
//       toFloat(item?.saivenda.VLRVENDACAIXA) +
//       toFloat(item?.saifalmer.VLRTOTALFALTA) +
//       toFloat(item?.saibaimer.VLRTOTALBAIXA)
//     );
//   }

//   const dadosModalImprimir = dadosListaContasBalanco.map((item) => {
//     let VlrTotalGeralEntrada = calculoTotalGeralEntrada(item);
//     let VlrTotalGeralSaida = calculoTotalGeralSaida(item);
//     let VlrTotalPrestarContas = calculoTotalGeralEntrada(item) - calculoTotalGeralSaida(item);
//     let VlrTotalDiferenca = VlrTotalPrestarContas - item?.listagem.VRESTOQUEATUAL;
//     let TotalPercentualFalta = (parseFloat(VlrTotalDiferenca) / parseFloat(item?.saivenda.VLRVENDACAIXA)) * 100;

//     return {
//       VRESTOQUEANTERIOR: item?.listagem.VRESTOQUEANTERIOR,
//       VLRTOTALENTRADA: item?.entmerrec.VLRTOTALENTRADA,
//       VLRTOTALDEVOLUCAO: item?.saidevmer.VLRTOTALDEVOLUCAO,
//       VLRDESCONTOCAIXA: item?.saivenda.VLRDESCONTOCAIXA,
//       VLRVENDACAIXA: item?.saivenda.VLRVENDACAIXA,
//       VLRTOTALFALTA: item?.saifalmer.VLRTOTALFALTA,
//       VRESTOQUEATUAL: item?.listagem.VRESTOQUEATUAL,
//       VLRTOTALSOBRA: item?.entsobmer.VLRTOTALSOBRA,
//       VLRTOTALALTA: item?.entaltmer.VLRTOTALALTA,
//       VLRTOTALVOUCHER: item?.entvoucher.VLRTOTALVOUCHER,
//       TotalPercentualFalta: toFloat(TotalPercentualFalta),
//       VlrTotalGeralEntrada: parseFloat(VlrTotalGeralEntrada),
//       VlrTotalGeralSaida: parseFloat(VlrTotalGeralSaida),
//       VlrTotalPrestarContas: toFloat(VlrTotalPrestarContas),
//       VlrTotalDiferenca: toFloat(VlrTotalDiferenca),
//     }
//   })


//   return (
//     <Fragment>
//       <Modal show={show} onHide={handleClose} size="xl" className="modal fade" tabIndex={-1} role="dialog" aria-hidden="true">
//         <div style={{ padding: "10px" }}>
//           <HeaderModal title={"PRESTAÇÃO DE CONTAS DO BALANÇO"} handleClose={handleClose} />

//           <Modal.Body>
//             {tabela && (

//               <div>
//                 <header class="table table-hover table-striped w-100 table-sm">
//                   <div>
//                     <div>
//                       <p>Balanço Nº: <b>{dadosListaContasBalanco[0]?.listagem.IDRESUMOBALANCO} </b> </p>
//                       <p> Loja: <b> {dadosListaContasBalanco[0]?.listagem.NOFANTASIA} </b> </p>
//                       <p>Período: <b>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA} </b> </p>
//                     </div>
//                   </div>
//                 </header>

//                 <table class="table table-hover table-striped  table-sm" style={{ border: 'none' }}>
//                   <tr>
//                     <th colspan="4" style={{ fontWeight: 800, border: 'none' }}>HISTÓRICO DE ENTRADAS</th>

//                   </tr>
//                   <tr>
//                     <th width="30%" style={{ border: 'none' }}>Estoque Anterior</th>
//                     <td width="35%" style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEANTERIOR))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>

//                   </tr>
//                   <tr>
//                     <th width="30%">Mercadorias Recebidas (Romaneios)</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.entmerrec.VLRTOTALENTRADA))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th>Sobra Mercadoria</th>
//                     <td style={{ border: 'none' }}>
//                       {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entsobmer.VLRTOTALSOBRA))}
//                     </td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th>Alta de Mercadoria</th>
//                     <td style={{ border: 'none' }}>
//                       {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entaltmer.VLRTOTALALTA))}
//                     </td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th>Voucher</th>
//                     <td style={{ border: 'none' }}>
//                       {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entvoucher.VLRTOTALVOUCHER))}
//                     </td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ fontWeight: 800 }}>TOTAL GERAL ENTRADAS</th>
//                     <th style={{ border: 'none' }}>{dadosModalImprimir?.VlrTotalGeralEntrada}</th>
//                   </tr>
//                   <tr>
//                     <td colspan="4" style={{ border: 'none' }}></td>
//                   </tr>
//                   <tr>
//                     <th colspan="4" style={{ border: 'none' }}>HISTÓRICO DE SAÍDA</th>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Devolução de Mercadorias</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saidevmer.VLRTOTALDEVOLUCAO))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Falta de Mercadorias</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saifalmer.VLRTOTALFALTA))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Baixa de Mercadorias</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saibaimer.VLRTOTALBAIXA))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Venda Geral</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRVENDACAIXA))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Desconto de Mercadoria</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRDESCONTOCAIXA))}</td>
//                     <th style={{ border: 'none' }}>Data</th>
//                     <td style={{ border: 'none' }}>{dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ fontWeight: 800 }}>TOTAL GERAL SAÍDAS</th>
//                     <th style={{ border: 'none' }}>{dadosModalImprimir[0]?.VlrTotalGeralSaida}</th>
//                   </tr>
//                   <tr>
//                     <td colspan="4" style={{ border: 'none' }}></td>
//                   </tr>
//                   <tr>
//                     <th colspan="4" style={{ border: 'none' }}>PRESTAÇÃO DE CONTAS</th>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Total à Prestar Contas</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalPrestarContas))}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Estoque Atual</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEATUAL))}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Diferença</th>
//                     <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalDiferenca))}</td>
//                   </tr>
//                   <tr>
//                     <th style={{ border: 'none' }}>Falta Percentual</th>
//                     <td style={{ border: 'none' }}>{formatarPorcentagem(dadosModalImprimir[0]?.TotalPercentualFalta)}</td>
//                   </tr>

//                 </table>
//               </div>
//             )}

//             {visualizarImpressao && (
//               <div className="container" ref={dataTableRef}>

//                 <div className="row" >
//                   <header className="col-sm-12" >
//                     <h1 style={{ fontWeight: 800 }}>Balanço Nº: {dadosListaContasBalanco[0]?.listagem.IDRESUMOBALANCO}  </h1>
//                     <h2 style={{ fontWeight: 800 }}> Loja:  {dadosListaContasBalanco[0]?.listagem.NOFANTASIA}  </h2>
//                     <h3 style={{ fontWeight: 800 }}>Período: {dadosListaContasBalanco[0]?.listagem.DTESTOQUEANTERIOR} - {dadosListaContasBalanco[0]?.listagem.DTABERTURAFORMATADA} </h3>
//                   </header>
//                 </div>
//                 <div class="row">
//                   <div class="col-sm-4 d-flex">
//                     <div class="table-responsive">

//                       <table class="table table-clean table-sm align-self-end" style={{ border: 'none' }}>
//                         <tbody>
//                           <tr>
//                             <th colspan="4" style={{ fontWeight: 800, borderBottom: '1px solid', textAlign: 'center' }}>HISTÓRICO DE ENTRADAS</th>

//                           </tr>
//                           <tr>
//                             <td width="30%" style={{ border: 'none' }}>Estoque Anterior</td>
//                             <td width="35%" style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEANTERIOR))}</td>

//                           </tr>
//                           <tr>
//                             <td width="30%" style={{ border: 'none' }}>Mercadorias Recebidas (Romaneios)</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.entmerrec.VLRTOTALENTRADA))}</td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Alta de Mercadoria</td>
//                             <td style={{ border: 'none' }}>
//                               {formatMoeda(toFloat(dadosListaContasBalanco[0]?.entaltmer.VLRTOTALALTA))}
//                             </td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>TOTAL GERAL ENTRADAS</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(dadosModalImprimir[0]?.VlrTotalGeralEntrada)}</td>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-sm-4 d-flex">
//                     <div class="table-responsive">
//                       <table class="table table-clean table-sm align-self-end">
//                         <tbody>
//                           <tr>
//                             <th colspan="2" style={{ fontWeight: 800, borderBottom: '1px solid', textAlign: 'center' }}>HISTÓRICO DE SAÍDA</th>
//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Devolução de Mercadorias</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saidevmer.VLRTOTALDEVOLUCAO))}</td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Baixa de Mercadorias</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saibaimer.VLRTOTALBAIXA))}</td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Venda Geral</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRVENDACAIXA))}</td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Desconto de Mercadoria</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.saivenda.VLRDESCONTOCAIXA))}</td>

//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>TOTAL GERAL SAÍDAS</td>
//                             <th style={{ border: 'none' }}>{dadosModalImprimir[0]?.VlrTotalGeralSaida}</th>
//                           </tr>
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//                 <div class="row">
//                   <div class="col-sm-4 d-flex">
//                     <div class="table-responsive">
//                       <table class="table table-clean table-sm align-self-end">
//                         <tbody>
//                           <tr>
//                             <th colspan="2" style={{ fontWeight: 800, textAlign: 'center', borderBottom: '1px solid', }}>PRESTAÇÃO DE CONTAS</th>
//                           </tr>
//                           <tr>

//                             <td style={{ border: 'none' }}>Total à Prestar Contas</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalPrestarContas))}</td>
//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Estoque Atual</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosListaContasBalanco[0]?.listagem.VRESTOQUEATUAL))}</td>
//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Diferença</td>
//                             <td style={{ border: 'none' }}>{formatMoeda(toFloat(dadosModalImprimir[0]?.VlrTotalDiferenca))}</td>
//                           </tr>
//                           <tr>
//                             <td style={{ border: 'none' }}>Falta Percentual</td>
//                             <td style={{ border: 'none' }}>{formatarPorcentagem(dadosModalImprimir[0]?.TotalPercentualFalta)}</td>
//                           </tr>

//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>

//               </div>

//             )}

//           </Modal.Body>

//           <FooterModal
//             ButtonTypeConfirmar={ButtonTypeModal}
//             textButtonConfirmar={"Fechar"}
//             onClickButtonConfirmar={handleClose}
//             corConfirmar={"secondary"}

//             ButtonTypeFechar={ButtonTypeModal}
//             textButtonFechar={!visualizarImpressao ? "Visualizar Impressão" : "Visualizar Tabela"}
//             onClickButtonFechar={() => { setVisualizarImpressao(!visualizarImpressao), setTabela(!tabela) }}
//             corFechar="primary"

//             ButtonTypeCadastrar={ButtonTypeModal}
//             onClickButtonCadastrar={handlePrint}
//             textButtonCadastrar={"Imprimir"}
//             corCadastrar={"success"}

//           />
//         </div>

//       </Modal>
//     </Fragment>
//   );
// };