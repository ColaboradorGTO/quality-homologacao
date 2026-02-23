import { Fragment, useEffect, useRef, useState } from "react"
import { Modal } from "react-bootstrap"
import { useForm } from "react-hook-form";
import { HeaderModal } from "../../../Modais/HeaderModal/HeaderModal";
import HeaderTable from "../../../Tables/headerTable";
import { ButtonTable } from "../../../ButtonsTabela/ButtonTable";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { toFloat } from "../../../../utils/toFloat";
import { formatMoeda } from "../../../../utils/formatMoeda";
import { FooterModal } from "../../../Modais/FooterModal/footerModal";
import { ButtonTypeModal } from "../../../Buttons/ButtonTypeModal";
import { GiReturnArrow } from "react-icons/gi";
import { FaArrowLeft } from "react-icons/fa";
import { post, put } from "../../../../api/funcRequest";
import Swal from "sweetalert2";

export const ActionDesvincularNotasNFEModal = ({ show, handleClose, dadosPedidosVinculados }) => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const dataTableRef = useRef();
    const [selectAll, setSelectAll] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);


    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Desvincular Nota Pedidos',
    });

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Valor Pedido']],
            body: dados.map(item => [
                item.contador,
                item.DTPEDIDO,
                item.IDPEDIDO,
                item.NOFANTASIA,
                item.NOMECOMPRADOR,
                item.NOFORNECEDOR,
                formatMoeda(item.VRTOTALLIQUIDO),
            ]),
            horizontalPageBreak: true,
            horizontalPageBreakBehaviour: 'immediately'
        });
        doc.save('desvincular_nota_pedido.pdf');
    };

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Nº', 'Data', 'Nº Pedido', 'Marca', 'Comprador', 'Fornecedor', 'Valor Pedido'];
        worksheet['!cols'] = [
            { wpx: 70, caption: 'Nº' },
            { wpx: 150, caption: 'Data' },
            { wpx: 70, caption: 'Nº Pedido' },
            { wpx: 200, caption: 'Marca' },
            { wpx: 200, caption: 'Comprador' },
            { wpx: 200, caption: 'Fornecedor' },
            { wpx: 100, caption: 'Valor Pedido' },

        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Desvincular Nota Pedidos');
        XLSX.writeFile(workbook, 'desvincular_nota_pedido.xlsx');
    };


    const dados = dadosPedidosVinculados.map((item, index) => {
        let contador = index + 1;

        return {
            contador,
            DTPEDIDO: item.DTPEDIDO,
            IDPEDIDO: item.IDPEDIDO,
            NOFANTASIA: item.NOFANTASIA,
            NOMECOMPRADOR: item.NOMECOMPRADOR,
            NOFORNECEDOR: item.NOFORNECEDOR,
            VRTOTALLIQUIDO: (toFloat(item.VRTOTALLIQUIDO)),
        }
    })

    const colunasUnidadeMedida = [
        {
            field: 'contador',
            header: 'Nº',
            body: row => <th>{row.contador}</th>,
            sortable: true,
        },
        {
            field: 'DTPEDIDO',
            header: 'Data',
            body: row => <th>{row.DTPEDIDO}</th>,
            sortable: true,
        },
        {
            field: 'IDPEDIDO',
            header: 'Nº Pedido',
            body: row => {
                return (
                    <th>{row.IDPEDIDO}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'NOFANTASIA',
            header: 'Marca',
            body: row => {
                return (
                    <th>{row.NOFANTASIA}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'NOMECOMPRADOR',
            header: 'Comprador',
            body: row => {
                return (
                    <th>{row.NOMECOMPRADOR}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'NOFORNECEDOR',
            header: 'Fornecedor',
            body: row => {
                return (
                    <th>{row.NOFORNECEDOR}</th>
                )
            },
            sortable: true,
        },
        {
            field: 'VRTOTALLIQUIDO',
            header: 'Valor Pedido',
            body: row => {
                return (
                    <th style={{}} >
                        {formatMoeda(row.VRTOTALLIQUIDO)}
                    </th>
                )
            },
            sortable: true,
        },
        {
            field: 'IDPEDIDO',
            header: 'Opções',
            body: row => {
                return (
                    <div className="custom-control custom-checkbox">
                        <input
                            type="checkbox"
                            checked={selectedIds.includes(row.IDPEDIDO)}
                            onChange={(e) => {
                                const updatedSelectedIds = e.target.checked
                                    ? [...selectedIds, row.IDPEDIDO]
                                    : selectedIds.filter(id => id !== row.IDPEDIDO);
                                setSelectedIds(updatedSelectedIds);

                            }}
                            selectionMode="multiple"
                        />
                    </div>
                )
            },
            sortable: true,
        }
    ]

    useEffect(() => {
        if (selectedIds.length === 0) {
            setSelectAll(false);
        }
    }, [selectedIds]);

    useEffect(() => {
        if (!show) {
            setSelectedIds([]);
        }
    }, [show]);

    //  Voltar aqui para finalizar a função de desvincular pedidos

    const handleVincularPedidos = async () => {
        console.log(selectedIds);
        // vinculo-nfPedido/:id
        const postData = [{
            IDRESUMOPEDIDO: selectedIds,
            IDRESUMOENTRDA: dadosPedidosVinculados[0].IDRESUMOENTRADA
        }]
        try {

            const response = await put('/vinculo-nfPedido/:id', postData)
            const textDados = JSON.stringify(postData)
            let textFuncao = 'CADASTRO/VINCULO DE PEDIDOS A NOTA FISCAL';

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)

            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            // handleClose();
            return response.data;

        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Ocorreu um erro ao enviar o formulário. Por favor, tente novamente.',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                },
            });
            console.error('Erro ao alterar a venda:', error);
        }
    }

    return (

        <Fragment>
            <Modal
                show={show}
                onHide={handleClose}
                class="modal-content"
                size="xl"
                centered
            >

                <HeaderModal
                    title={"Pedidos Vinculados a NFE"}
                    subTitle={`Exclusão de Vínculo e Alteração`}
                    handleClose={handleClose}
                />


                <Modal.Body>
                    <div className="panel">
                        <div className="panel-hdr">
                            <h2>Lista de Notas Fiscais</h2>
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
                                title="Pedidos Vinculados a NFE"
                                value={dados}
                                globalFilter={globalFilterValue}
                                size="small"
                                sortOrder={-1}
                                paginator={true}
                                rows={10}

                                showGridlines
                                stripedRows
                                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado </div>}
                            >
                                {colunasUnidadeMedida.map(coluna => (
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
                    {selectedIds.length > 0 && (
                        <FooterModal
                            ButtonTypeCadastrar={ButtonTypeModal}
                            onClickButtonCadastrar
                            textButtonCadastrar={"Desvincular Pedidos"}
                            corCadastrar={"danger"}
                            iconCadastrar={FaArrowLeft}
                        />
                    )}
                </Modal.Body>
            </Modal>
        </Fragment>
    )
}