import { Fragment, useRef, useState } from "react"
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { DataTable } from "primereact/datatable";
import HeaderTable from "../../../Tables/headerTable";
import { Column } from "primereact/column";
import { get } from "../../../../api/funcRequest";
import { ActionDetalheModalEmpresa } from "./ActionModalDetalheEmpresa/actionDetalheModalEmpresa";
import { SiElasticsearch } from "react-icons/si";
import { ActionEditarEmpresa } from "./ActionEditarEmpresa/actionEditarEmpresaModal";



export const ActionListaEmpresas = ({ dadosEmpresas, optionsModulos, usuarioLogado, refetch }) => {

    const [modalVisivel, setModalVisivel] = useState(false)
    const [dadosDetalhesEmpresa, setDadosDetalhesEmpresa] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState("")
    const [modalEditar, setModalEditar] = useState(false)
    const [dadosEditarEmpresa, setDadosEditarEmpresa] = useState([])
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);

    };
     

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: "Lista Empresa"
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID Empresa', 'Empresa', 'CNPJ', 'Insc, Estadual', 'CNAE', 'Status']],
            body: dados.map(item => [
                item.IDEMPRESA,
                item.NOFANTASIA,
                item.NUCNPJ,
                item.NUINSCESTADUAL,
                item.CNAE,
                item.STATIVO

            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: "immediately"
        });
        doc.save("lista_empresas.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ["ID Empresa", "Empresa", "CNPJ", "Insc, Estadual", "CNAE", "Status"];
        worksheet["!cols"] = [
            { wpx: 50, captions: "ID Empresa" },
            { wpx: 200, captions: "Empresa" },
            { wpx: 100, captions: "CNPJ" },
            { wpx: 100, captions: "Insc, Estadual" },
            { wpx: 100, captions: "CNAE" },
            { wpx: 100, captions: "Status" },
        ];

        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lista Empresas")
        XLSX.writeFile(workbook, "lista_empresas.xlsx");

    };

    const dados = Array.isArray(dadosEmpresas) ? dadosEmpresas.map((item, index) => {
        return {
            IDEMPRESA: item.IDEMPRESA,
            NOFANTASIA: item.NOFANTASIA,
            NUINSCESTADUAL: item.NUINSCESTADUAL,
            NUCNPJ: item.NUCNPJ,
            CNAE: item.CNAE,
            STATIVO: item.STATIVO == 'True' ? 'Ativo' : 'Inativo',
        };
    }) : [];
    const colunaListaEmpresas = [
        {
            field: "IDEMPRESA",
            header: "ID Empresa",
            body: row => <th>{row.IDEMPRESA}</th>,
            sortable: true,
        },
        {
            field: 'NOFANTASIA',
            header: 'Empresa ',
            body: row => <th>{row.NOFANTASIA}</th>,
            sortable: true,
        },
        {
            field: 'NUCNPJ',
            header: 'CNPJ',
            body: row => <th>{row.NUCNPJ}</th>,
            sortable: true,
        },
        {
            field: 'NUINSCESTADUAL',
            header: 'Insc. Estadual',
            body: row => <th>{row.NUINSCESTADUAL}</th>,
            sortable: true,
        },
        {
            field: 'CNAE',
            header: 'CNAE',
            body: row => <th>{row.CNAE}</th>,
            sortable: true,
        },
        {
            field: 'STATIVO',
            header: 'Status',
            body: row => <th style={{ color: row.STATIVO == 'Ativo' ? 'blue' : 'red' }}>{row.STATIVO}</th>,
            sortable: true,
        },
        {
            field: "IDEMPRESA",
            header: "Opções",
            body: row => {
                return (
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <ButtonTable
                            titleButton={"Editar"}
                            onClickButton={() => handleClickEditar(row)}
                            Icon={CiEdit}
                            iconSize={18}
                            width="30px"
                            height="30px"
                            iconColor={"#fff"}
                            cor={"info"}
                        />

                        <ButtonTable
                            titleButton={"Detalhar"}
                            onClickButton={() => handleClickDetalhar(row)}
                            Icon={GrView}
                            iconSize={18}
                            width="30px"
                            height="30px"
                            iconColor={"#fff"}
                            cor={"primary"}
                        />
                    </div>
                )
            }
        }
    ]
       
    const handleDetalhar = async (IDEMPRESA) => {
        try {
            const response = await get(`/empresas?idEmpresa=${IDEMPRESA}`);
            if (response.data && response.data.length > 0) {
                setDadosDetalhesEmpresa(response.data)
                setModalVisivel(true)

            }
        } catch (error) {
            console.error("Erro ao buscar detalhes da empresa:", error);
        }

    }
       

    const handleClickDetalhar = (row) => {
        if (optionsModulos[0].ALTERAR == "True") {
            if (row && row.IDEMPRESA) {
                handleDetalhar(row.IDEMPRESA);
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Atenção!',
                text: 'Você não tem permissão para acessara tela.',
                confirmButtonColor: '#7352A5',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
        }
    };

    const handleEditar = async (IDEMPRESA) => {
        try {
            const response = await get(`/empresas?idEmpresa=${IDEMPRESA}`);
            if (response.data && response.data.length > 0) {

                setDadosEditarEmpresa(response.data);
                setModalEditar(true)
            }
        } catch (error) {
            console.error("erro ao buscar detahes da empresa:", error);
        }
    };
   
    const handleClickEditar = (row) => {
        if (optionsModulos[0]?.ALTERAR == 'True') {
            if (row && row.IDEMPRESA) {
                handleEditar(row.IDEMPRESA);
            }
        } else {
            Swal.fire({
                icon: "error",
                title: "Atenção",
                text: "Você não tem permissão para acessar a tela.",
                confirmButtonColor: "#7352a5",
                timer: 3000,
                customClass: {
                    container: "custom-swal",
                }

            })
        }
    }

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>Lista de Empresas</h2>
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
                        title="Lista de Empresas"
                        value={dados}
                        globalFilter={globalFilterValue}
                        size={"small"}
                        sortOrder={-1}
                        paginator
                        rows={10}
                        rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunaListaEmpresas.map(coluna => (
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

            <ActionDetalheModalEmpresa
                show={modalVisivel}
                handleClose={() => setModalVisivel(false)}
                dadosDetalhesEmpresa={dadosDetalhesEmpresa}
            />

            <ActionEditarEmpresa
                show={modalEditar}
                handleClose={() => setModalEditar(false)}
                dadosEditarEmpresa={dadosEditarEmpresa}
                refetch={refetch}
                usuarioLogado={usuarioLogado}
            />
        </Fragment>
    )
}
