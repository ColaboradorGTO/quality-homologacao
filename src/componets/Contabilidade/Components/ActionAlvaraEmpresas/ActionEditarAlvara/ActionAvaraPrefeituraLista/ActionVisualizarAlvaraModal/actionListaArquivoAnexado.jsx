import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../../../Tables/headerTable";
import { ButtonTable } from "../../../../../../ButtonsTabela/ButtonTable";
import { FaRegEye } from "react-icons/fa6";
import axiosInstance from "../../../../../../../api/api";

export const ActionListaArquivosAnexados = ({
    dadosAlvaraSelecionado,
}) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [rowSelection, setRowSelection] = useState(null);
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Lista de Alvaras',
    });

    const exportToPDF = () => {
        const doc = new jsPDF({ orientation: "landscape" });

        doc.autoTable({
            head: [[
                "#",
                "Nome",
                "Dt.Tipo",
                "Dt.Inclusão",
                "Status",
            ]],
            body: (dados || []).map((item) => [
                item?.CONTADOR,
                item?.NOMEARQUIVOALVARA,
                item?.TIPOARQUIVOALVARA,
                item?.DTHORACRIACAO,
                item?.STATIVO,
            ]),
            horizontalPageBreak: false,
            horizontalPageBreakBehaviour: "immediately",
            styles: { fontSize: 8 },
            headStyles: { fontSize: 8 },
        });

        doc.save("alvaras_empresas.pdf");
    };

    const exportToExcel = () => {
        const workbook = XLSX.utils.book_new();

        const header = [
            "#",
            "Nome",
            "Dt.Tipo",
            "Dt.Inclusão",
            "Status",
        ];

        const data = (dados || []).map(item => [
            item?.CONTADOR,
            item?.NOMEARQUIVOALVARA,
            item?.TIPOARQUIVOALVARA,
            item?.DTHORACRIACAO,
            item?.STATIVO,
        ]);

        const worksheet = XLSX.utils.aoa_to_sheet([header, ...data]);

        worksheet["!cols"] = [
            { wpx: 80 },
            { wpx: 220 },
            { wpx: 150 },
            { wpx: 120 },
        ];

        XLSX.utils.book_append_sheet(workbook, worksheet, "Alvarás Empresas");
        XLSX.writeFile(workbook, "alvaras_empresas.xlsx");
    };

    const getExtensao = (mime) => {
        if (!mime || !mime.includes("/")) return "";
        return mime.split("/")[1].toUpperCase();
    };

    const dados = dadosAlvaraSelecionado?.flatMap((item) =>
        item?.ARQUIVOSALVARAS?.map((arquivo) => ({
            IDVINCULO: item?.IDVINCULO,
            IDEMPRESA: item?.IDEMPRESA,
            IDARQUIVOSALVARA: arquivo?.IDARQUIVOSALVARA,
            NOMEARQUIVOALVARA: arquivo?.NOMEARQUIVOALVARA,
            TIPOARQUIVOALVARA: arquivo?.TIPOARQUIVOALVARA,
            DTHORACRIACAO: arquivo?.DTHORACRIACAO,
            STATIVO: arquivo?.STATIVO === "True" ? "Ativo" : "Inativo",
        })) || []
    )
        ?.map((item, index) => ({
            ...item,
            CONTADOR: index + 1,
        })) || [];

    const colunasEmpresasAlvaras = [
        {
            field: 'CONTADOR',
            header: '#',
            body: row => <th> {row.CONTADOR} </th>,
            sortable: true,
        },
        {
            field: 'NOMEARQUIVOALVARA',
            header: 'Nome',
            body: row => <th> {row.NOMEARQUIVOALVARA} </th>,
            sortable: true,
        },
        {
            field: 'TIPOARQUIVOALVARA',
            header: 'Dt.Tipo',
            body: row => <th> {getExtensao(row.TIPOARQUIVOALVARA)} </th>,
            sortable: true,
        },
        {
            field: 'DTHORACRIACAO',
            header: 'Dt.Inclusão',
            body: row => <th> {row.DTHORACRIACAO} </th>,
            sortable: true,
        },
        {
            field: 'STATIVO',
            header: 'Status',
            body: row =>
            (
                <span
                    className={` badge text-white ${row.STATIVO === 'Ativo'
                        ? 'bg-success'
                        : 'bg-warning'
                        }`}
                    style={{ borderRadius: '5px' }}
                >
                    {row.STATIVO}
                </span>
            ),
            sortable: true,
        },
        {
            field: 'ARQUIVOALVARA',
            header: 'Opções',
            body: (row) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <ButtonTable
                        titleButton="Visualizar Arquivo"
                        cor="info"
                        Icon={FaRegEye}
                        onClickButton={() => handleVisualizarArquivo(row)}
                        iconSize={18}
                        width="35px"
                        height="35px"
                        lineHeight={1.3}
                    />
                </div>
            ),
            sortable: true,
        }
    ]

    const handleVisualizarArquivo = async (row) => {
        const baseURL = axiosInstance.defaults.baseURL;
        try {
            const url = `${baseURL}/visualizar-anexo-alvara?idArquivoAlvara=${row.IDARQUIVOSALVARA}`;
            window.open(url, "_blank");
        }
        catch (error) {
            console.error("Erro ao visualizar arquivo:", error);
        }
    };

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr mb-4">

                    <h3>LISTA DE ARQUIVOS ANEXADOS DO ALVARÁ</h3>

                </div>
                <div style={{ marginBottom: "2rem" }}>
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
                        value={dados}
                        size="small"
                        globalFilter={globalFilterValue}
                        sortOrder={-1}
                        paginator={true}
                        rows={10}
                        selectionMode="single"
                        selection={rowSelection}
                        onSelectionChange={(e) => setRowSelection(e.value)}
                        rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunasEmpresasAlvaras.map(coluna => (

                            <Column
                                key={coluna.field}
                                field={coluna.field}
                                header={coluna.header}
                                body={coluna.body}
                                footer={coluna.footer}
                                sortable={coluna.sortable}
                                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '1rem' }}
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