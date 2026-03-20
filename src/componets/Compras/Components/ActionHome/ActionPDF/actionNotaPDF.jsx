import { Fragment } from "react"
import { toFloat } from "../../../../../utils/toFloat"
import { formatMoeda } from "../../../../../utils/formatMoeda"
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { ActionListaDetalhe } from "./actionListaDetalhe";

export const ActionNotaPDF = ({ dadosPedido, dadosDetalhePedido }) => {

    const styles = StyleSheet.create({
        page: { padding: 30 },
        section: { marginBottom: 10 },
        title: { fontSize: 18, marginBottom: 10 },
    });

    const stOutlet = dadosPedido?.STOUTLET === "True";
    
    const dadosArray = Array.isArray(dadosPedido) 
        ? dadosPedido 
        : [dadosPedido[0] || dadosPedido];
    
    const logosEmpresas = [
        '../img/tesoura.png',      
        '../img/magazine.png',     
        '../img/yorus.png',        
        '../img/freecenter.png', 
        '../img/outlet.png'        
    ];

    const dados = dadosArray.map((item, index) => {
        let dsTipoFretePedido = '';
        let dsTipoFiscalPedido = '';
        let dsTipoArquivoPedido = '';
        let dsTipoEnviar = '';
        let logoPedido = '';

        if (index === 0) {
            if (stOutlet) {
                logoPedido = logosEmpresas[4]; // logoOutlet
            } else {
                logoPedido = logosEmpresas[item.IDSUBGRUPOPEDIDO - 1];
            }
        }

        const objTpFrete = {
            'PAGO': 'PAGO - CIF',
            'APAGAR': 'APAGAR - FOB'
        };

        const objTpFiscal = {
            'N': 'Lucro Presumido',
            'S': 'Simples Nacional'
        };

        const objTpEnviar = {
            'NE': 'NÃO ENVIAR',
            'ET': 'ETIQUETA',
            'AR': 'ARQUIVO'
        };

        dsTipoFretePedido = objTpFrete[item.TPFRETE] || item.TPFRETE;
        dsTipoFiscalPedido = objTpFiscal[item.TPFISCAL] || 'Lucro Real';  
        dsTipoEnviar = objTpEnviar[item.TPARQUIVO] || item.TPARQUIVO;

        return {
            IDPEDIDO: item.IDPEDIDO,
            IDGRUPOPEDIDO: item.IDGRUPOPEDIDO,
            IDSUBGRUPOPEDIDO: item.IDSUBGRUPOPEDIDO,
            NOFANTASIA: item.NOFANTASIA,
            IDCOMPRADOR: item.IDCOMPRADOR,
            NOMECOMPRADOR: item.NOMECOMPRADOR,
            IDCONDICAOPAGAMENTO: item.IDCONDICAOPAGAMENTO,
            DSCONDICAOPAG: item.DSCONDICAOPAG,
            IDFORNECEDOR: item.IDFORNECEDOR,
            NOFORNECEDOR: item.NOFORNECEDOR,
            NOFANTASIAFORNECEDOR: item.NOFANTASIAFORNECEDOR,
            EEMAILFATURAMENTO: item.EEMAILFATURAMENTO,
            NUTELFATURAMENTO: item.NUTELFATURAMENTO,
            EEMAILCOBRANCA: item.EEMAILCOBRANCA,
            NUTELCOBRANCA: item.NUTELCOBRANCA,
            EEMAILFINANCEIRO: item.EEMAILFINANCEIRO,
            NUTELFINANCEIRO: item.NUTELFINANCEIRO,
            EEMAILCOMPRAS: item.EEMAILCOMPRAS,
            NUTELCOMPRAS: item.NUTELCOMPRAS,
            EEMAILCADASTRO: item.EEMAILCADASTRO,
            NUTELCADASTRO: item.NUTELCADASTRO,
            CNPJFORN: item.CNPJFORN,
            INSCESTFORN: item.INSCESTFORN,
            EMAILFORN: item.EMAILFORN,
            FONEFORN: item.FONEFORN,
            ENDFORN: item.ENDFORN,
            NUMEROFORN: item.NUMEROFORN,
            COMPFORN: item.COMPFORN,
            BAIRROFORN: item.BAIRROFORN,
            CIDADEFORN: item.CIDADEFORN,
            UFFORN: item.UFFORN,
            CEPFORN: item.CEPFORN,
            IDTRANSPORTADORA: item.IDTRANSPORTADORA,
            NOMETRANSPORTADORA: item.NOMETRANSPORTADORA,
            IDANDAMENTO: item.IDANDAMENTO,
            DSANDAMENTO: item.DSANDAMENTO,
            MODPEDIDO: item.MODPEDIDO,
            NOVENDEDOR: item.NOVENDEDOR,
            EEMAILVENDEDOR: item.EEMAILVENDEDOR,
            DTPEDIDOFORMATADA: item.DTPEDIDOFORMATADA,
            DTPEDIDO: item.DTPEDIDO,
            DTPREVENTREGAFORMATADA: item.DTPREVENTREGAFORMATADA,
            DTENTREGAFORMATADA2: item.DTENTREGAFORMATADA2,
            TPFRETE: item.TPFRETE,
            OBSPEDIDO: item.OBSPEDIDO,
            OBSPEDIDO2: item.OBSPEDIDO2,
            DTFECHAMENTOPEDIDO: item.DTFECHAMENTOPEDIDO,
            DTCADASTRO: item.DTCADASTRO,

            STDISTRIBUIDO: item.STDISTRIBUIDO,
            STAGRUPAPRODUTO: item.STAGRUPAPRODUTO,
            NUTOTALITENS: item.NUTOTALITENS,
            QTDTOTPRODUTOS: item.QTDTOTPRODUTOS,
            VRTOTALBRUTO: item.VRTOTALBRUTO,
            VRTOTALLIQUIDO: item.VRTOTALLIQUIDO,
            DESCPERC01: item.DESCPERC01,
            DESCPERC02: item.DESCPERC02,
            DESCPERC03: item.DESCPERC03,
            PERCCOMISSAO: item.PERCCOMISSAO,
            TPFISCAL: item.TPFISCAL,
            STCANCELADO: item.STCANCELADO,
            TPARQUIVO: item.TPARQUIVO,
            FABRICANTE: item.FABRICANTE,
            dsTipoFretePedido: dsTipoFretePedido,
            dsTipoFiscalPedido: dsTipoFiscalPedido,
            dsTipoArquivoPedido: dsTipoArquivoPedido,
            dsTipoEnviar: dsTipoEnviar,
            logoPedido: logoPedido
        }
    })


    if (!dados || dados.length === 0) {
        return (
            <Fragment>
                <div>Nenhum dado encontrado para exibir o pedido.</div>
            </Fragment>
        );
    }

    const dadoPrincipal = dados[0]; 

    return (
        <Fragment>
            <div style={styles.page}>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td rowspan="2" width="200" align="center" id="marcapedido">
                                <img src={dadoPrincipal?.logoPedido} style={{width: '200px', height: '100px', border: 'none'}} />
                            </td>
                            <td rowspan="2" width="200" align="center" id="tipopedido">
                                <p style={{fontSize: '1rem', margin: '0px', padding: '0px'}}> PEDIDO DE COMPRAS<br />{dadoPrincipal?.MODPEDIDO}</p>
                                <p style={{fontSize: '1rem', margin: '0px'}}>Nº: <b>{dadoPrincipal?.IDPEDIDO}</b></p></td>
                            <td align="center" id="fornecedorpedidoImprimir" style={{fontSize: '0.563rem'}}>
                                Fabricante: <br />
                                <b><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.FABRICANTE}</p></b>
                            </td>
                        </tr>
                        <tr>
                            <td id="razaofornecedorpedidoImprimir" style={{fontSize: '0.563rem'}}>
                                Razão Social Fornecedor: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.NOFORNECEDOR}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td id="infoContatoImprimir" rowspan="2" width="400" style={{fontSize: '0.563rem'}}>
                                Calçados: andre.compras@grupotesouradeouro.com.br - (61) 99697-2844 <br />Faturamento: {dadoPrincipal?.EEMAILFATURAMENTO} - {dadoPrincipal?.NUTELFATURAMENTO}<br />
                                Cobrança: {dadoPrincipal?.EEMAILCOBRANCA} - {dadoPrincipal?.NUTELCOBRANCA}<br />
                                Financeiro: {dadoPrincipal?.EEMAILFINANCEIRO} - {dadoPrincipal?.NUTELFINANCEIRO}<br />
                                Compras: {dadoPrincipal?.EEMAILCOMPRAS} - {dadoPrincipal?.NUTELCOMPRAS}<br />
                                Cadastro: {dadoPrincipal?.EEMAILCADASTRO} - {dadoPrincipal?.NUTELCADASTRO}<br />
                            </td>
                            <td id="cnpjpedidoImprimir" width="200" style={{fontSize: '0.563rem'}}>CNPJ: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.CNPJFORN}</p>
                            </td>
                            <td id="emailforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Email: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.EMAILFORN}</p>
                            </td>
                            <td id="foneforncpedidoImprimir" width="100" style={{fontSize: '0.563rem'}}>Tel: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.FONEFORN}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" width="200" id="iepedidoImprimir">INSC EST: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.INSCESTFORN}</p>
                            </td>
                            <td id="fonecelularforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Cel: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.FONEFORN}</p>
                            </td>
                        </tr>
                    </tbody>
                </table>


                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="200" id="datapedidoImprimir" style={{fontSize: '0.563rem'}}>Data do Pedido: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.DTPEDIDO}</p>
                            </td>
                            <td width="200" id="dataentregapedidoImprimir" style={{fontSize: '0.563rem'}}>Data da Entrega: <br />
                                <p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.DTPREVENTREGAFORMATADA}</p>
                            </td>
                            <td id="endforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Endereço: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.ENDFORN}</p> </td>
                            <td id="complforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Complemento: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.COMPFORN}</p> <strong></strong> </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="400" id="compradorpedidoImprimir" style={{fontSize: '0.563rem'}}>Comprador: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.NOMECOMPRADOR}</p> </td>
                            <td id="numeroforncpedidoImprimir" style={{fontSize: '0.563rem'}}>N°: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.NUMEROFORN}</p> </td>
                            <td id="bairroforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Bairro: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.BAIRROFORN}</p> </td>
                            <td id="transpforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Transportadora/Telefone: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.NOMETRANSPORTADORA} - </p> </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                        <tr>
                            <td width="400" id="vendedorpedidoImprimir" style={{fontSize: '0.563rem'}}>Vendedor: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.NOVENDEDOR}</p> </td>

                            <td width="400" id="cidadeforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Cidade: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.CIDADEFORN}s</p> </td>
                            <td id="desc1pedidoImprimir" style={{fontSize: '0.563rem'}}>Desc. I (%): <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{formatMoeda(toFloat(dadoPrincipal?.DESCPERC01))}</p> </td>
                            <td id="desc2pedidoImprimir" style={{fontSize: '0.563rem'}}>Desc. II(%): <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{formatMoeda(toFloat(dadoPrincipal?.DESCPERC02))}</p> </td>
                            <td id="desc3pedidoImprimir" style={{fontSize: '0.563rem'}}>Desc. III(%): <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{formatMoeda(toFloat(dadoPrincipal?.DESCPERC03))}</p> </td>
                        </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody><tr>
                        <td width="400" id="condpagpedidoImprimir" style={{fontSize: '0.563rem'}}>Cond. Pagamento: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.DSCONDICAOPAG}</p> </td>

                        <td id="cepforncpedidoImprimir" style={{fontSize: '0.563rem'}}>CEP: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.CEPFORN}</p> </td>
                        <td id="ufforncpedidoImprimir" style={{fontSize: '0.563rem'}}>UF: <br /><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.UFFORN}</p> </td>
                        <td id="freteforncpedidoImprimir" style={{fontSize: '0.563rem'}}>Frete: <br />
                            <p style={{fontSize: '0.813rem', margin: '0px'}}>
                                {dadoPrincipal?.dsTipoFretePedido}
                            </p> 
                        </td>
                    </tr>
                    </tbody>
                </table>

                <table width="100%" className="bordasimples">
                    <tbody>
                            <tr>    
                                <td width="400" id="obs1pedidoImprimir" style={{fontSize: '0.563rem'}}>Observações: <br/><p style={{fontSize: '0.563rem'}}>{dadoPrincipal?.OBSPEDIDO} - {dadoPrincipal?.OBSPEDIDO2} </p> </td>
                                <td id="fiscalpedidoImprimir" style={{fontSize: '0.563rem'}}>Fiscal: <br/><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.dsTipoFiscalPedido}</p> </td>
                                <td id="enviarpedidoImprimir" style={{fontSize: '0.563rem'}}>Enviar: <br/><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.dsTipoEnviar} </p> </td>               
                                <td id="tipopedidoImprimir" style={{fontSize: '0.563rem'}}>Tipo: <br/><p style={{fontSize: '0.813rem', margin: '0px'}}>{dadoPrincipal?.MODPEDIDO} </p> </td>          
                                <td id="comissaopedidoImprimir" style={{fontSize: '0.563rem'}}>Comissão: <br/><p style={{fontSize: '0.813rem', margin: '0px'}}>{formatMoeda(toFloat(dadoPrincipal?.PERCCOMISSAO))} </p> </td>
                            </tr>
                    </tbody>
                </table>

                 {/* <ActionListaDetalhe dadosDetalhePedido={dadosDetalhePedido} /> */}
            </div>
        </Fragment>
    )
}