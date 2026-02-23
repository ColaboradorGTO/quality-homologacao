import { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toFloat } from "../../../../../utils/toFloat";
import HeaderTable from "../../../../Tables/headerTable";

export const ActionListaProdutos = ({dadosDetalheTransferencia }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const dataTableRef = useRef();
    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Fauramento OT',
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'Qtd Expedição', 'Qtd Recepção', 'Qtd Diferença', 'Qtd Ajuste'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'Produto' },
            { wpx: 100, caption: 'Cód. Barras' },
            { wpx: 100, caption: 'Descrição' },
            { wpx: 100, caption: 'R$ Custo' },
            { wpx: 100, caption: 'R$ Venda' },
            { wpx: 100, caption: 'Qtd Expedição' },
            { wpx: 100, caption: 'Qtd Recepção' },
            { wpx: 100, caption: 'Qtd Diferença' },
            { wpx: 100, caption: 'Qtd Ajuste' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Faturamento OT ');
        XLSX.writeFile(workbook, 'faturamento_ot.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'Qtd Expedição', 'Qtd Recepção', 'Qtd Diferença', 'Qtd Ajuste']],
            body: dados.map(item => [
                item.IDPRODUTO,
                item.NUCODBARRAS,
                item.DSNOME,
                item.VLRUNITCUSTO,
                item.VLRUNITVENDA,
                item.QTDEXPEDICAO,
                item.QTDRECEPCAO,
                item.QTDDIFERENCA,
                item.QTDAJUSTE,
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('faturamento_ot.pdf');
    };


    const dados = dadosDetalheTransferencia.map((item, index) => {
        return {
            IDPRODUTO: item.IDPRODUTO,
            NUCODBARRAS: item.NUCODBARRAS,
            DSNOME: item.DSNOME,
            VLRUNITCUSTO: item.VLRUNITCUSTO,
            VLRUNITVENDA: item.VLRUNITVENDA,
            QTDEXPEDICAO: toFloat(item.QTDEXPEDICAO),
            QTDRECEPCAO: toFloat(item.QTDRECEPCAO),
            QTDDIFERENCA: toFloat(item.QTDDIFERENCA),
            QTDAJUSTE: toFloat(item.QTDAJUSTE),

     
        }
    });

    const colunasDetalheTransferencia = [
        {
            field: 'IDPRODUTO',
            header: 'Produto',
            body: row => <th>{row.IDPRODUTO}</th>,
            sortable: true,
        },
        {
            field: 'NUCODBARRAS',
            header: 'Cód. Barras',
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
            field: 'VLRUNITCUSTO',
            header: 'R$ Custo',
            body: row => <th>{row.VLRUNITCUSTO}</th>,
            sortable: true,
        },
        {
            field: 'VLRUNITVENDA',
            header: 'R$ Venda',
            body: row => <th>{row.VLRUNITVENDA}</th>,
            sortable: true,
        },
        {
            field: 'QTDEXPEDICAO',
            header: 'Qtd Expedição',
            body: row => <th>{row.QTDEXPEDICAO}</th>,
            sortable: true,
        },
        {
            field: 'QTDRECEPCAO',
            header: 'Qtd Recepção',
            body: row => <th>{row.QTDRECEPCAO}</th>,
            sortable: true,
        },
      
        {
            field: 'QTDDIFERENCA',
            header: 'Qtd Diferença',
            body: row => <th>{row.QTDDIFERENCA}</th>,
            sortable: true,
        },
        {
            field: 'QTDAJUSTE',
            header: 'Qtd Ajuste',
            body: row => <th>{row.QTDAJUSTE}</th>,
            sortable: true,
        },
      
    ]

    return (

        <Fragment>
            <div className="panel" style={{ marginTop: "4rem" }}>
                <div className="panel-hdr">
                    <h2>
                        Lista de Produtos
                    </h2>
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
                        title="Lista de Produtos"
                        value={dados}
                        size="small"
                        globalFilter={globalFilterValue}
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        showGridlines
                        stripedRows
                        emptyMessage="Sem Registros para Exibir"
                    >
                        {colunasDetalheTransferencia.map(coluna => (
                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}

                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
                                footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                bodyStyle={{ fontSize: '1rem' }}

                            />
                        ))}
                    </DataTable>
                </div>
            </div>

        

    </Fragment >
  )
}
