import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import Swal from "sweetalert2";
import { CiEdit } from "react-icons/ci";
import { GrView } from "react-icons/gr";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useReactToPrint } from "react-to-print";
import { Fragment, useRef, useState } from "react"
import { get } from "../../../../api/funcRequest";
import HeaderTable from "../../../Tables/headerTable";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { ActionEditarMenuFilho } from './ActionAtualizarMenuFilho/actionEditarMenuFilho';

export const ActionListaMenuFilho = ({
    dadosEmpresas,
    optionsModulos,
    usuarioLogado,
    dadosMenuFilho,
    refetchMenuFilho,
    dadosMenuPai
}) => {

    const [modalVisivel, setModalVisivel] = useState(false)
    const [dadosDetalhesEmpresa, setDadosDetalhesEmpresa] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState("")
    const [modalEditar, setModalEditar] = useState(false)
    const [dadosEditarEmpresa, setDadosEditarEmpresa] = useState([])
    const [dadosDetalhesMenuFilho, setDadosDetalhesMenuFilho] = useState([])
    const [modalEditarMenuFilho, setModalEditarMenuFilho] = useState(false)
    const [rowSelected, setRowSelected] = useState(null);
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: "Menus Filhos"
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['ID', 'Nome Menu', 'ID Menu Pai', 'URL']],
            body: dados.map(item => [
                item.ID,
                item.DSNOME,
                item.IDMENUPAI,
                item.URL,
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: "immediately"
        });
        doc.save("lista_menu_filho.pdf");
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ["ID", "Nome Menu", "ID Menu Pai", "URL"];
        worksheet["!cols"] = [
            { wpx: 50, captions: "ID" },
            { wpx: 200, captions: "Nome Menu" },
            { wpx: 100, captions: "ID Menu Pai" },
            { wpx: 100, captions: "URL" },
        ];

        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
        XLSX.utils.book_append_sheet(workbook, worksheet, "Lista Menus Filhos")
        XLSX.writeFile(workbook, "lista_menu_filho.xlsx");
    };

    const dados = dadosMenuFilho.map((item, index) => {
        return {
            ID: item.ID,
            DSNOME: item.DSNOME,
            IDMENUPAI: item.IDMENUPAI,
            URL: item.URL,
        };
    });

    const colunaListaMenuFilho = [
        {
            field: "ID",
            header: "ID",
            body: row => <th>{row.ID}</th>,
            sortable: true,
        },
        {
            field: 'DSNOME',
            header: 'Nome Menu',
            body: row => <th>{row.DSNOME}</th>,
            sortable: true,
        },
        {
            field: 'IDMENUPAI',
            header: 'ID Menu Pai',
            body: row => <th>{row.IDMENUPAI}</th>,
            sortable: true,
        },
        {
            field: 'URL',
            header: 'URL',
            body: row => <th>{row.URL}</th>,
            sortable: true,
        },
        {
            filed: 'Opçoes',
            header: 'Opções',
            body: row =>
                <div>
                    <ButtonTable
                        titleButton={"Editar"}
                        onClickButton={() => handleClickEdit(row)}
                        Icon={CiEdit}
                        iconSize={30}
                        iconColor={"#fff"}
                        cor={"primary"}
                        width="35px"
                        height="35px"
                        disabledBTN={optionsModulos[0]?.ALTERAR == 'True' ? false : true}
                    />
                </div>
        }
    ]


    const handleEdit = async (ID) => {
        try {
            const response = await get(`/listaMenusFilhos?idMenuFilho=${ID}`)
            if (response.data && response.data.length > 0) {
                setDadosDetalhesMenuFilho(response.data)
                setModalEditarMenuFilho(true);
            } else {
                Swal.fire({
                    title: 'Erro',
                    text: 'Dados do Menu não encontrado.',
                    icon: 'error',
                    timer: 3000,
                    customClass: {
                        container: 'custom-swal',
                    }
                })
                return;
            }
        } catch (error) {
            console.error('Erro ao Buscar Lista de Menus Filhos: ', error);
        }
    };

    const handleClickEdit = (row) => {
        if (optionsModulos[0]?.ALTERAR == 'True') {
            if (row && row.ID) {
                handleEdit(row.ID);
            }
        } else {
            Swal.fire({
                title: 'Acesso Negado',
                text: 'Você não tem permissão para acessar está funcionalidade.',
                icon: 'warning',
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })
        }
    };

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>Lista de Menus Filhos</h2>
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
                        selectedRows={rowSelected}
                        selectionMode="single"
                        rowsPerPageOptions={[10, 20, 30, 50, 100, dados.length]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                        filterDisplay="menu"
                        cellMemo={false}
                        showGridlines
                        stripedRows
                        emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
                    >
                        {colunaListaMenuFilho.map(coluna => (
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

            <ActionEditarMenuFilho
                show={modalEditarMenuFilho}
                handleClose={() => setModalEditarMenuFilho(false)}
                dadosDetalhesMenuFilho={dadosDetalhesMenuFilho}
                refetchMenuFilho={refetchMenuFilho}
                optionsModulos={optionsModulos}
                usuarioLogado={usuarioLogado}
                dadosMenuPai={dadosMenuPai}
            />

        </Fragment>
    )
}
