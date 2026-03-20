import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { useForm } from "react-hook-form";
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { useReactToPrint } from "react-to-print";
import { FaMinus, FaRegTrashAlt } from "react-icons/fa";
import HeaderTable from "../../../../Tables/headerTable";
import { Fragment, useEffect, useRef, useState } from "react"
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import Swal from 'sweetalert2';

export const ActionListaEditarOT = ({
    dadosDetalheTransferencia,
    setDadosDetalheTransferencia
}) => {

    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [dadosAjusteDetalheTransferencia, setAjusteDadosDetalheTransferencia] = useState([])
    const [quantidade, setQuantidade] = useState(0);
    const dataTableRef = useRef();

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const handlePrint = useReactToPrint({
        content: () => dataTableRef.current,
        documentTitle: 'Controle de Transferência',
    });

    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(dados);
        const workbook = XLSX.utils.book_new();
        const header = ['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'QTD Exedição', 'QTD Recepção', 'QTD Diferença', 'QTD Ajuste'];
        worksheet['!cols'] = [
            { wpx: 100, caption: 'Produto' },
            { wpx: 100, caption: 'Cód. Barras' },
            { wpx: 100, caption: 'Descrição' },
            { wpx: 100, caption: 'R$ Custo' },
            { wpx: 100, caption: 'R$ Venda' },
            { wpx: 100, caption: 'QTD Exedição' },
            { wpx: 100, caption: 'QTD Recepção' },
            { wpx: 100, caption: 'QTD Diferença' },
            { wpx: 100, caption: 'QTD Ajuste' }
        ];
        XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Controle de Transferência');
        XLSX.writeFile(workbook, 'controle_transferencia.xlsx');
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.autoTable({
            head: [['Produto', 'Cód. Barras', 'Descrição', 'R$ Custo', 'R$ Venda', 'QTD Exedição', 'QTD Recepção', 'QTD Diferença', 'QTD Ajuste']],
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
        doc.save('controle_transferencia.pdf');
    };

    const dados = dadosDetalheTransferencia.map((item, index) => {
        let contador = index + 1;

        return {
            IDRESUMOOT: item.IDRESUMOOT,
            IDPRODUTO: item.IDPRODUTO,
            IDEMPRESAORIGEM: item.IDEMPRESAORIGEM,
            NUCODBARRAS: item.NUCODBARRAS,
            DSNOME: item.DSNOME,
            VLRUNITVENDA: item.VLRUNITVENDA,
            VLRUNITCUSTO: item.VLRUNITCUSTO,
            QTDEXPEDICAO: item.QTDEXPEDICAO,
            QTDRECEPCAO: parseInt(item.QTDRECEPCAO),
            QTDDIFERENCA: parseInt(item.QTDDIFERENCA),
            QTDAJUSTE: parseInt(item.QTDAJUSTE),
            IDEMPRESADESTINO: item.IDEMPRESADESTINO,
            QTDCONFERENCIA: parseInt(item.QTDCONFERENCIA),
            IDSTATUSOT: parseInt(item.IDSTATUSOT),
            contador
        }
    });

    useEffect(() => {
        if (dados.length > 0) {
            setQuantidade(dados[0].QTDAJUSTE)
        }

    }, [dados]
    )

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
            header: 'QTD Exedição',
            body: row => <th>{row.QTDEXPEDICAO}</th>,
            sortable: true,
        },
        {
            field: 'IDSTATUSOT',
            header: 'Opções',
            button: true,
            body: (row) => {
                return (
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            width: "100%"
                        }}
                    >
                        {row.IDSTATUSOT === 1 && (
                            <>
                                <div className="mr-2">
                                    <ButtonTable
                                        titleButton={"Diminuir Quantidade"}
                                        onClickButton={() => handleRemoverProduto(row)}
                                        Icon={FaMinus}
                                        iconSize={16}
                                        iconColor={"#fff"}
                                        cor={"info"}
                                        width="32px"
                                        height="32px"
                                    />
                                </div>

                                <div>
                                    <ButtonTable
                                        titleButton={"Excluir Produto"}
                                        onClickButton={() => handleExcluirProduto(row)}
                                        Icon={FaRegTrashAlt}
                                        iconSize={16}
                                        iconColor={"#fff"}
                                        cor={"danger"}
                                        width="32px"
                                        height="32px"
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )
            }
        }
    ]

    const handleExcluirProduto = (produto) => {
        const modalElement = document.querySelector('.modal.show');

        Swal.fire({
            title: 'Atenção',
            text: 'Essa ação irá excluir o produto da O.T, Deseja prosseguir?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Sim, remover',
            cancelButtonText: 'Cancelar',
            target: modalElement,
            customClass: {
                popup: 'custom-swal'
            }
        }).then(result => {
            if (result.isConfirmed) {
                setDadosDetalheTransferencia(prev =>
                    prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
                );
            }
        })
    };


    const handleRemoverProduto = (produto) => {
        const itemAtual = dadosDetalheTransferencia.find(
            item => item.IDPRODUTO === produto.IDPRODUTO
        );

        if (!itemAtual) return;
        if (itemAtual.QTDEXPEDICAO === 1) {
            const modalElement = document.querySelector('.modal.show');

            Swal.fire({
                title: 'Atenção',
                text: 'Essa ação irá excluir o produto da O.T. Deseja prosseguir?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sim, remover',
                cancelButtonText: 'Cancelar',
                target: modalElement,
                customClass: {
                    popup: 'custom-swal'
                }
            }).then(result => {
                if (result.isConfirmed) {
                    setDadosDetalheTransferencia(prev =>
                        prev.filter(item => item.IDPRODUTO !== produto.IDPRODUTO)
                    );
                }
            });
            return;
        }
        setDadosDetalheTransferencia(prev =>
            prev.map(item =>
                item.IDPRODUTO === produto.IDPRODUTO
                    ? { ...item, QTDEXPEDICAO: item.QTDEXPEDICAO - 1 }
                    : item
            )
        );
    };

    return (
        <Fragment>
            <div className="panel">
                <div className="panel-hdr">
                    <h2>
                        Lista de Ordem de Transferência
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
                <div className="card" ref={dataTableRef}></div>
                <DataTable
                    title="Vendas por Loja"
                    value={dados}
                    size={"small"}
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
                            headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                            footerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                            bodyStyle={{ fontSize: '0.8rem' }}
                        />
                    ))}
                </DataTable>
            </div>
        </Fragment>
    )
}
