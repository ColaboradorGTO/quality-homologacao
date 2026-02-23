import { Fragment, useRef, useState } from "react"
import { FaRegTrashAlt } from "react-icons/fa";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ButtonTable } from "../../../../../ButtonsTabela/ButtonTable";
import HeaderTable from "../../../../../Tables/headerTable";


export const ActionListaEmpresaPromocao = ({ dadosListaPromocaoEmpresa }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Lista Empresas Promoções',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Nº', 'Empresa', 'Situação']],
            body: dados.map(item => [
                item.contador,
                item.NOEMPPROMO,
                item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('lsita_empresas_promocoes.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Nº', 'Empresa', 'Situação'];
        worksheet['!cols'] = [
            { wpx: 70, caption: 'Nº' },
            { wpx: 200, caption: 'Empresa' },
            { wpx: 100, caption: 'Situação' },
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista Empresas Promoções');
        XLSX.writeFile(workbook, 'lista_empresas_promocoes.xlsx');
    };

    const dadosPromocaoEmpresa = dadosListaPromocaoEmpresa.map((item, index) => {
        let contador = index + 1;


        return {
            contador,
            NOEMPPROMO: item.NOEMPPROMO,
            STATIVO: item.STATIVO == 'True' ? 'ATIVO' : 'INATIVO',
            IDEMPRESAPROMOCAOMARKETING: item.IDEMPRESAPROMOCAOMARKETING,
            IDRESUMOPROMOCAOMARKETING: item.IDRESUMOPROMOCAOMARKETING,

            IDEMPRESA: item.IDEMPRESA,
        }
    });

    const colunasPromocaoEmpresa = [
        {
            field: 'contador',
            header: '#',
            body: row => <th>{row.contador}</th>,
            sortable: true,
            width: '10%'
        },
        {
            field: 'NOEMPPROMO',
            header: 'Empresa',
            body: row => <th>{row.NOEMPPROMO}</th>,
            sortable: true,

        },
        {
            field: 'STATIVO',
            header: 'Situação',
            body: (row) => (
                <th style={{ color: row.SATIVO == 'ATIVO' ? 'red' : 'blue' }}>

                    {row.STATIVO}
                </th>
            )
        },
        {
            header: 'Opções',
            button: true,
            body: (row) => (
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div className="p-1">
                        <ButtonTable
                            titleButton={"Excluir Empresas da Promoção"}
                            onClickButton
                            Icon={FaRegTrashAlt}
                            iconSize={18}
                            iconColor={"#fff"}
                            cor={"danger"}
                        />

                    </div>


                </div>

            ),
        },

    ]

    return (

        <Fragment>

            <div className="panel" >
                <div className="panel-hdr">
                    <h2>Lista das Empresas Promoções </h2>
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
                <div className="card mb-4" ref={dataTableRef}>

                    <DataTable
                        title="Lista das Empresas Promoções"
                        value={dadosPromocaoEmpresa}
                        size="small"
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        rowsPerPageOptions={[10, 20, 50, 100, dadosPromocaoEmpresa.length]}
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                    >
                        {colunasPromocaoEmpresa.map(coluna => (
                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}

                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                                footerStyle={{ color: '#212529', backgroundColor: "#e9e9e9", border: '1px solid #ccc', fontSize: '0.8rem' }}
                                bodyStyle={{ fontSize: '1rem' }}

                            />
                        ))}
                    </DataTable>
                </div>
            </div>
        </Fragment>
    )
}
