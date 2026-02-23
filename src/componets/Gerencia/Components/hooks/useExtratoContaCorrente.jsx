import { formatMoeda } from "../../../../utils/formatMoeda";
import { toFloat } from "../../../../utils/toFloat";

export const useExtratoContaCorrente = ({dadosExtratoLojaPeriodo}) => {
    const dados = Array.isArray(dadosExtratoLojaPeriodo) ? dadosExtratoLojaPeriodo.map((item) => {
        let saldoAnterior = 0
        const saldoAnterior2 = toFloat(item.primeiraVendaSaldo.SALDO) + toFloat(item.primeiraVendaSaldo.TOTALQUEBRA);
        const saldoAnteriorVendas = saldoAnterior2 + toFloat(item.venda.VRRECDINHEIRO)
        const totalFaturas = item.totalFaturas.reduce((acc, fatura) => {
            return acc + toFloat(fatura.VRRECEBIDO);
        }, 0);
        const saldoAnteriorFaturas = toFloat(saldoAnteriorVendas) + totalFaturas;

        const totalDespesas = item.despesas.reduce((acc, despesa) => {
            return acc + toFloat(despesa.VRDESPESA);
        }, 0);
        const saldoAnteriorDespesas = toFloat(saldoAnteriorFaturas)  - totalDespesas;
        const saldoAnteriorAdiantamentos = toFloat(saldoAnteriorDespesas) - toFloat(item.adiantamentos.VRVALORDESCONTO)
        
        const calcularTotalDinheiroInformado = () => {
            const totalVRAJUSTDINHEIRO = item.quebracaixa.reduce((acc, quebracaixa) => {
              return acc + toFloat(quebracaixa.VRAJUSTDINHEIRO);
            }, 0);
      
            const totalVRRECDINHEIRO = item.quebracaixa.reduce((acc, quebracaixa) => {
              return acc + toFloat(quebracaixa.VRRECDINHEIRO);
            }, 0);
      
            return totalVRAJUSTDINHEIRO > 0 ? totalVRAJUSTDINHEIRO : totalVRRECDINHEIRO;
        };
        
        const totalQuebra = item.quebracaixa.reduce((acc, quebracaixa) => {
            return acc + toFloat(quebracaixa.VRFISICODINHEIRO);
        }, 0);

        const dinheiroInformado = calcularTotalDinheiroInformado()
        const totalQuebraCaixa = calcularTotalDinheiroInformado() - totalQuebra;
    
        const totalDepositos = item.totalDepositos.reduce((acc, deposito) => {
            return acc + toFloat(deposito.VRDEPOSITO);
        }, 0);
        const saldoAnteriorQuebra = toFloat(saldoAnteriorAdiantamentos) + toFloat(totalQuebraCaixa);
        const saldoAnteriorDepositos = saldoAnteriorQuebra - totalDepositos;

        const calcularSaldoExtrato = () => {
            const totalVRCREDITO = item.ajusteextrato.reduce((acc, ajuste) => {
              return acc + toFloat(ajuste.VRCREDITO);
            }, 0);
      
            const totalVRDEBITO = item.ajusteextrato.reduce((acc, ajuste) => {
              return acc + toFloat(ajuste.VRDEBITO);
            }, 0);
      
            return totalVRCREDITO - totalVRDEBITO;
        };
        const totalSaldoAnteriorExtrato = calcularSaldoExtrato();
    
        return {
    
          VRRECDINHEIRO: item.venda.VRRECDINHEIRO,
          DTHORAFECHAMENTOFORMATADA: item.venda.DTHORAFECHAMENTOFORMATADA,
    
          DTPROCESSAMENTOFORMATADA: item.totalFaturas[0]?.DTPROCESSAMENTOFORMATADA,
          VRRECEBIDO: item.totalFaturas[0]?.VRRECEBIDO,
          saldoAnteriorFaturas: toFloat(saldoAnteriorFaturas),
    
          IDAJUSTEEXTRATO: item.ajusteextrato[0]?.IDAJUSTEEXTRATO,
          DTCADASTROFORMATADA: item.ajusteextrato[0]?.DTCADASTROFORMATADA,
          VRDEBITO: item.ajusteextrato[0]?.VRDEBITO,
          VRCREDITO: item.ajusteextrato[0]?.VRCREDITO,
          HISTORICO: item.ajusteextrato[0]?.HISTORICO,
          STCANCELADO: item.ajusteextrato[0]?.STCANCELADO,
          totalSaldoAnteriorExtrato: totalSaldoAnteriorExtrato,
    
          DTDESPESAFORMATADA: item.despesas[0]?.DTDESPESAFORMATADA,
          DSHISTORIO: item.despesas[0]?.DSHISTORIO,
          DSCATEGORIA: item.despesas[0]?.DSCATEGORIA,
          VRDESPESA: item.despesas[0]?.VRDESPESA,
          DSPAGOA: item.despesas[0]?.DSPAGOA,
          saldoAnteriorDespesas,
    
          DTLANCAMENTOADIANTAMENTO: item.adiantamentos.DTLANCAMENTOADIANTAMENTO,
          NOFUNCIONARIO: item.adiantamentos.NOFUNCIONARIO,
          DSMOTIVO: item.adiantamentos.DSMOTIVO,
          VRVALORDESCONTO: item.adiantamentos.VRVALORDESCONTO,
          saldoAnteriorAdiantamentos: saldoAnteriorAdiantamentos,
    
          IDMOV: item.quebracaixa[0]?.IDMOV,
          DTMOVCAIXA: item.quebracaixa[0]?.DTMOVCAIXA,
          FUNCIONARIOMOV: item.quebracaixa[0]?.FUNCIONARIOMOV,
          VRFISICODINHEIRO: item.quebracaixa[0]?.VRFISICODINHEIRO,
          VRRECDINHEIROQUEBRA: item.quebracaixa[0]?.VRRECDINHEIRO,
          VRAJUSTDINHEIRO: item.quebracaixa[0]?.VRAJUSTDINHEIRO,
          totalQuebraCaixa: totalQuebraCaixa,
          saldoAnteriorQuebra: saldoAnteriorQuebra,
    
          IDDEPOSITOLOJA: item.totalDepositos[0]?.IDDEPOSITOLOJA,
          DTDEPOSITOFORMATADA: item.totalDepositos[0]?.DTDEPOSITOFORMATADA,
          DTMOVIMENTOCAIXAFORMATADA: item.totalDepositos[0]?.DTMOVIMENTOCAIXAFORMATADA,
          FUNCIONARIO: item.totalDepositos[0]?.FUNCIONARIO,
          VRDEPOSITO: item.totalDepositos[0]?.VRDEPOSITO,
          DSBANCO: item.totalDepositos[0]?.DSBANCO,
          STCANCELADO: item.totalDepositos[0]?.STCANCELADO,
          STCONFERIDO: item.totalDepositos[0]?.STCONFERIDO,
          NUDOCDEPOSITO: item.totalDepositos[0]?.NUDOCDEPOSITO,
          saldoAnteriorDepositos: saldoAnteriorDepositos,
    
          saldoAnteriorVendas: saldoAnteriorVendas,
          saldoAnterior2: toFloat(saldoAnterior2),
          dinheiroInformado: dinheiroInformado
        }
      }) : []
    

    return {

    }
        
    
}