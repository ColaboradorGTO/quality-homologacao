import React, { Fragment, useState, useRef } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { GrFormView } from "react-icons/gr";
import { get } from "../../../../api/funcRequest";
import { dataFormatada, dataHoraFormatada} from "../../../../utils/dataFormatada";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import HeaderTable from "../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ActionDetalharVoucherModal } from "./ActionDetalhar/actionDetalharVoucherModal";
import Swal from "sweetalert2";

export const ActionListaVouchersResumido = ({dadosVoucher}) => {
  const [dadosDetalheVoucher, setDadosDetalheVoucher] = useState([])
  const [modalDetalhe, setModalDetalhe] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [rowSelection, setRowSelection] = useState(null);
  const dataTableRef = useRef();

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Vouchers Emitidos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Nº Voucher','Loja Emissor', 'Caixa Emissor', 'Data Emissão', 'Valor', 'Loja Recebido', 'Caixa Recebido', 'Data Recebida', 'Situação']],
      body: dados.map(item => [
        item.NUVOUCHER,
        item.EMPORIGEM,
        item.DSCAIXAORIGEM,
        dataFormatada(item.DTINVOUCHER),
        formatMoeda(item.VRVOUCHER),
        item.EMPDESTINO,
        item.DSCAIXADESTINO,
        dataFormatada(item.DTOUTVOUCHER),
        item.STATIVO == 'True' ? 'ATIVO' : 'USADO'

      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('voucher_emitidos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();
    const header = ['Nº Voucher','Loja Emissor', 'Caixa Emissor', 'Data Emissão', 'Valor', 'Loja Recebido', 'Caixa Recebido', 'Data Recebida', 'Situação'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Nº Voucher' },
      { wpx: 200, caption: 'Loja Emissor' },
      { wpx: 200, caption: 'Caixa Emissor' },
      { wpx: 200, caption: 'Data Emissão' },
      { wpx: 100, caption: 'Valor' },
      { wpx: 200, caption: 'Loja Recebido' },
      { wpx: 200, caption: 'Caixa Recebido' },
      { wpx: 200, caption: 'Data Recebida' },
      { wpx: 100, caption: 'Situação' }
     
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas por Vendedor');
    XLSX.writeFile(workbook, 'voucher_emitidos.xlsx');
  };

  const dadosExcel = dadosVoucher.map((item) => {

    return {
      NUVOUCHER: item.voucher.NUVOUCHER,
      EMPORIGEM: item.voucher.EMPORIGEM,
      DSCAIXAORIGEM: item.voucher.DSCAIXAORIGEM,
      DTINVOUCHER: item.voucher.DTINVOUCHER,
      VRVOUCHER: item.voucher.VRVOUCHER,
      EMPDESTINO: item.voucher.EMPDESTINO,
      DSCAIXADESTINO: item.voucher.DSCAIXADESTINO,
      DTOUTVOUCHER: item.voucher.DTOUTVOUCHER,
      STATIVO: item.voucher.STATIVO == 'True' ? 'ATIVO' : 'USADO',
    }
  });

  const dados = dadosVoucher.map((item) => {

    return {
      IDVOUCHER: item.voucher.IDVOUCHER,
      DTINVOUCHER: item.voucher.DTINVOUCHER,
      DTOUTVOUCHER: item.voucher.DTOUTVOUCHER,
      DSCAIXAORIGEM: item.voucher.DSCAIXAORIGEM,
      DSCAIXADESTINO: item.voucher.DSCAIXADESTINO,
      NUVOUCHER: item.voucher.NUVOUCHER,
      VRVOUCHER: item.voucher.VRVOUCHER,
      STATIVO: item.voucher.STATIVO,
      STCANCELADO: item.voucher.STCANCELADO,
      EMPORIGEM: item.voucher.EMPORIGEM,
      EMPDESTINO: item.voucher.EMPDESTINO,
      

    }
  });

  const colunasVouchers = [
    {
      field: 'NUVOUCHER',
      header: 'Nº Voucher',
      body: row => <th> {row.NUVOUCHER} </th>,
      sortable: true,
    },
    {
      field: 'EMPORIGEM',
      header: 'Loja Emissor',
      body: row => <p style={{width: '200px', fontWeight: 600}} > {row.EMPORIGEM} </p>,
      sortable: true,
    },
    {
      field: 'DSCAIXAORIGEM',
      header: 'Caixa Emissor',
      body: row => <th>{row.DSCAIXAORIGEM}</th>,
      sortable: true,
    },
    {
      field: 'DTINVOUCHER',
      header: 'Data Emissão',
      body: row => <th>{dataHoraFormatada(row.DTINVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'VRVOUCHER',
      header: 'Valor',
      body: row => <th style={{color: 'green'}}>{formatMoeda(row.VRVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'EMPDESTINO',
      header: 'Loja Recebido',
      body: row => <th>{row.EMPDESTINO}</th>,
      sortable: true,
    },
    {
      field: 'DSCAIXADESTINO',
      header: 'Caixa Recebido',
      body: row => <th>{row.DSCAIXADESTINO}</th>,
      sortable: true,
    },
    {
      field: 'DTOUTVOUCHER',
      header: 'Data Recebida',
      body: row => <th>{dataHoraFormatada(row.DTOUTVOUCHER)}</th>,
      sortable: true,
    },
    {
      field: 'STATIVO',
      header: 'Situação',
      body: row => {
        return (
          <th style={{color: row.STATIVO == 'True' ? 'blue' : 'red'}}>{row.STATIVO == 'True' ? 'ATIVO' : 'USADO'}</th>
        )
      },
      sortable: true,
    },
    {
      header: 'Detalhar',
      button: true,
      body: (row) => (
        <div className="d-flex "
          style={{ justifyContent: "space-between" }}
        >
          <div> 
          <ButtonTable
              titleButton={"Detalhar Produtos do Voucher"}
              onClickButton={() => handleClickDetalhar(row)}
              Icon={GrFormView}
              iconSize={25}
              iconColor={"#fff"}
              cor={"success"}
            />
          </div>

        </div>
      ),
    }
  ]
 
  const handleClickDetalhar = async (row) => {
    if (row.IDVOUCHER) {
      handleDetalhar(row.IDVOUCHER)
    }
  }

  const handleDetalhar = async (IDVOUCHER) => {
    try {
      const response = await get(`/detalheProdutoVoucher?idVoucher=${IDVOUCHER}`)
      if (response.data && response.data.length > 0) {
        setDadosDetalheVoucher(response.data)
        setModalDetalhe(true)
      } else {
        Swal.fire({
          icon: 'info',
          title: 'Nenhum detalhe encontrado',
          html: `Não foram encontrados detalhes para o voucher selecionado.`,
          timer: 3000,
          customClass: {
            container: 'custom-swal',
          },
        })
        return;
      }
      return response.data
    } catch (error) {
      console.log(error, "não foi possivel pegar os dados da tabela ")
    }
  }


  return (

    <Fragment> 
      <div className="panel">
        <div className="panel-hdr">
          <h2>Vouchers Emitidos</h2>
         
        </div>
        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <HeaderTable
            globalFilterValue={globalFilterValue}
            onGlobalFilterChange={onGlobalFilterChange}
            handlePrint={handlePrint}
            exportToExcel={exportToExcel}
            exportToPDF={exportToPDF}
          />
          
        </div>
        <div className="card" ref={dataTableRef}>

          <DataTable
            title="Vouchers Emitidos"
            value={dados}
            globalFilter={globalFilterValue}
            size="small"
            selectionMode="single"
            selection={rowSelection}
            onSelectionChange={(e) => setRowSelection(e.value)}
            sortOrder={-1}
            paginator={true}
            rows={10}
            rowsPerPageOptions={[5, 10, 20, 50, 100, dados.length]}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVouchers.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}
                
                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem'}}
                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc',fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>
      </div>

        <ActionDetalharVoucherModal
          handleClose={() => setModalDetalhe(false)}
          show={modalDetalhe}
          dadosDetalheVoucher={dadosDetalheVoucher}
        />
    </Fragment>
  )
}
