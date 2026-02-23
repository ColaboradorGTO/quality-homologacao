import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../utils/formatMoeda"
import { toFloat } from "../../../../utils/toFloat"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';


export const ActionListaDetalhamento = ({dadosListaRecebimentosLoja}) => {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null)
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Faturas Loja Período',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Empresa', 'Data Rec', 'Nº Mov', 'Caixa', 'Cod. Autorização', 'Valor', 'Recebedor', 'Situação', 'PIX']],
      body: dados.map(item => [
        item.NOFANTASIA,
        item.DTPROCESSAMENTO, 
        item.IDMOVIMENTOCAIXAWEB,
        item.DSCAIXA,
        item.NUCODAUTORIZACAO, 
        formatMoeda(item.VRRECEBIDO), 
        item.NOFUNCIONARIO, 
        item.STCANCELADO, 
        item.STPIX
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('faturas_loja.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturas Loja Período');
    XLSX.writeFile(workbook, 'faturas_loja.xlsx');
  };

  const calcularTotalValorRecebidoLoja = (item) => {
    return (
      toFloat(item.VALORTOTALDINHEIRO) +
      toFloat(item.VALORTOTALCARTAO) +
      toFloat(item.VALORTOTALCONVENIO) +
      toFloat(item.VRPOS) +
      toFloat(item.VALORTOTALVOUCHER) +
      toFloat(item.VRPIX) +
      toFloat(item.VRMOOVPAY)
    )
  }
  const dadosListaRecebimentos = dadosListaRecebimentosLoja.map((item, index) => {
    const valorTotalRecebido = calcularTotalValorRecebidoLoja(item);
    const percentualDinheiro = (parseFloat(item.VALORTOTALDINHEIRO) * 100) / valorTotalRecebido;
    const percentualCartao = (parseFloat(item.VALORTOTALCARTAO) * 100) / valorTotalRecebido;
    const percentualConvenio = (parseFloat(item.VALORTOTALCONVENIO) * 100) / valorTotalRecebido;
    const percentualPos = (parseFloat(item.VRPOS) * 100) / valorTotalRecebido;
    const percentualPix = (parseFloat(item.VRPIX) * 100) / valorTotalRecebido;
    const percentualMoovPay = (parseFloat(item.VRMOOVPAY) * 100) / valorTotalRecebido;
    const percentualVoucher = (parseFloat(item.VALORTOTALVOUCHER) * 100) / valorTotalRecebido;


    return {
      VALORTOTALDINHEIRO: item.VALORTOTALDINHEIRO,
      VALORTOTALCARTAO: item.VALORTOTALCARTAO,
      VALORTOTALCONVENIO: item.VALORTOTALCONVENIO,
      VALORTOTALPOS: item.VALORTOTALPOS,
      VRPOS: item.VRPOS,
      VRPIX: item.VRPIX,
      VRMOOVPAY: item.VRMOOVPAY,
      VALORTOTALVOUCHER: item.VALORTOTALVOUCHER,
      percentualDinheiro: percentualDinheiro,
      percentualCartao: percentualCartao,
      percentualConvenio: percentualConvenio,
      percentualPos: percentualPos,
      percentualPix: percentualPix,
      percentualMoovPay: percentualMoovPay,
      percentualVoucher: percentualVoucher,
      valorTotalRecebido: valorTotalRecebido

    }
  })

  return (

    <Fragment>

     {/*  como fazer esta tabela com  DataTable primereact */}
      <div>
        {dadosListaRecebimentos.map((row, index) => (
          <table className="table table-bordered table-hover table-responsive-lg table-striped w-100">
           
            <thead className="bg-primary-600">
              <tr>
                <th>Moeda</th>
                <th>Valor</th>
                <th>% da Venda</th>
              </tr>
            </thead>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }} >Dinheiro</td>
              
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VALORTOTALDINHEIRO)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualDinheiro).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>Cartão TEF</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VALORTOTALCARTAO)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualCartao).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>Convênio</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VALORTOTALCONVENIO)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualConvenio).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>Voucher</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VALORTOTALVOUCHER)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualVoucher).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>POS</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VRPOS)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualPos).toFixed(2)}</td>
            </tr>
            <tr>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>PIX</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{formatMoeda(row.VRPIX)}</td>
              <td style={{ textAlign: "center", fontSize: "14px", color: 'blue' }}>{parseFloat(row.percentualPix).toFixed(2)}</td>
            </tr>

            <tfoot class="thead-themed totalRecebimentoListaTef">
              <tr>
                <td style={{ textAlign: "center", fontSize: "14px" }}><b>Total</b></td>
                <td style={{ textAlign: "center", fontSize: "14px" }}><b>{formatMoeda(row.valorTotalRecebido)}</b></td>
                <td style={{ textAlign: "center", fontSize: "14px" }}></td>
              </tr>
            </tfoot>
          </table>
        ))}

      </div>
 
    </Fragment>
  )
}
