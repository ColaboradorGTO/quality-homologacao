import { Fragment, useEffect, useRef, useState } from "react"
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ButtonTable } from "../../../../ButtonsTabela/ButtonTable";
import { formatMoeda } from "../../../../../utils/formatMoeda";
import { FaCheck, FaMinus, FaSearch } from "react-icons/fa";
import { get, post, put } from "../../../../../api/funcRequest";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import HeaderTable from "../../../../Tables/headerTable";
import { ButtonType } from "../../../../Buttons/ButtonType";
import { ButtonTypeModal } from "../../../../Buttons/ButtonTypeModal";
import { useQuery } from "react-query";

export const ActionListaProduto = ({
  dadosColetorBalanco,
  empresaSelecionada,
  quantidade,
  usuarioLogado,
  optionsModulos,
  refetch,
  handleClose
}) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [ipUsuario, setIpUsuario] = useState('')
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [pesquisarProduto, setPesquisarProduto] = useState('');
  const [produtosVisiveis, setProdutosVisiveis] = useState(false);
  const [detalhesProduto, setDetalhesProduto] = useState([]);
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const dataTableRef = useRef();

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  }

  const onGlobalFilterChange = (e) => {
    setGlobalFilterValue(e.target.value);
  };

  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Lista de Produtos',
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.autoTable({
      head: [['Produto', 'Cod. Barra', 'Descrição', 'R$ Custo', 'R$ Venda']],
      body: dados.map(item => [
        item.IDPRODUTO,
        item.NUCODBARRAS,
        item.DSNOME,
        formatMoeda(item.PRECOCUSTO),
        formatMoeda(item.PRECOVENDA)
      ]),
      horizontalPageBreak: true,
      horizontalPageBreakBehaviour: 'immediately'
    });
    doc.save('lista_produtos.pdf');
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(dados);
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Cod. Barra', 'Descrição', 'R$ Custo', 'R$ Venda'];
    worksheet['!cols'] = [
      { wpx: 100, caption: 'Produto' },
      { wpx: 100, caption: 'Cod. Barras' },
      { wpx: 250, caption: 'Descrição' },
      { wpx: 100, caption: 'R$ Venda' },
      { wpx: 100, caption: 'R$ Custo' }
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lista de Produtos');
    XLSX.writeFile(workbook, 'lista_produtos.xlsx');
  };


  const getIPUsuario = async () => {
    let usuarioIP = null;

    try {
      const { data: ipWhoisData } = await axios.get("http://ipwho.is/");
      usuarioIP = ipWhoisData?.ip;
    } catch (error) {
      console.error("Erro ao buscar IP via ipwho.is:", error);
    }

    if (!usuarioIP) {
      try {
        const { data: ipifyData } = await axios.get("https://api.ipify.org?format=json");
        usuarioIP = ipifyData?.ip;
      } catch (error) {
        console.error("Erro ao buscar IP via ipify.org:", error);
      }
    }
    setIpUsuario(usuarioIP);
    return usuarioIP;
  };

  const { data: dadosBalancoAvulso = [], error: errorBalanco, isLoading: isLoadingBalanco, refetch: refetchBalanco } = useQuery(
    ['detalheBalancoAvulso', empresaSelecionada, usuarioLogado?.id],
    async () => {
      const response = await get(`/detalheBalancoAvulso?idFilial=${empresaSelecionada}&coletor=${usuarioLogado.id}`);
      return response.data;
    },
    { enabled: false, }
  );

  const dados = dadosColetorBalanco.map((item) => {
    let listarDetalheBalanco = 1;
    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PRECOCUSTO: parseFloat(item.PRECOCUSTO),
      PRECOVENDA: item.PRECOVENDA,
      TOTALCONTAGEMGERAL: item.TOTALCONTAGEMGERAL,
      listarDetalheBalanco: listarDetalheBalanco,
    }
  });

  const colunasVendas = [

    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th> {row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th> {row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th> {row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'R$ Custo',
      body: row => <th> {formatMoeda(row.PRECOCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'R$ Venda',
      body: row => <th> {formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      body: (row) => {
        const itemQuantidade = quantidade
        return (
          <div className="d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <form onSubmit={handleSubmit(() => onSubmit(quantidade))}>
              <ButtonTable
                // type={"submit"}
                onClickButton={() => { onSubmit(row.IDPRODUTO, itemQuantidade) }}
                titleButton={"Confirmar"}
                Icon={FaCheck}
                cor={"success"}
                iconSize={20}
                width="35px"
                height="35px"
              />
            </form>
          </div>

        )
      },
    },
  ]

  const { data: dadosProdutos = [], error: errorProdutos, isLoading: isLoadingProdutos } = useQuery(
    'empresas',
    async () => {
      const response = await get(`/listaProdutos?idEmpresa=${empresaSelecionada}&dsProduto=${pesquisarProduto}`);
      return response.data;
    },
    { staleTime: 5 * 60 * 1000, cacheTime: 60 * 60 * 1000, }
  );

  const dadosSearch = dadosProdutos?.map((item) => {
    let listarDetalheBalanco = 1;
    return {
      IDPRODUTO: item.IDPRODUTO,
      NUCODBARRAS: item.NUCODBARRAS,
      DSNOME: item.DSNOME,
      PRECOCUSTO: parseFloat(item.PRECOCUSTO),
      PRECOVENDA: item.PRECOVENDA,
      TOTALCONTAGEMGERAL: item.TOTALCONTAGEMGERAL,
      listarDetalheBalanco: listarDetalheBalanco,
    }
  });

  const colunasProdutos = [

    {
      field: 'IDPRODUTO',
      header: 'Produto',
      body: row => <th> {row.IDPRODUTO}</th>,
      sortable: true,
    },
    {
      field: 'NUCODBARRAS',
      header: 'Cód. Barras',
      body: row => <th> {row.NUCODBARRAS}</th>,
      sortable: true,
    },
    {
      field: 'DSNOME',
      header: 'Descrição',
      body: row => <th> {row.DSNOME}</th>,
      sortable: true,
    },
    {
      field: 'PRECOCUSTO',
      header: 'R$ Custo',
      body: row => <th> {formatMoeda(row.PRECOCUSTO)}</th>,
      sortable: true,
    },
    {
      field: 'PRECOVENDA',
      header: 'R$ Venda',
      body: row => <th> {formatMoeda(row.PRECOVENDA)}</th>,
      sortable: true,
    },
    {
      header: 'Opções',
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      body: (row) => {
        const itemQuantidade = quantidade
        return (
          <div className="d-flex "
            style={{ justifyContent: "space-between" }}
          >
            <form onSubmit={handleSubmit(() => onSubmit(quantidade))}>
              <ButtonTable
                // type={"submit"}
                onClickButton={() => { onSubmit(row.IDPRODUTO, itemQuantidade) }}
                titleButton={"Confirmar"}
                Icon={FaCheck}
                cor={"success"}
                iconSize={20}
                width="35px"
                height="35px"
              />
            </form>
          </div>

        )
      },
    },
  ]


  const onSubmit = async (IDPRODUTO, quantidade) => {
    if (optionsModulos[0]?.CRIAR == 'False') {
      Swal.fire({
        icon: 'info',
        text: 'Você não tem permissão para criar balanço avulso!',
        timer: 3000,
      });
      return;
    }
    try {
      const response = await get(`/detalheBalancoAvulso?idFilial=${empresaSelecionada}&coletor=${usuarioLogado.id}`)
      const produtos = response.data || [];

      const produtoSelecionado = dadosColetorBalanco.find(
        (p) => p.IDPRODUTO == IDPRODUTO
      );

      const produtoExistente = produtos.find(p => p.IDPRODUTO == IDPRODUTO);

      if (produtoExistente) {
        const novaQuantidade = (Number(produtoExistente.TOTALCONTAGEMGERAL) || 0) + (Number(quantidade) || 1);

        const putData = {
          IDEMPRESA: Number(empresaSelecionada),
          NUMEROCOLETOR: Number(usuarioLogado.id),
          DSCOLETOR: usuarioLogado.NOFUNCIONARIO,
          IDPRODUTO: IDPRODUTO,
          CODIGODEBARRAS: produtoSelecionado.NUCODBARRAS,
          DSPRODUTO: produtoSelecionado.DSNOME,
          TOTALCONTAGEMGERAL: novaQuantidade,
          PRECOCUSTO: Number(produtoSelecionado.PRECOCUSTO),
          PRECOVENDA: Number(produtoSelecionado.PRECOVENDA),
          STCANCELADO: 'False',
          INSBALANCO: parseInt(0),
        };

        await put('/detalhe-balanco-avulso/:id', putData)
        const textDados = JSON.stringify(putData)
        let textoFuncao = 'ADMINISTRATIVO/ALTUALIZAÇÃO BALANÇO AVULSO';
        const ipUsuario = await getIPUsuario();
        const postData = {
          IDFUNCIONARIO: String(usuarioLogado.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        };

        const responsePost = await post('/log-web', postData);

        Swal.fire({
          title: 'Sucesso',
          text: 'Alteração Realizada com Sucesso',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            container: 'custom-swal',
          }
        })
        refetch()
        handleClose()
        return responsePost.data;
      } else {

        const createData = {
          CODIGODEBARRAS: produtoSelecionado.NUCODBARRAS,
          DSCOLETOR: 'COLETOR WEB - ' + usuarioLogado.NOFUNCIONARIO,
          DSPRODUTO: produtoSelecionado.DSNOME,
          IDEMPRESA: Number(empresaSelecionada),
          IDPRODUTO: IDPRODUTO,
          INSBALANCO: parseInt(0),
          NUMEROCOLETOR: Number(usuarioLogado.id),
          PRECOCUSTO: Number(produtoSelecionado.PRECOCUSTO),
          PRECOVENDA: Number(produtoSelecionado.PRECOVENDA),
          STCANCELADO: 'False',
          TOTALCONTAGEMGERAL: Number(quantidade) || 1,
        }

        await post('/criar-detalhe-balanco-avulso', createData)
        const textDados = JSON.stringify(createData)
        let textoFuncao = 'ADMINISTRATIVO/CADASTRO BALANÇO AVULSO';
        const ipUsuario = await getIPUsuario();

        const postData = {
          IDFUNCIONARIO: String(usuarioLogado.id),
          PATHFUNCAO: textoFuncao,
          DADOS: textDados,
          IP: ipUsuario
        }

        const responsePost = await post('/log-web', postData)

        Swal.fire({
          title: 'Sucesso',
          text: 'Cadastro Realizado com Sucesso',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false,
          customClass: {
            container: 'custom-swal',
          }
        })
        refetch()
        handleClose()
        return responsePost.data;
      }


    } catch (error) {
      const produtoSelecionado = dadosColetorBalanco.find(
        (p) => p.IDPRODUTO == IDPRODUTO
      );
      const postData = {
        TOTALCONTAGEMGERAL: Number(quantidade),
        IDEMPRESA: produtoSelecionado.IDEMPRESA,
        NUMEROCOLETOR: usuarioLogado.id,
        IDPRODUTO: IDPRODUTO,
        DSCOLETOR: 'COLETOR WEB - ' + usuarioLogado.NOFUNCIONARIO,
        CODIGODEBARRAS: produtoSelecionado.NUCODBARRAS,
        DSPRODUTO: produtoSelecionado.DSNOME,
        PRECOCUSTO: Number(produtoSelecionado.PRECOCUSTO),
        PRECOVENDA: Number(produtoSelecionado.PRECOVENDA),
        STCANCELADO: 'False',
        INSBALANCO: parseInt(0),
      }

      const textDados = JSON.stringify(postData)
      let textoFuncao = 'ADMINISTRATIVO/ERRO AO ALTERAR BALANÇO AVULSO';
      const ipUsuario = await getIPUsuario();

      const postDataLog = {
        IDFUNCIONARIO: String(usuarioLogado.id),
        PATHFUNCAO: textoFuncao,
        DADOS: textDados,
        IP: ipUsuario
      }


      Swal.fire({
        title: 'Erro',
        text: 'Alteração Não Realizada',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          container: 'custom-swal',
        }
      })
      const responsePost = await post('/log-web', postDataLog)

      return responsePost.data;
    }
  }

  const handlePesquisar = async () => {
    if (pesquisarProduto.length < 5) {
      Swal.fire({
        icon: 'warning',
        text: 'A pesquisa deve conter pelo menos 5 caracteres.',
        timer: 3000,
        showConfirmButton: false,
        customClass: {
          container: 'custom-swal',
        }
      });
      return;
    } else {
      refetch();
    }
  }
  return (

    <Fragment>

      <div className="panel">
        <div className="form-group "
          style={{ display: "flex", justifyContent: "start", alignItems: "center", marginBottom: "1rem", padding: "1rem" }}
        >
          <div
            style={{ width: '50%', marginRight: '1rem' }}
          >
            <label htmlFor="descricao">Informe a Descrição ou Código de Barras do Produto</label>
            <input
              type="text"
              placeholder="Pesquisar"
              value={pesquisarProduto}
              onChange={(e) => setPesquisarProduto(e.target.value)}
              className="form-control"
            />
          </div>
          <ButtonTypeModal
            cor={"primary"}
            tipo={"button"}
            onClickButtonType={() => handlePesquisar()}
            textButton={"Pesquisar"}
            Icon={FaSearch}
          >

          </ButtonTypeModal>
        </div>
        <div className="panel-hdr">
          <h2> Lista de Produtos </h2>
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
            title="Lista de Produtos"
            value={dados}
            size="small"
            sortOrder={-1}
            paginator={true}
            rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
            first={first}
            rows={rows}
            onPage={onPageChange}
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
            filterDisplay="menu"
            showGridlines
            stripedRows
            emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
          >
            {colunasVendas.map(coluna => (
              <Column
                key={coluna.field}
                field={coluna.field}
                header={coluna.header}

                body={coluna.body}
                footer={coluna.footer}
                sortable={coluna.sortable}
                headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                footerStyle={{ color: '#212529', backgroundColor: "#6e4e9e", border: '1px solid #ccc', fontSize: '0.8rem' }}
                bodyStyle={{ fontSize: '0.8rem' }}

              />
            ))}
          </DataTable>
        </div>

        {produtosVisiveis && (
          <Fragment>

            <div className="panel-hdr">
              <h2> Lista de Produtos </h2>
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
                title="Lista de Produtos"
                value={dadosSearch}
                size="small"
                sortOrder={-1}
                paginator={true}
                rowsPerPageOptions={[10, 20, 50, 100, dados.length]}
                first={first}
                rows={rows}
                onPage={onPageChange}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} Registros"
                filterDisplay="menu"
                showGridlines
                stripedRows
                emptyMessage={<div className="dataTables_empty">Nenhum resultado encontrado</div>}
              >
                {colunasProdutos.map(coluna => (
                  <Column
                    key={coluna.field}
                    field={coluna.field}
                    header={coluna.header}

                    body={coluna.body}
                    footer={coluna.footer}
                    sortable={coluna.sortable}
                    headerStyle={{ color: 'white', backgroundColor: "#7a59ad", border: '1px solid #e9e9e9', fontSize: '0.8rem' }}
                    footerStyle={{ color: '#212529', backgroundColor: "#6e4e9e", border: '1px solid #ccc', fontSize: '0.8rem' }}
                    bodyStyle={{ fontSize: '0.8rem' }}

                  />
                ))}
              </DataTable>
            </div>
          </Fragment>
        )}

      </div>
    </Fragment>
  )
}
