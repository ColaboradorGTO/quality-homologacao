import { Fragment, useRef, useState } from "react";
import HeaderTable from "../../../../Tables/headerTable";
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import { BsTrash3 } from "react-icons/bs";
import { FaCheck, FaMinus } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { useForm } from "react-hook-form";
import { useUpdateQTDProduto } from "./hooks/useUpdateQtdProduto";
import { ColumnGroup } from "primereact/columngroup";
import { toFloat } from "../../../../../utils/toFloat";
import { Row } from "primereact/row";

export const ActionListaDetalhe = ({
    dadosDetalhesBalanco,
    setTabelaDetalhe,
    setTabelaResumo,
    optionsModulos,
    usuarioLogado,
    handleClickResumoBalanco
}) => {
    const { register, handleSubmit, errors } = useForm();
    const [globalFilterValueDetalhe, setGlobalFilterValueDetalhe] = useState('');
    const [quantidade, setQuantidade] = useState(0)
    const [rowSelection, setRowSelection] = useState(null);
    const dataTableRef = useRef();
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);

    const {
        onSubmit,
        onSubmitExcluir
    } = useUpdateQTDProduto({ optionsModulos, usuarioLogado });
    const onGlobalFilterChangeDetalhe = (e) => {
        setGlobalFilterValueDetalhe(e.target.value);
    };

    const handlePrintDetalhe = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Detalhe Resumo Balanço',
    });

    const exportToPDFDetalhe = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Detalhe', 'Código', 'Produto', 'Cod. Barras', 'Qtd Itens']],
            body: dadosDetalhe.map(item => [
                item.IDDETALHEBALANCO,
                item.IDPRODUTO,
                item.DSNOME,
                item.NUCODBARRAS,
                item.TOTALCONTAGEMGERAL,

            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('coletor_balanco.pdf');
    };

    const exportToExcelDetalhe = () => {
        const worksheet = XLSX.utils.json_to_sheet(dadosDetalhe);
        const workbook = XLSX.utils.book_new();
        const header = ['ID Detalhe', 'Código', 'Produto', 'Cod. Barras', 'Qtd Itens'];
        worksheet['!cols'] = [
            { wpx: 150, caption: 'ID Detalhe' },
            { wpx: 100, caption: 'Código' },
            { wpx: 200, caption: 'Produto' },
            { wpx: 100, caption: 'Cod. Barras' },
            { wpx: 100, caption: 'Qtd Itens' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Detalhe Resumo Balanço');
        XLSX.writeFile(workbook, 'detalhe_balanco.xlsx');
    };

    const calcularTotalPagina = (field) => {
        return dadosDetalhe.reduce((total, item) => total + parseFloat(item[field]), 0);
    };

    const calcularTotal = (field) => {
        const firstIndex = first;
        const lastIndex = first + rows;

        const dataPaginada = dadosDetalhe.slice(firstIndex, lastIndex);

        return dataPaginada.reduce(
            (total, item) => total + toFloat(item[field] || 0),
            0
        );
    };

    const cacularTotalQtdItens = () => {
        const totalQtdPagina = calcularTotal('TOTALCONTAGEMGERAL');
        const total = calcularTotalPagina('TOTALCONTAGEMGERAL');
        return `${totalQtdPagina}   (${total} Total)`;
    };

    const onPageChange = (event) => {
        setFirst(event.first);
        setRows(event.rows);
    }

    const dadosDetalhe = dadosDetalhesBalanco.map((item) => {


        return {
            IDDETALHEBALANCO: item.IDDETALHEBALANCO,
            IDPRODUTO: item.IDPRODUTO,
            DSNOME: item.DSNOME,
            NUCODBARRAS: item.NUCODBARRAS,
            TOTALCONTAGEMGERAL: item.TOTALCONTAGEMGERAL,
            STCONSOLIDADO: item.STCONSOLIDADO,
            IDRESUMOBALANCO: item.IDRESUMOBALANCO,
            NUMEROCOLETOR: item.NUMEROCOLETOR,
        }
    });

    const handleQuantidadeChange = (id, value) => {
        setQuantidade(prev => ({
            ...prev,
            [id]: value
        }))
    }
    const colunasDetalhe = [
        {
            field: 'IDDETALHEBALANCO',
            header: 'ID Detalhe',
            body: row => <th style={{ fontSize: '18px' }}>{row.IDDETALHEBALANCO}</th>,
            sortable: true,
        },
        {
            field: 'IDPRODUTO',
            header: 'Código',
            body: row => <th style={{ fontSize: '18px' }}>{row.IDPRODUTO}</th>,
            sortable: true,
        },
        {
            field: 'DSNOME',
            header: 'Produto',
            body: row => <th style={{ fontSize: '18px' }}>{row.DSNOME}</th>,
            sortable: true,
        },
        {
            field: 'NUCODBARRAS',
            header: 'Código de Barras',
            body: row => <th style={{ fontSize: '18px' }}>{row.NUCODBARRAS}</th>,
            sortable: true,
        },
        {
            field: 'TOTALCONTAGEMGERAL',
            header: 'QTD Itens',
            body: row => (
                <div className=""
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignContent: 'center',

                    }}>

                    <input
                        type="number"
                        style={{ width: '3rem', color: 'green', fontSize: '16px' }}
                        min={0}
                        value={quantidade[row.IDDETALHEBALANCO] ?? row.TOTALCONTAGEMGERAL}
                        onChange={(e) => handleQuantidadeChange(row.IDDETALHEBALANCO, e.target.value)}
                    />
                </div>
            ),
            sortable: true,
        },

        {
            field: 'IDRESUMOBALANCO',
            header: 'Opções',
            body: row => {
                if (row.STCONSOLIDADO != 'True') {
                    const itemQuantidade = quantidade
                    return (
                        <div className=""
                            style={{ justifyContent: "space-between", display: "flex" }}
                        >

                            <div >
                                <ButtonTable
                                    titleButton={"Alterar Quantidade"}
                                    cor={"success"}
                                    Icon={FaCheck}
                                    iconSize={22}
                                    width="30px"
                                    height="30px"
                                    onClickButton={() => {
                                        const value = quantidade[row.IDDETALHEBALANCO] ?? row.TOTALCONTAGEMGERAL;
                                        onSubmit(row.IDDETALHEBALANCO, value)

                                    }}
                                />
                            </div>
                            {parseInt(row.NUMEROCOLETOR) != 100 && (

                                <div >
                                    <ButtonTable
                                        titleButton={"Excluir quantidade"}
                                        cor={"danger"}
                                        Icon={BsTrash3}
                                        iconSize={22}
                                        width="30px"
                                        height="30px"
                                        onClickButton={() => {
                                            onSubmitExcluir(row.IDDETALHEBALANCO, 0);
                                            handleClickResumoBalanco(row);
                                            setQuantidade(prev => ({
                                                ...prev,
                                                [row.IDDETALHEBALANCO]: 0
                                            }));
                                        }}
                                    />
                                </div>
                            )}

                        </div>

                    )

                }
            },
            sortable: true,
        },
    ]


    const footerGroup = (
        <ColumnGroup>

            <Row>

                <Column footer={''} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
                <Column footer={''} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
                <Column footer={''} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
                <Column footer={''} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
                <Column footer={cacularTotalQtdItens()} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />
                <Column footer={''} footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '1rem' }} />

            </Row>
        </ColumnGroup>
    )


    return (
        <Fragment>
            <form onSubmit={''}>
                <div className="panel mt-4">

                    <div style={{ marginTop: "2rem", marginBottom: "1rem" }}>
                        <HeaderTable
                            globalFilterValue={globalFilterValueDetalhe}
                            onGlobalFilterChange={onGlobalFilterChangeDetalhe}
                            handlePrint={handlePrintDetalhe}
                            exportToExcel={exportToExcelDetalhe}
                            exportToPDF={exportToPDFDetalhe}
                        />

                    </div>
                    <div className="card" ref={dataTableRef}>
                        <DataTable
                            title="Vendas por Loja"
                            value={dadosDetalhe}
                            globalFilter={globalFilterValueDetalhe}
                            size="small"
                            sortOrder={-1}
                            paginator={true}
                            //rows={10}
                            selectionMode="single"
                            onPage={onPageChange}
                            first={first}
                            rows={rows}
                            totalRecords={dadosDetalhe.length}
                            footerColumnGroup={footerGroup}
                            selection={rowSelection}
                            onSelectionChange={(e) => setRowSelection(e.value)}
                            rowsPerPageOptions={[10, 20, 50, 100, dadosDetalhe.length]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                            filterDisplay="menu"
                            showGridlines
                            stripedRows
                            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                        >
                            {colunasDetalhe.map(coluna => (
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
            </form>
        </Fragment>
    )
}