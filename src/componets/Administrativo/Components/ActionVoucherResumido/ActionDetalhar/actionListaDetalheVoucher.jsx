import { Fragment, useRef, useState } from "react"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { toFloat } from "../../../../../utils/toFloat"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../Tables/headerTable"

export const ActionDetalheVoucher = ({ dadosDetalheVoucher }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [rowSelection, setRowSelection] = useState(null);
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Detalhe Voucher',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Cod. Barras', 'Descrição', 'Vr Unit', 'QTD', 'Vr Bruto', 'Vr Desconto', 'Vr Líquido']],
            body: dados.map(item => [
                item.NUCODBARRAS,
                item.DSPRODUTO,
                formatMoeda(item.VRUNIT),
                toFloat(item.QTD),
                formatMoeda(item.VRTOTALBRUTO),
                formatMoeda(item.VRDESCONTO),
                formatMoeda(item.VRTOTALLIQUIDO)
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('detalhe_voucher.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Cod. Barras', 'Descrição', 'Vr Unit', 'QTD', 'Vr Bruto', 'Vr Desconto', 'Vr Líquido'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'Cod. Barras' },
            { wpx: 200, caption: 'Descrição' },
            { wpx: 200, caption: 'Vr Unit' },
            { wpx: 200, caption: 'QTD' },
            { wpx: 100, caption: 'Vr Bruto' },
            { wpx: 200, caption: 'Vr Desconto' },
            { wpx: 200, caption: 'Vr Líquido' }

        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhe Voucher');
        XLSX.writeFile(workbook, 'detalhe_voucher.xlsx');
    };

    const dados = dadosDetalheVoucher.map((item) => {

        return {
            NUVOUCHER: item.NUVOUCHER,
            IDVOUCHER: item.IDVOUCHER,
            NUCODBARRAS: item.NUCODBARRAS,
            DSPRODUTO: item.DSPRODUTO,
            VRUNIT: toFloat(item.VRUNIT),
            VRDESCONTO: toFloat(item.VRDESCONTO),
            QTD: item.QTD,
            VRTOTALBRUTO: toFloat(item.VRTOTALBRUTO),
            VRTOTALDESCONTO: toFloat(item.VRTOTALDESCONTO),
            VRTOTALLIQUIDO: toFloat(item.VRTOTALLIQUIDO),
            STCANCELADO: item.STCANCELADO,

        }
    })

    const colunasProdutosVoucher = [
        {
            field: 'NUCODBARRAS',
            header: 'Cod. Barras',
            body: row => <th style={{ color: 'blue' }}>{row.NUCODBARRAS}</th>,
            sortable: true,
        },
        {
            field: 'DSPRODUTO',
            header: 'Descrição',
            body: row => <th style={{ color: 'blue' }}>{row.DSPRODUTO}</th>,
            sortable: true,
        },
        {
            field: 'VRUNIT',
            header: 'Vr Unit',
            body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRUNIT)}</th>,
            sortable: true,
        },
        {
            field: 'QTD',
            header: 'QTD',
            body: row => <th style={{ color: 'blue' }}>{row.QTD}</th>,
            sortable: true,
        },
        {
            field: 'VRTOTALBRUTO',
            header: 'Vr Bruto',
            body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRTOTALBRUTO)}</th>,
            sortable: true,
        },
        {
            field: 'VRDESCONTO',
            header: 'Vr Desconto',
            body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRDESCONTO)}</th>,
            sortable: true,
        },
        {
            field: 'VRTOTALLIQUIDO',
            header: 'Vr Líquido',
            body: row => <th style={{ color: 'blue' }}>{formatMoeda(row.VRTOTALLIQUIDO)}</th>,
            sortable: true,
        },

    ]

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">

                    <h2 className="p-3">Produtos Venda de Origem:  {dados[0]?.NUVOUCHER} </h2>
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
                        title="Produtos do Voucher"
                        value={dados}
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
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                    >
                        {colunasProdutosVoucher.map(coluna => (
                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}
                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                                bodyStyle={{ fontSize: '0.8rem' }}

                            />
                        ))}

                    </DataTable>
                </div>

            </div>
        </Fragment>
    )
}