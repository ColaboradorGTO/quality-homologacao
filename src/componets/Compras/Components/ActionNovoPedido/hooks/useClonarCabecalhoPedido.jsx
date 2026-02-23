import { useEffect, useState } from "react";
import axios from "axios"
import Swal from "sweetalert2";
import { get, post, put } from "../../../../../api/funcRequest";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { useQuery } from "react-query";

export const useClonarCabecalhoPedido = ({ optionsModulos, usuarioLogado }) => {
    const [ipUsuario, setIpUsuario] = useState('');
    const [idPedidoClonado, setIdPedidoClonado] = useState('');
    const [cliente, setCliente] = useState('');
    const [endereco, setEndereco] = useState('');
    const [tipoPedido, setTipoPedido] = useState('');
    const [formaPagamento, setFormaPagamento] = useState('');
    const [dataPedido, setDataPedido] = useState('');
    const [observacao, setObservacao] = useState('');

    useEffect(() => {
        const datatual = getDataAtual();
        setDataPedido(datatual);
    }, [])

    const clonarCabecalho = useCallback((pedidoOrigem) => {

        if (!pedidoOrigem) return;

        // Agora você seta cada campo manualmente
        setIdPedidoClonado(null); // sempre novo pedido
        setCliente(pedidoOrigem.cliente || "");
        setEndereco(pedidoOrigem.endereco || "");
        setTipoPedido(pedidoOrigem.tipoPedido || "");
        setFormaPagamento(pedidoOrigem.formaPagamento || "");
        setObservacao(pedidoOrigem.observacao || "");

    }, []);

    const limparCabecalho = useCallback(() => {
        setIdPedidoClonado(null);
        setCliente("");
        setEndereco("");
        setTipoPedido("");
        setFormaPagamento("");
        setDataPedido("");
        setObservacao("");
    }, []);

    return {
        // retornar os states individuais
        idPedido, setIdPedido,
        cliente, setCliente,
        endereco, setEndereco,
        tipoPedido, setTipoPedido,
        formaPagamento, setFormaPagamento,
        dataPedido, setDataPedido,
        observacao, setObservacao,

        // funções
        clonarCabecalho,
        limparCabecalho,
    };

}