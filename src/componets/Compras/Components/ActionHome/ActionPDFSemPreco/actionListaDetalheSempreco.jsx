import { Fragment, useMemo } from "react"
import { toFloat } from "../../../../../utils/toFloat";
import { formatMoeda } from "../../../../../utils/formatMoeda";

export const ActionListaDetalheSempreco = ({ dadosDetalhePedido }) => {

  // Função para processar todos os tamanhos da grade
  const processarGradeCompleta = (detalhegrade) => {
    if (!detalhegrade || !Array.isArray(detalhegrade)) return '';
    
    const tablegrade = detalhegrade.map(({ DSTAMANHO, INDICETAMANHO }) => 
      `<div style="display: inline-block; text-align: center; margin: 0 2px; font-size: 8px; width: 4.5%; font-family: 'Verdana, sans-serif';">
        ${DSTAMANHO}<br/><b>${INDICETAMANHO}</b>
      </div>`
    ).join('');
    
    return tablegrade;
  };

  // Processar e agrupar dados
  const { dadosAgrupados, totalGeral } = useMemo(() => {
    const grupos = {};
    let totalVrGeral = 0;
    let totalQtdGeral = 0;
    let contadorGeral = 0;

    dadosDetalhePedido.forEach((item) => {
      const detpedido = item.detpedido;
      const detalhegrade = item.detalhegrade;
      
      // Criar chave do grupo (igual ao jQuery)
      const grupoChave = `${detpedido?.DSGRUPOESTRUTURA} / ${detpedido?.DSSUBGRUPOESTRUTURA}`;
      
      // Determinar tipo de tecido/caixa (igual ao jQuery)
      const TpModPedido = detpedido?.DSCATEGORIAPEDIDO; // ou usar um valor fixo como no jQuery
      const txtCxTec = TpModPedido === 'CALCADOS' ? 'Caixas' : 'Tecido';
      const DadosCxTecido = TpModPedido === 'CALCADOS' ? 
        Math.round(detpedido?.NUCAIXA || 0) : 
        detpedido?.DSTIPOTECIDO;

      contadorGeral++;
      const vrTotal = toFloat(detpedido?.VRTOTALDETALHEPEDIDO);
      const qtdTotal = toFloat(detpedido?.QTDTOTAL);

      // Acumular totais gerais
      totalVrGeral += vrTotal;
      totalQtdGeral += qtdTotal;

      // Inicializar grupo se não existir
      if (!grupos[grupoChave]) {
        grupos[grupoChave] = {
          nome: grupoChave,
          itens: [],
          subtotalVr: 0,
          subtotalQtd: 0
        };
      }

      // Adicionar item ao grupo
      const itemProcessado = {
        contador: contadorGeral,
        QTDTOTAL: qtdTotal,
        DSSIGLA: detpedido?.DSSIGLA,
        NUREF: detpedido?.NUREF,
        DSPRODUTO: detpedido?.DSPRODUTO,
        DSCOR: detpedido?.DSCOR,
        DSLOCALEXPOSICAO: detpedido?.DSLOCALEXPOSICAO,
        DSESTILO: detpedido?.DSESTILO,
        STREDESOCIAL: detpedido?.STREDESOCIAL === 'True' ? 'SIM' : 'NÃO', // CORRIGIDO: usar STREDESOCIAL
        OBSPRODUTO: detpedido?.OBSPRODUTO,
        VRUNITLIQDETALHEPEDIDO: toFloat(detpedido?.VRUNITLIQDETALHEPEDIDO),
        VRTOTALDETALHEPEDIDO: vrTotal,
        DadosCxTecido,
        txtCxTec,
        gradeCompleta: processarGradeCompleta(detalhegrade), // CORRIGIDO: processar toda a grade
        grupoChave
      };

      grupos[grupoChave].itens.push(itemProcessado);
      grupos[grupoChave].subtotalVr += vrTotal;
      grupos[grupoChave].subtotalQtd += qtdTotal;
    });

    return {
      dadosAgrupados: Object.values(grupos),
      totalGeral: { totalVrGeral, totalQtdGeral }
    };
  }, [dadosDetalhePedido]);

  return (
    <Fragment>
      <div className="mt-4" style={{ fontFamily: 'Verdana, sans-serif' }}>
        <table
          id="dt-basic-detalhe-pedido-grade"
          className="bordasimples tbprint dataTable no-footer"
          role="grid"
          style={{ width: "100%", fontFamily: 'Verdana, sans-serif' }}
        >
          <thead>
            <tr role="row">
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                #
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Qtd</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Unid</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Referência</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Descrição</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Tecido</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Cor</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Local Exp</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px", fontFamily: 'Verdana, sans-serif' }} rowSpan="1" colSpan="1">
                <b>Estilo</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px" }} rowSpan="1" colSpan="1">
                <b>R. Social</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px" }} rowSpan="1" colSpan="1">
                <b>Obs</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px" }} rowSpan="1" colSpan="1">
                <b>Grade</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px" }} rowSpan="1" colSpan="1">
                <b>Vr Unit</b>
              </th>
              <th className="sorting_disabled text-center" style={{ border: "solid 1px #000", width: "0px", textAlign: "center", fontSize: "12px", fontWeight: 700, color: "#666", lineHeight: "18px" }} rowSpan="1" colSpan="1">
                <b>Total</b>
              </th>
            </tr>
          </thead>

          <tbody style={{}}>
            {dadosAgrupados.map((grupo, grupoIndex) => (
              <Fragment key={grupoIndex}>
                {/* Header do Grupo */}
                <tr className="group">
                  <td colSpan="14" style={{ textAlign: "left", backgroundColor: "#f8f9fa", fontFamily: 'Verdana, sans-serif' }}>
                    <label style={{ color: "blue", fontSize: "12px", lineHeight: "18px", fontWeight: 500, fontFamily: 'Verdana, sans-serif' }}>
                      <strong>{grupo.nome}</strong>
                    </label>
                  </td>
                </tr>

                {/* Itens do Grupo */}
                {grupo.itens.map((item, itemIndex) => (
                  <tr 
                    key={itemIndex} 
                    role="row" 
                    className={itemIndex % 2 === 0 ? "even" : "odd"}
                  >
                    <td className="text-center" style={{ border: "solid 1px #000", fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif' }}>{item.contador}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.QTDTOTAL}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DSSIGLA}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.NUREF}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DSPRODUTO}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DadosCxTecido}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DSCOR}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DSLOCALEXPOSICAO}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.DSESTILO}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.STREDESOCIAL}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{item.OBSPRODUTO}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>
                      <div dangerouslySetInnerHTML={{ __html: item.gradeCompleta }} />
                    </td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{formatMoeda(item.VRUNITLIQDETALHEPEDIDO)}</td>
                    <td className="text-center" style={{ border: "solid 1px #000",fontSize: "9px", lineHeight: "13px", color: "#666", fontFamily: 'Verdana, sans-serif'  }}>{formatMoeda(item.VRTOTALDETALHEPEDIDO)}</td>
                  </tr>
                ))}

                {/* Subtotal do Grupo */}
                {/* <tr className="group">
                  <td colSpan="14" style={{ textAlign: "right", backgroundColor: "#e9ecef" }}>
                    <label style={{ color: "blue", fontSize: "12px" }}>
                      <strong>{formatMoeda(grupo.subtotalVr)}</strong>
                    </label>
                  </td>
                </tr> */}
              </Fragment>
            ))}
          </tbody>

          {/* Total Geral */}
          <tbody >
            <tr >
              <td 
                className="pr-2" 
                align="center" 
                style={{
                  fontWeight: 700, 
                  color: "#666", 
                  border: "solid 1px #000", 
                  textAlign: "end", 
                  fontSize: "10px",
                  lineHeight: "15px",
                  fontFamily: 'Verdana, sans-serif'
                }}
                colSpan={1}
              >
                Qtd Total 
              </td>
              <td 
                align="center" 
                style={{
                  fontWeight: 700, 
                  color: "#666", 
                  border: "solid 1px #000", 
                  textAlign: "end", 
                  fontSize: "10px",
                  lineHeight: "15px",
                  fontFamily: 'Verdana, sans-serif'
                }}
                colSpan={2}
              >
                <b>{Math.round(totalGeral.totalQtdGeral)}</b>
              </td>
              <td 
                className="pr-2" 
                align="center"
                style={{
                  fontWeight: 700, 
                  color: "#666", 
                  border: "solid 1px #000", 
                  textAlign: "end", 
                  fontSize: "10px",
                  lineHeight: "15px",
                  fontFamily: 'Verdana, sans-serif'
                }}
                colSpan={10}
              >
                <p><b>Valor Total </b></p>
              </td>
              <td 
                align="center" 
                style={{
                  fontWeight: 700, 
                  color: "#666", 
                  border: "solid 1px #000", 
                  textAlign: "end", 
                  fontSize: "10px",
                  lineHeight: "15px",
                  fontFamily: 'Verdana, sans-serif'
                }}
                colSpan={1}
              >
                {formatMoeda(totalGeral.totalVrGeral)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Fragment>
  )
}