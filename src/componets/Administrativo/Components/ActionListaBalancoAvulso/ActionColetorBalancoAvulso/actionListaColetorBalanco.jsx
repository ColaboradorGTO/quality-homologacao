import React, { Fragment, useState } from "react";
import { GrFormView } from "react-icons/gr";
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useRef } from "react";

export const ActionListaColetorBalanco = ({ dadosColetorBalanco }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Coletor Resumo Balanço',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Coletor', 'Qtd Itens', 'Total Custo', 'Total Venda']],
            body: dadosColetorModal.map(item => [

                item.DSCOLETOR,
                parseFloat(item.NUMEROCOLETOR),
                item.IDEMPRESA,
                item.NUMITENS,
                item.TOTALCUSTO,
                item.TOTALVENDA,
                item.IDRESUMOBALANCO,
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('coletor_balanco.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dadosColetorModal);
        const workbook = XLSX.utils.book_new();
        const header = ['Coletor', 'Qtd Itens', 'Total Custo', 'Total Venda'];
        worksheet['!cols'] = [
            { wpx: 150, caption: 'Nº' },
            { wpx: 50, caption: 'Qtd Itens' },
            { wpx: 100, caption: 'Total Custo' },
            { wpx: 100, caption: 'Total Venda' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Coletor Resumo Balanço');
        XLSX.writeFile(workbook, 'coletor_balanco.xlsx');
    };


    const dadosColetorModal = dadosColetorBalanco.map((item) => {


        return {
            DSCOLETOR: item.DSCOLETOR,
            NUMEROCOLETOR: parseFloat(item.NUMEROCOLETOR),
            IDEMPRESA: item.IDEMPRESA,
            NUMITENS: item.NUMITENS,
            TOTALCUSTO: item.TOTALCUSTO,
            TOTALVENDA: item.TOTALVENDA,
            IDRESUMOBALANCO: item.IDRESUMOBALANCO,
            STCONSOLIDADO: item.STCONSOLIDADO,
        }
    });

    const colunasColetorModal = [

        {
            field: 'DSCOLETOR',
            header: 'Coletor',
            body: row => {
                if (row.DSCOLETOR != '') {
                    return (
                        <th style={{ fontSize: '18px' }}>{row.NUMEROCOLETOR} - {row.DSCOLETOR}</th>
                    )
                } else {
                    return (
                        <th style={{ fontSize: '18px' }}>{row.NUMEROCOLETOR}</th>
                    )
                }
            },

            sortable: true,
        },
        {
            field: 'NUMITENS',
            header: 'QTD Itens',
            body: row => <th style={{ fontSize: '18px' }}>{row.NUMITENS}</th>,
            sortable: true,
        },
        {
            field: 'TOTALCUSTO',
            header: 'Total Custo',
            body: row => <th style={{ fontSize: '18px' }}>{formatMoeda(row.TOTALCUSTO)}</th>,
            sortable: true,
        },
        {
            field: 'TOTALVENDA',
            header: 'Total Venda',
            body: row => <th style={{ fontSize: '18px' }}>{formatMoeda(row.TOTALVENDA)}</th>,
            sortable: true,
        },

        {
            field: 'IDRESUMOBALANCO',
            header: 'Opções',
            body: row => (
                <div className="p-1 "
                    style={{ justifyContent: "space-between", display: "flex" }}
                >

                    <div className="p-1">
                        <ButtonTable
                            titleButton={"Detalhar Balanço"}
                            cor={"success"}
                            Icon={GrFormView}
                            iconSize={22}
                            onClickButton={() => handleClickResumoBalanco(row)}
                        />
                    </div>

                </div>
            ),
            sortable: true,
        },
    ]

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>
                        Resumo do Balanço
                    </h2>

                </div>
                <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
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
                        value={dadosColetorModal}
                        globalFilter={globalFilterValue}
                        size="small"
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        // rowsPerPageOptions={[10, 20, 50, dadosColetorModal.length]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasColetorModal.map(coluna => (
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