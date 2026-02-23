import React, { Fragment, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import HeaderTable from "../../../../../../Tables/headerTable";
import { ButtonTable } from "../../../../../../ButtonsTabela/ButtonTable";
import { FaPencilAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { get } from "../../../../../../../api/funcRequest";
import { FaBinoculars, FaPaperclip, FaPlus, FaRegEye } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { useCancelarArquivoAlvara } from "../../../hooks/actionCancelarArquivoAlvara";
import { useEditarArquivoAlvara } from "../../../hooks/actionEditarArquivoAlvara";
import { useCriarArquivoAlvara } from "../../../hooks/actionCriarArquivoAlvara";
import { converterArquivosParaBase64 } from "../../../../../../../utils/converterFileBase64";
//import { ActionCadastrarAlvaraModal } from "./ActionCadastrarAlvaraModal/ActionCadastrarAlvaraModal";
//import { ActionVisualizarDetalhesAlvaraModal } from "./ActionVisualizarAlvaraModal/actionVisualizarDetalhesAlvaraModal";

export const ActionEditarListaArquivosAnexados = ({ dadosAlvaraSelecionado, optionsModulos, usuarioLogado, refetchAlvaraEmpresa, handleClose }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [rowSelection, setRowSelection] = useState(null);
    const [modalCadastrarAlvaraEmpresa, setModalCadastrarAlvaraEmpresa] = useState(false);
    const [modalVisualizarAlvaraEmpresa, setModalVisualizarAlvaraEmpresa] = useState(false);

    const [rowEditando, setRowEditando] = useState(null);
    const [modoArquivo, setModoArquivo] = useState(null);

    const fileInputRef = useRef(null);
    const dataTableRef = useRef();

    const {
        onSubmit
    } = useCancelarArquivoAlvara({ usuarioLogado, refetchAlvaraEmpresa, optionsModulos, dadosAlvaraSelecionado, refetchAlvaraEmpresa });

    const {

        onEditarArquivo,
    } = useEditarArquivoAlvara({ usuarioLogado, refetchAlvaraEmpresa, optionsModulos, dadosAlvaraSelecionado, refetchAlvaraEmpresa });

    const {

        onCriarArquivo
    } = useCriarArquivoAlvara({ usuarioLogado, refetchAlvaraEmpresa, optionsModulos, dadosAlvaraSelecionado, refetchAlvaraEmpresa });

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
                "Dt.Inicio",
                "Dt.Fim",
                "Status",
            ]],
            body: (dados || []).map((item) => [
                item?.IDEMPRESA,
                item?.DTINICIOCOMPETENCIAALVARA,
                item?.DTFIMCOMPETENCIAALVARA,
                item?.STATIVO,
            ]),
            horizontalPageBreak: true,
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
            "Dt.Inicio",
            "Dt.Fim",
            "Status",
        ];

        const data = (dados || []).map(item => [
            item?.IDEMPRESA,
            item?.DTINICIOCOMPETENCIAALVARA,
            item?.DTFIMCOMPETENCIAALVARA,
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

    const dados = dadosAlvaraSelecionado
        ?.flatMap((item) =>
            item?.ARQUIVOSALVARAS?.map((arquivo) => ({
                IDVINCULO: item?.IDVINCULO,
                IDEMPRESA: item?.IDEMPRESA,
                IDSTATUS: item?.IDSTATUS,
                NOMEARQUIVOALVARA: arquivo?.NOMEARQUIVOALVARA,
                TIPOARQUIVOALVARA: arquivo?.TIPOARQUIVOALVARA,
                DTHORACRIACAO: arquivo?.DTHORACRIACAO,
                STATIVO: arquivo?.STATIVO === "True" ? "Ativo" : "Inativo",
                IDARQUIVOSALVARA: arquivo?.IDARQUIVOSALVARA

            })) || []
        )
        ?.map((item, index) => ({
            ...item,
            CONTADOR: index + 1
        }));

    console.log(dadosAlvaraSelecionado, "dadosAlvaraSelecionado action")
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
                    <ButtonTable
                        titleButton="Editar Alvará da Loja"
                        cor="warning"
                        Icon={FaPencilAlt}
                        onClickButton={() => handleClickEditarAlvara(row)}
                        iconSize={18}
                        width="35px"
                        height="35px"
                        lineHeight={1.3}
                    />
                    <ButtonTable
                        titleButton="Cancelar Arquivo"
                        cor="danger"
                        Icon={BsTrash3}
                        onClickButton={() => handleClickCancelarAlvara(row)}
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



    const handleVisualizarArquivo = (row) => {
        //const url = `/visualizar-anexo-alvara?idArquivoAlvara=${row.IDARQUIVOSALVARA}`;
        const url = `http://164.152.245.77:8000/quality/concentrador_homologacao/api/contabilidade/arquivos-anexos-alvaras-empresa.xsjs?id=${row.IDARQUIVOSALVARA}`;

        window.open(url, "_blank");
    };

    /*    const handleClickEditarAlvara = (row) => {
           if (fileInputRef.current) {
               fileInputRef.current.click();
           }
   
       }; */


    const handleClickCriarAlvara = () => {
        setModoArquivo('criar');
        fileInputRef.current?.click();
    };
    const handleClickEditarAlvara = (row) => {
        setRowEditando(row);
        setModoArquivo('editar');
        fileInputRef.current?.click();
    };


const handleFileChange = async (event) => {
    const filesList = event.target.files;
    if (!filesList?.length) return;

   
    const arquivosConvertidos = await converterArquivosParaBase64(filesList);

    if (!arquivosConvertidos?.length) return;

    if (modoArquivo === 'editar' && rowEditando) {
        await onEditarArquivo(rowEditando, arquivosConvertidos);
    }

    if (modoArquivo === 'criar') {
        const idVinculo = dadosAlvaraSelecionado?.[0]?.IDVINCULO;
        await onCriarArquivo(idVinculo, arquivosConvertidos);
    }

    event.target.value = null;
    setRowEditando(null);
    setModoArquivo(null);
};
    /* const handleFileChange = async (event) => {
        const arquivosConvertidos = await handleSelecionarArquivos(event);

        if (!arquivosConvertidos?.length) return;

        if (modoArquivo === 'editar' && rowEditando) {
            await onEditarArquivo(rowEditando, arquivosConvertidos);
        }

        if (modoArquivo === 'criar') {
            const idVinculo = dadosAlvaraSelecionado?.[0]?.IDVINCULO;
            await onCriarArquivo(idVinculo, arquivosConvertidos);
        }

        event.target.value = null;
        setRowEditando(null);
        setModoArquivo(null);
    }; */



    /* 
        const handleFileChange = (event) => {
             if (!rowSelecionadaEditar) return;
            const file = event.target.files[0];
    
            if (!file) return;
    
            console.log("Arquivo selecionado:", file);
            handleSelecionarArquivos(event);
            // - mandar para API
            // - atualizar estado
            // - abrir modal
        }; */

    const handleClickVisualizarAlvara = (row) => {
        if (optionsModulos[0]?.ALTERAR === 'True') {
            if (row && row.IDVINCULO) {
                handleViualizarAlvara(row.IDVINCULO);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para editar alvará.',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    const handleViualizarAlvara = async (IDVINCULO) => {
        try {
            const response = await get(`/vinculo-alvaras-empresa?idFilial=${IDVINCULO}`);
            if (response.data && response.data.length > 0) {
                setDadosAlvaraSelecionado(response.data);
                setModalVisualizarAlvaraEmpresa(true);
            }
        } catch (error) {
            console.error('Erro ao buscar dados Alvaras: ', error);
        }
    };

    const handleClickCadastrarAlvara = () => {
        if (optionsModulos[0]?.ALTERAR === 'True') {
            setModalCadastrarAlvaraEmpresa(true);
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para cadastrar alvará.',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    const handleClickCancelarAlvara = async (row) => {
        if (optionsModulos[0]?.ALTERAR === 'True') {
            if (row) {
                await onSubmit(row);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para  alvará.',
                confirmButtonColor: '#7352A5',
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr mb-4">

                    <h3>LISTA DE ARQUIVOS ANEXADOS DO ALVARÁ</h3>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <HeaderTable
                        globalFilterValue={globalFilterValue}
                        onGlobalFilterChange={onGlobalFilterChange}
                        handlePrint={handlePrint}
                        exportToExcel={exportToExcel}
                        exportToPDF={exportToPDF}
                    />


                </div>
                <div style={{ marginTop: "1rem", marginLeft: "0.8rem", marginBottom: "1rem" }}>
                    <ButtonTable
                        titleButton="Anexar Arquivo"
                        className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2"
                        Icon={FaPaperclip}
                        textButton="Anexar Arquivo"
                        onClickButton={handleClickCriarAlvara}
                        iconSize={18}
                        width="120px"
                        height="37px"
                        flexDirection="row"
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
            <input
                type="file"
                accept="application/pdf"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
            />

            {/* <ActionCadastrarAlvaraModal
                show={modalCadastrarAlvaraEmpresa}
                handleClose={() => setModalCadastrarAlvaraEmpresa(false)}
                dadosAlvaraEmpresa={dadosAlvaraEmpresaSelecionada}
            />
 */}
            {/*    <ActionVisualizarDetalhesAlvaraModal
                show={modalVisualizarAlvaraEmpresa}
                handleClose={() => setModalVisualizarAlvaraEmpresa(false)}
                dadosAlvaraSelecionado={dadosAlvaraSelecionado}
            /> */}
        </Fragment>
    )
}