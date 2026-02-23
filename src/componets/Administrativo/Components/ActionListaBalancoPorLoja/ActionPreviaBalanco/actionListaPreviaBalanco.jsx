import { useState, useRef } from "react";
import Swal from "sweetalert2";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { useConsolidarBalanco } from "../hooks/useConsolidarBalanco";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../../Tables/headerTable";

export const ActionListaPreviaBalanco = ({ dadosPreviaBalancoModal, optionsModulos, usuarioLogado }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [rowSelection, setRowSelection] = useState(null);
    const dataTableRef = useRef();

    const {
        handleConsolidar
    } = useConsolidarBalanco({ optionsModulos, usuarioLogado })


    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Prévia Balanco Rel Produtos',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Produto', 'Cód Barras', 'Descrição', 'Estoque', 'Balanço', 'Sobra', 'Falta', 'R$ Venda', 'R$ Total']],
            body: dados.map(item => [

                item.IDPRODUTO,
                item.NUCODBARRAS,
                item.DSNOME,
                item.QTDFINAL,
                item.QTD,
                item.QTDSOBRA,
                item.QTDFALTA,
                formatMoeda(item.PRECOVENDA),
                formatMoeda(item.TOTALVENDA),
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('previa_balanco_relacao_produtos.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Produto', 'Cód Barras', 'Descrição', 'Estoque', 'Balanço', 'Sobra', 'Falta', 'R$ Venda', 'R$ Total'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'Produto' },
            { wpx: 100, caption: 'Cód Barras' },
            { wpx: 100, caption: 'Descrição' },
            { wpx: 100, caption: 'Estoque' },
            { wpx: 100, caption: 'Balanço' },
            { wpx: 100, caption: 'Sobra' },
            { wpx: 100, caption: 'Falta' },
            { wpx: 100, caption: 'R$ Venda' },
            { wpx: 100, caption: 'R$ Total' }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Prévia Balanco Rel Produtos');
        XLSX.writeFile(workbook, 'previa_balanco_relacao_produtos.xlsx');
    };

    const dados = dadosPreviaBalancoModal.map((item, index) => {

        return {
            IDPRODUTO: item.IDPRODUTO,
            NUCODBARRAS: item.NUCODBARRAS,
            DSNOME: item.DSNOME,
            QTDFINAL: item.QTDFINAL,
            QTD: item.QTD,
            QTDSOBRA: item.QTDSOBRA,
            QTDFALTA: item.QTDFALTA,
            PRECOVENDA: item.PRECOVENDA,
            TOTALVENDA: item.TOTALVENDA,
            IDRESUMOBALANCO: item.IDRESUMOBALANCO,
        }
    })
    const calcularTotal = (field) => {
        return dados.reduce((total, item) => total + parseFloat(item[field]), 0);
    };

    const calcularTotalQtdFinal = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.QTDFINAL), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.QTDFINAL), 0);
        return `${totalPorPagina}  (${totalGeral} Total)`;
    };


    const calcularTotalQtd = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.QTD), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.QTD), 0);
        return `${totalPorPagina}  (${totalGeral} Total)`;
    };
    const calcularTotalQtdSobra = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.QTDSOBRA), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.QTDSOBRA), 0);
        return `${totalPorPagina}  (${totalGeral} Total)`;
    };
    const calcularTotalQtdFalta = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.QTDFALTA), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.QTDFALTA), 0);
        return `${totalPorPagina}  (${totalGeral} Total)`;
    };
    const calcularTotalPrecoVenda = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.PRECOVENDA), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.PRECOVENDA), 0);
        return `${formatMoeda(totalPorPagina)}  (${formatMoeda(totalGeral)} Total)`;
    };
    const calcularTotalVenda = () => {
        const totalGeral = dados.reduce((total, item) => total + parseFloat(item.TOTALVENDA), 0);
        const firstIndex = page * rowsPerPage;
        const lastIndex = firstIndex + rowsPerPage;
        const dataPaginada = dados.slice(firstIndex, lastIndex)
        const totalPorPagina = dataPaginada.reduce((total, item) => total + parseFloat(item.TOTALVENDA), 0);
        return `${formatMoeda(totalPorPagina)}  (${formatMoeda(totalGeral)} Total)`;
    };


    const colunasColetor = [
        {
            field: 'IDPRODUTO',
            header: 'Produto',
            body: row => <th>{row.IDPRODUTO}</th>,
            sortable: true,
        },
        {
            field: 'NUCODBARRAS',
            header: 'Código de Barras',
            body: row => <th>{row.NUCODBARRAS}</th>,
            sortable: true,
        },
        {
            field: 'DSNOME',
            header: 'Descrição',
            body: row => <th>{row.DSNOME}</th>,
            sortable: true,
        },
        {
            field: 'QTDFINAL',
            header: 'Estoque',
            body: row => <th>{row.QTDFINAL}</th>,
            footer: calcularTotalQtdFinal(),
            sortable: true,
        },
        {
            field: 'QTD',
            header: 'Balanço',
            body: row => <th>{row.QTD}</th>,
            footer: calcularTotalQtd(),
            sortable: true,
        },
        {
            field: 'QTDSOBRA',
            header: 'Sobra',
            body: row => <th>{row.QTDSOBRA}</th>,
            footer: calcularTotalQtdSobra(),
            sortable: true,
        },
        {
            field: 'QTDFALTA',
            header: 'Falta',
            body: row => <th>{row.QTDFALTA}</th>,
            footer: calcularTotalQtdFalta(),
            sortable: true,
        },
        {
            field: 'PRECOVENDA',
            header: 'R$ Venda',
            body: row => <th>{formatMoeda(row.PRECOVENDA)}</th>,
            footer: calcularTotalPrecoVenda(),
            sortable: true,
        },
        {
            field: 'TOTALVENDA',
            header: 'R$ Total',
            body: row => <th>{formatMoeda(row.TOTALVENDA)}</th>,
            footer: calcularTotalVenda(),
            sortable: true,
        },
    ]

    return (
        <div className="panel mt-4">
            <div className="panel-hdr">
                <h2>Prévia do Balanço Diferença</h2>
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
                    value={dados}
                    globalFilter={globalFilterValue}
                    size="small"
                    sortOrder={-1}
                    paginator={true}
                    rows={10}
                    selectionMode="single"
                    selection={rowSelection}
                    onSelectionChange={(e) => setRowSelection(e.value)}
                    // rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                    showGridlines
                    stripedRows
                    emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                >
                    {colunasColetor.map(coluna => (
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
    );
}