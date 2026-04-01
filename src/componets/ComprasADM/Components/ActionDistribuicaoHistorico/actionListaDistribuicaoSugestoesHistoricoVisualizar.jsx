import { Fragment, useRef, useState, useEffect } from "react";
import './styles.css'
import './print-styles.css'
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { put } from '../../../../api/funcRequest';
import Swal from 'sweetalert2';

export const ActionListaDistribuicaoSugestoesHistoricoVisualizar = ({ 
  dadosSugestoesHistorico, 
}) => {
  const dataTableRef = useRef();
  const [dadosProcessados, setDadosProcessados] = useState([]);
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  // Carrega usuário logado
  useEffect(() => {
    const usuarioArmazenado = localStorage.getItem('usuario');
    if (usuarioArmazenado) {
      try {
        const parsedUsuario = JSON.parse(usuarioArmazenado);
        setUsuarioLogado(parsedUsuario);
      } catch (error) {
        console.error('Erro ao parsear o usuário do localStorage:', error);
      }
    }
  }, []);

  // AlterarQtdSugestao - Função idêntica ao jQuery
  const AlterarQtdSugestao = async (id) => {
    if (!usuarioLogado?.id) {
      Swal.fire({
        icon: 'warning',
        title: 'Atenção!',
        text: 'Usuário não identificado. Faça login novamente.',
      });
      return;
    }

    const idchave = id.split(":");
    const iddistribuicaocompras = idchave[0];
    const idpedidocompra = idchave[1];
    const idempresa = idchave[2];
    const idfilial = idchave[3];
    const codbarras = idchave[4];

    const inputElement = document.getElementById(id);
    const spanTotal = document.getElementById(codbarras);
    
    if (!inputElement || !spanTotal) {
      console.error('Elementos não encontrados:', { inputElement, spanTotal });
      return;
    }

    const qtdsugestaoalterada = parseInt(inputElement.value) || 0;
    const qtdsugestao = parseInt(inputElement.defaultValue) || 0;
    
    const qtdtotal = (parseInt(spanTotal.textContent) - qtdsugestao) + qtdsugestaoalterada;

    const dados = [{
      "IDDISTRIBUICAOCOMPRASHISTORICO": parseInt(iddistribuicaocompras),
      "IDPEDIDOCOMPRA": parseInt(idpedidocompra),
      "IDEMPRESA": parseInt(idempresa),
      "IDFILIAL": parseInt(idfilial),
      "CODBARRAS": codbarras,
      "QTDSUGESTAOALTERACAOHISTORICO": parseInt(qtdsugestaoalterada),
      "IDUSUARIOALTERACAO": parseInt(usuarioLogado.id),
      "FINALIZAR": 0
    }];

    try {
      await put("/compras/distribuicao-compras-historico", dados);
      
      // Atualiza o DOM como no jQuery
      inputElement.defaultValue = qtdsugestaoalterada;
      spanTotal.textContent = qtdtotal;
      
      // Atualiza o estado também para manter consistência
      setDadosProcessados(prevDados => {
        return prevDados.map(produto => {
          if (produto.CodBarras === codbarras) {
            const novasFiliais = produto.filiais.map(filial => {
              if (filial.IdFilial.toString() === idfilial) {
                return { ...filial, qtdsugestaoalterada };
              }
              return filial;
            });
            return {
              ...produto,
              filiais: novasFiliais,
              totalqtd: qtdtotal
            };
          }
          return produto;
        });
      });
      
      // Alerta de sucesso
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Quantidade atualizada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
      Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: 'Erro ao atualizar quantidade. Tente novamente.',
      });
    }
  };
  
  const handlePrint = useReactToPrint({
    content: () => dataTableRef.current,
    documentTitle: 'Histórico da Distribuição',
    onBeforePrint: () => {
      const style = document.createElement('style');
      style.innerHTML = `
        *{
          margin: 0;
          padding: 0;
          box-sizing: border-box !important;
        }
        @page {
          size: A4 landscape;
          margin: 5mm !important;
          background: #f60000;
        }
        @media print {
          .print-div-table{ width: 100%; };
          .hidden-print {
            display: none !important;
          }
          .tbody > tr > td {
            margin: 0;
            padding: 0;
          }
        }
        body {
          padding: 0 !important;
          margin: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          background: white !important;
        }
      `;
      document.head.appendChild(style);   
    }
    // document.head.appendChild(style);
  })

  const processarDadosParaTabela = (respostaListaDistribuicaoCompras) => {
    if (!respostaListaDistribuicaoCompras || respostaListaDistribuicaoCompras.length === 0) {
      return { produtos: [], filiais: [] };
    }
    
    const filiais = respostaListaDistribuicaoCompras[0]?.Filiais || [];

    const produtos = respostaListaDistribuicaoCompras.map((registro) => {
      let totalqtd = 0;
      const filiaisProcessadas = [];

      registro.Filiais.forEach((retfilialsugerida) => {
        let qtdsugestao = 0;
        let iddistribuicaocompras = 0;
        let qtdsugestaoalterada = 0;
        const idfilial = retfilialsugerida.IdFilial;

        registro.Sugestao.forEach((retqtdsugerida) => {
          if (parseInt(idfilial) === parseInt(retqtdsugerida.IdFilial)) {
            qtdsugestao = retqtdsugerida.QtdSugestao;
            iddistribuicaocompras = retqtdsugerida.IdDistribuicaoCompras;
            qtdsugestaoalterada = parseInt(retqtdsugerida.QtdSugestaoAlteracao) === 0 
              ? qtdsugestao 
              : retqtdsugerida.QtdSugestaoAlteracao;
          }
        });

        filiaisProcessadas.push({
          IdFilial: idfilial,
          DescFilial: retfilialsugerida.DescFilial,
          qtdsugestaoalterada,
          qtdsugestao,
          iddistribuicaocompras,
          // Criar inputId idêntico ao jQuery
          inputId: `${iddistribuicaocompras}:${registro.IdPedidoCompra}:${registro.IdEmpresa}:${idfilial}:${registro.CodBarras}`
        });

        totalqtd += parseInt(qtdsugestaoalterada);
      });

      return {
        DescProduto: registro.DescProduto,
        PrecoVenda: registro.PrecoVenda,
        QtdGrade: registro.QtdGrade,
        Grade: registro.Grade,
        CodBarras: registro.CodBarras,
        IdPedidoCompra: registro.IdPedidoCompra,
        IdEmpresa: registro.IdEmpresa,
        totalqtd,
        filiais: filiaisProcessadas
      };
    });

    // Armazena os dados processados no state
    setDadosProcessados(produtos);

    return { produtos, filiais };
  };

  const { produtos, filiais } = processarDadosParaTabela(dadosSugestoesHistorico);

  if (produtos.length === 0) {
    return null;
  }

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(produtos.map(produto => {
      const produtoData = {
        Produto: produto.DescProduto,
        Valor: produto.PrecoVenda,
        Qtd: produto.QtdGrade,
        Grade: produto.Grade,
        Total: produto.totalqtd,
      };
      produto.filiais.forEach((filial) => {
        produtoData[`${filial.DescFilial} ${filial.IdFilial}`] = filial.qtdsugestaoalterada;
      });
      return produtoData;
    }));
    const workbook = XLSX.utils.book_new();
    const header = ['Produto', 'Valor', 'Qtd', 'Grade', 'Total', ...filiais.map(filial => `${filial.DescFilial}`)];
    worksheet['!cols'] = [
      { wpx: 250, caption: 'Produto' },
      { wpx: 50, caption: 'Valor' },
      { wpx: 50, caption: 'Qtd' },
      { wpx: 50, caption: 'Grade' },
      { wpx: 50, caption: 'Total' },
      ...filiais.map(filial => ({ wpx: 200, caption: `${filial.DescFilial}` }))
    ];
    XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: 'A1' });
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Histórico da Distribuição');
    XLSX.writeFile(workbook, 'historico_distribuicao_compras.xlsx');
  };

  return (
    <Fragment>
      <div className="row ">
        <div className="mr-4">

          <button
            className="btn btn-primary mb-3 hidden-print"
            onClick={handlePrint}
          >
            Imprimir PDF
          </button> 
        </div>
        <div>

          <button
            className="btn btn-success mb-3 hidden-print"
            onClick={exportToExcel}
          >
            Gerar Excel
          </button> 
        </div>
      </div>
      <div className="" ref={dataTableRef}>
        <table 
          id="dt-basic-distribuicao" 
          className="table table-bordered table-hover table-striped w-100"
          ref={dataTableRef}
        >
          <thead>
            <tr className="td">
              <th className="td" colSpan="5">Nº Pedido {dadosSugestoesHistorico[0]?.IdPedidoCompra}</th>
            </tr>
            
            <tr id="dt-basic-distribuicao-titulo">
              <th className="td" width="300px">Produto</th>
              <th className="td" width="60">Valor</th>
              <th className="td" width="60px">Qtd</th>
              <th className="td" width="50px">Grade</th>
              <th className="td" width="60px">Total</th>
                  
              {filiais.map((filial) => (
                <th key={filial.IdFilial} className="td" height="200px">
                  <span 
                    className="rotate-270 text-nowrap h-170 d-flex pos-bottom" 
                    style={{ width: '20px' }}
                  >
                    &nbsp;&nbsp;{filial.DescFilial}
                  </span>
                </th>
              ))}  
            </tr>
          </thead>
          
          <tbody>           
            {produtos.map((produto, index) => {
              // Busca o produto atualizado do state
              const produtoAtualizado = dadosProcessados.find(p => p.CodBarras === produto.CodBarras);
              const totalAtualizado = produtoAtualizado?.totalqtd || produto.totalqtd;
              
              return (
                <tr key={index} id={`dt-basic-distribuicao-lista-${index}`}>
                  <td className="td">{produto.DescProduto}</td>
                  <td className="td">{produto.PrecoVenda}</td>
                  <td className="td">{produto.QtdGrade}</td>
                  <td className="td">{produto.Grade}</td>
                  <td className="td">
                    <span id={produto.CodBarras}>{totalAtualizado}</span>
                  </td>
                  
                  {produto.filiais.map((filial) => {
                    // Encontra o produto atual no state para pegar o valor atualizado
                    const filialAtualizada = produtoAtualizado?.filiais.find(f => f.IdFilial === filial.IdFilial);
                    const valorAtual = filialAtualizada?.qtdsugestaoalterada || filial.qtdsugestaoalterada;
                    
                    return (
                      <td key={filial.IdFilial} className="td">
                        <input
                          type="number"
                          id={filial.inputId}
                          name="qtdsugestaoalterada"
                          defaultValue={filial.qtdsugestao}
                          value={valorAtual}
                          onChange={(e) => {
                            // Atualiza o state localmente para responsividade 
                            const novoValor = parseInt(e.target.value) || 0;
                            setDadosProcessados(prevDados => {
                              return prevDados.map(prod => {
                                if (prod.CodBarras === produto.CodBarras) {
                                  const novasFiliais = prod.filiais.map(fil => {
                                    if (fil.IdFilial === filial.IdFilial) {
                                      return { ...fil, qtdsugestaoalterada: novoValor };
                                    }
                                    return fil;
                                  });
                                  // Recalcula o total local
                                  const novoTotal = novasFiliais.reduce((acc, fil) => acc + parseInt(fil.qtdsugestaoalterada), 0);
                                  return { ...prod, filiais: novasFiliais, totalqtd: novoTotal };
                                }
                                return prod;
                              });
                            });
                          }}
                          onBlur={() => AlterarQtdSugestao(filial.inputId)}
                          size="2"
                          data-default-value={filial.qtdsugestao}
                          style={{
                            width: '45px',
                            textAlign: 'center',
                            border: '1px solid #ccc'
                          }}
                        />
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};