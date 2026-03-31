import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useReactToPrint } from "react-to-print";
import { FaMinus, FaRegTrashAlt } from "react-icons/fa";
import HeaderTable from "../../../../Tables/headerTable";
import { Fragment, useRef, useState } from "react"
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import Swal from 'sweetalert2';

export const ActionListaConferirOT = ({
    dadosProdutosTabela,
    handleDiminuirProduto,
    handleExcluirProduto,
    
}) => {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Conferência OT',
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dadosProdutosTabela);
        const workbook = XLSX.utils.book_new();
        const header = ['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'QTD Expedição', 'QTD Recepção'];
        worksheet['!cols'] = [
            { wpx: 100 }, { wpx: 100 }, { wpx: 250 },
            { wpx: 100 }, { wpx: 100 }, { wpx: 100 }, { wpx: 100 }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Conferência OT');
        XLSX.writeFile(workbook, 'conferencia_ot.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'QTD Expedição', 'QTD Recepção']],
            body: dadosProdutosTabela.map(item => [
                item.IDPRODUTO,
                item.NUCODBARRAS,
                item.DSNOME,
                item.VLRUNITCUSTO,
                item.VLRUNITVENDA,
                item.QTDEXPEDICAO,
                item.QTDRECEPCAO,
            ]),
        });
        doc.save('conferencia_ot.pdf');
    };

    const confirmarExclusao = (produto) => {
        const modalElement = document.querySelector('.modal.show');
        Swal.fire({
            title: 'Atenção',
            text: 'Essa ação irá excluir o produto da O.T. Deseja prosseguir?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar',
            target: modalElement,
            customClass: { popup: 'custom-swal' }
        }).then(result => {
            if (result.isConfirmed) {
                handleExcluirProduto(produto);
            }
        });
    };

    const colunasDetalheTransferencia = [
        {
            field: 'IDPRODUTO',
            header: 'Produto',
            body: row => <span>{row.IDPRODUTO}</span>,
            sortable: true,
        },
        {
            field: 'NUCODBARRAS',
            header: 'Cód. Barras',
            body: row => <span>{row.NUCODBARRAS}</span>,
            sortable: true,
        },
        {
            field: 'DSNOME',
            header: 'Descrição',
            body: row => <span>{row.DSNOME}</span>,
            sortable: true,
        },
        {
            field: 'VLRUNITCUSTO',
            header: 'R$ Custo',
            body: row => <span>{row.VLRUNITCUSTO}</span>,
            sortable: true,
        },
        {
            field: 'VLRUNITVENDA',
            header: 'R$ Venda',
            body: row => <span>{row.VLRUNITVENDA}</span>,
            sortable: true,
        },
        {
            field: 'QTDRECEPCAO',
            header: 'QTD Recepção',
            body: row => <span>{row.QTDRECEPCAO}</span>,
            sortable: true,
        },
        {
            field: 'opcoes',
            header: 'Opções',
            body: (row) => (
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                }}>
                    {[3, 5].indexOf(row.IDSTATUSOT) >= 0 && (
                        <>
                            <ButtonTable
                                titleButton={"Diminuir Quantidade"}
                                onClickButton={() => handleDiminuirProduto(row)}
                                Icon={FaMinus}
                                iconSize={16}
                                iconColor={"#fff"}
                                cor={"warning"}
                                width="32px"
                                height="32px"
                            />
                            
                            <ButtonTable
                                titleButton={"Excluir Produto"}
                                onClickButton={() => confirmarExclusao(row)}
                                Icon={FaRegTrashAlt}
                                iconSize={16}
                                iconColor={"#fff"}
                                cor={"danger"}
                                width="32px"
                                height="32px"
                            />
                        </>
                    )}
                </div>
            )
        }
    ];

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>Lista de Ordem de Transferência</h2>
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
                        value={dadosProdutosTabela}
                        globalFilter={globalFilterValue}
                        size="small"
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        rowsPerPageOptions={[5, 10, 20, 50]}
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasDetalheTransferencia.map(coluna => (
                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}
                                body={coluna.body}
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
    );
}
