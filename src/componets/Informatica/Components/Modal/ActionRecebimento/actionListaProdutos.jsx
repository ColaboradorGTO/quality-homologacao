import { Fragment, useRef, useState } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { formatMoeda } from "../../../../../utils/formatMoeda";
import HeaderTable from "../../../../Tables/headerTable";
import { toFloat } from "../../../../../utils/toFloat";

export const ActionListaProdutos = ({ dadosPagamentoModal }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();


    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Relação de Produtos ',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['VR. Dinheiro', 'Vr. Cartão', 'Vr. POS', 'Vr. Convênio', 'Vr. Voucher']],
            body: dadosPagamentos.map(item => [
                item.contador,
                item.CPROD,
                item.XPROD,
                item.CEAN,
                toFloat(item.QTD),
                formatMoeda(item.VUNCOM),
                formatMoeda(item.VRTOTALLIQUIDO)

            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('relacao_recebimentos_venda.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dadosPagamentos);
        const workbook = XLSX.utils.book_new();
        const header = ['VR. Dinheiro', 'Vr. Cartão', 'Vr. POS',  'Vr. Convênio', 'Vr. Voucher'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'VR. Dinheiro' },
            { wpx: 250, caption: 'Vr. Cartão' },
            { wpx: 100, caption: 'Vr. POS' },
            { wpx: 100, caption: 'Vr. Convênio' },
            { wpx: 100, caption: 'Vr. Voucher' }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Produtos');
        XLSX.writeFile(workbook, 'relacao_recibimentos_venda.xlsx');
    }
    const dadosPagamentos = dadosPagamentoModal.map((item) => {

        return {
            IDVENDA: item.venda.IDVENDA,
            IDEMPRESA: item.venda.IDEMPRESA,
            IDCAIXAWEB: item.venda.IDCAIXAWEB,
            IDOPERADOR: item.venda.IDOPERADOR,
            VRDINHEIRO: item.venda.VRDINHEIRO,
            VRRECCARTAO: item.venda.VRRECCARTAO,
            VRRECPOSVENDA: item.venda.VRRECPOSVENDA,
            VRRECPOS: item.venda.VRRECPOS,
            VRRECPIX: item.venda.VRRECPIX,
            VRRECMOOVPAY: item.venda.VRRECMOOVPAY,
            VRRECCONVENIO: item.venda.VRRECCONVENIO,
            VRRECVOUCHER: item.venda.VRRECVOUCHER,
            VRTOTALVENDA: item.venda.VRTOTALVENDA,
            ULTNITEM: item.venda.ULTNITEM,


        }
    });

    const colunasPagamento = [
        {
            field: 'VRDINHEIRO',
            header: 'VR. Dinheiro',
            body: row => <th>{formatMoeda(row.VRDINHEIRO)}</th>,
            sortable: true,
        },
        {
            field: 'VRRECCARTAO',
            header: 'Vr. Cartão',
            body: row => <th>{formatMoeda(row.VRRECCARTAO)}</th>,
            sortable: true,

        },
        {
            field: 'VRRECPOS',
            header: 'Vr. POS',
            body: row => <th>{formatMoeda(row.VRRECPOS)}</th>,
            sortable: true,

        },
        {
            field: 'VRRECPIX',
            header: 'Vr. PIX',
            body: row => <th>{formatMoeda(row.VRRECPIX)}</th>,
            sortable: true,

        },
        {
            field: 'VRRECMOOVPAY',
            header: 'Vr. MP',
            body: row => <th>{formatMoeda(row.VRRECMOOVPAY)}</th>,
            sortable: true,

        },
        {
            field: 'VRRECCONVENIO',
            header: 'Vr. Convênio',
            body: row => <th>{formatMoeda(row.VRRECCONVENIO)}</th>,
            sortable: true,

        },
        {
            field: 'VRRECVOUCHER',
            header: 'Vr. Voucher',
            body: row => <th>{formatMoeda(row.VRRECVOUCHER)}</th>,
            sortable: true,
        },
    ]

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>Lista de Recebimentos da Venda Nº: {dadosPagamentos[0]?.IDVENDA}</h2>
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
                        title="Vendas por Loja"
                        value={dadosPagamentos}
                        sortField="VRTOTALPAGO"
                        size="small"
                        rows={true}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasPagamento.map(coluna => (
                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}
                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                bodyStyle={{ fontSize: '0.8rem' }}

                            />
                        ))}
                    </DataTable>
                </div>


            </div>
        </Fragment>
    )
}