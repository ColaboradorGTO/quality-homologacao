import { Fragment, useRef, useState } from "react"
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { toFloat } from "../../../../../utils/toFloat";
import HeaderTable from "../../../../Tables/headerTable";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const ActionRelacaoRecebimentos = ({ dadosPagamentoModal, show, handleClose }) => {
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
            head: [['Pagamento', 'Parcelas', 'Autorização', 'Valor Recebido']],
            body: dadosVendaPagamentos.map(item => [
                item.contador,
                item.DSTIPOPAGAMENTO,
                item.NOTEF,
                item.NOAUTORIZADOR,
                item.NUAUTORIZACAO,
                item.NPARCELAS,
                formatMoeda(item.VALORRECEBIDO),
                formatMoeda(item.VALORLIQUIDO)

            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('relacao_pagamento.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dadosVendaPagamentos);
        const workbook = XLSX.utils.book_new();
        const header = ['Pagamento', 'Parcelas', 'Autorização', 'Valor Recebido'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'Pagamento' },
            { wpx: 100, caption: 'Parcelas' },
            { wpx: 100, caption: 'Autorização' },
            { wpx: 100, caption: 'Valor Liquido' }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Relação de Pagamentos');
        XLSX.writeFile(workbook, 'relacao_pagamentos.xlsx');
    }

    const dadosVendaPagamentos = dadosPagamentoModal.flatMap((item) =>
        item.vendaPagamento.map((pagamento) => ({

            DSTIPOPAGAMENTO: pagamento.pag.DSTIPOPAGAMENTO,
            NPARCELAS: pagamento.pag.NPARCELAS,
            NUOPERACAO: pagamento.pag.NUOPERACAO,
            NSUAUTORIZADORA: pagamento.pag.NSUAUTORIZADORA,
            VALORRECEBIDO: pagamento.pag.VALORRECEBIDO
        }))
    );

    const colunasPagPos = [
        {
            field: 'DSTIPOPAGAMENTO',
            header: 'Pagamento',
            body: row => <th>{row.DSTIPOPAGAMENTO}</th>,
            sortable: true,
        },
        {
            field: 'NPARCELAS',
            header: 'Parcelas',
            body: row => <th>{toFloat(row.NPARCELAS)}</th>,
            sortable: true,
        },
        {
            field: 'NUOPERACAO',
            header: 'NSU_CTF',
            body: row => <th>{toFloat(row.NUOPERACAO)}</th>,
            sortable: true,
        },
        {
            field: 'NSUAUTORIZADORA',
            header: 'Autorização',
            body: row => <th>{row.NSUAUTORIZADORA}</th>,
            sortable: true,
        },
        {
            field: 'VALORRECEBIDO',
            header: 'Vr. Recebido',
            body: row => <th>{formatMoeda(row.VALORRECEBIDO)}</th>,
            sortable: true,
        },
    ]
    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">

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
                        value={dadosVendaPagamentos}
                        size="small"
                        rows={true}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasPagPos.map(coluna => (
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

