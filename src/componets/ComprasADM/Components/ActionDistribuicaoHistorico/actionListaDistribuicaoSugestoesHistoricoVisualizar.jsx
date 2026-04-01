import { Fragment, useRef } from "react";
import './styles.css'
import './print-styles.css'
import { useReactToPrint } from "react-to-print";

export const ActionListaDistribuicaoSugestoesHistoricoVisualizar = ({ 
  dadosSugestoesHistorico, 
  IdRadioResumoPedido 
}) => {
  const dataTableRef = useRef();
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

    // ✅ 1. Extrai filiais do primeiro registro
    const filiais = respostaListaDistribuicaoCompras[0]?.Filiais || [];
    
    // ✅ 2. Processa cada produto
    const produtos = respostaListaDistribuicaoCompras.map((registro) => {
      let totalqtd = 0;
      const filiaisProcessadas = [];

      // ✅ 3. Para cada filial, calcula quantidade
      registro.Filiais.forEach((retfilialsugerida) => {
        let qtdsugestao = 0;
        let iddistribuicaocompras = 0;
        let qtdsugestaoalterada = 0;
        const idfilial = retfilialsugerida.IdFilial;

        // ✅ 4. Busca sugestão para a filial
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
          qtdsugestaoalterada
        });

        totalqtd += parseInt(qtdsugestaoalterada);
      });

      return {
        DescProduto: registro.DescProduto,
        PrecoVenda: registro.PrecoVenda,
        QtdGrade: registro.QtdGrade,
        Grade: registro.Grade,
        CodBarras: registro.CodBarras,
        totalqtd,
        filiais: filiaisProcessadas
      };
    });

    return { produtos, filiais };
  };

  const { produtos, filiais } = processarDadosParaTabela(dadosSugestoesHistorico);

  if (produtos.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div>
        <button
          className="btn btn-primary mb-3 hidden-print"
          onClick={handlePrint}
        >
          Imprimir
        </button> 
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
            
            {produtos.map((produto, index) => (
              <tr key={index} id={`dt-basic-distribuicao-lista-${index}`}>
                <td className="td">{produto.DescProduto}</td>
                <td className="td">{produto.PrecoVenda}</td>
                <td className="td">{produto.QtdGrade}</td>
                <td className="td">{produto.Grade}</td>
                <td className="td">
                  <span id={produto.CodBarras}>{produto.totalqtd}</span>
                </td>
                
                
                {produto.filiais.map((filial) => (
                  <td key={filial.IdFilial} className="td">
                    {filial.qtdsugestaoalterada}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Fragment>
  );
};