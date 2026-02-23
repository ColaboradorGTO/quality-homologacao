import Swal from "sweetalert2";
import { post } from "../../../../../api/funcRequest";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getDataAtual } from "../../../../../utils/dataAtual";
import { toFloat } from "../../../../../utils/toFloat";


export const useCadastrarPromocaoLoja = () => {
    const [dataInicio, setDataInicio] = useState('')
    const [dataFim, setDataFim] = useState('')
    const [descricao, setDescricao] = useState('')
    const [aplicacaoSelecionada, setAplicacaoSelecionada] = useState('')
    const [aplicacaoSaida, setAplicacaoSaida] = useState(0)
    const [qtdAplicacao, setQtdAplicacao] = useState(0)
    const [valor, setValor] = useState(0)
    const [valorProduto, setValorProduto] = useState(0)
    const [fatorSelecionado, setFatorSelecionado] = useState('')
    const [valorDesconto, setValorDesconto] = useState(0)
    const [percentual, setPercentual] = useState(0)
    const [usuarioLogado, setUsuarioLogado] = useState(null);
    const [ipUsuario, setIpUsuario] = useState('');

    const optionsAplicaocao = [
        { value: '1', label: 'Por QTD' },
        { value: '2', label: 'Por Valor' },
    ]

    const optionsFator = [
        { value: '0', label: 'Por Valor do Produto' },
        { value: '1', label: 'Valor de Desconto' },
        { value: '2', label: 'Por Percentual' },
    ]

    const navigate = useNavigate();

    useEffect(() => {
        const dataHoraAtual = getDataAtual()
        setDataInicio(dataHoraAtual)
        setDataFim(dataHoraAtual)
    })
    
    useEffect(() => {
        const usuarioArmazenado = localStorage.getItem('usuario');

        if (usuarioArmazenado) {
            try {
                const parsedUsuario = JSON.parse(usuarioArmazenado);
                setUsuarioLogado(parsedUsuario);;
            } catch (error) {
                console.error('Erro ao parsear o usuário do localStorage:', error);
            }
        } else {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        getIPUsuario();
    }, [usuarioLogado]);

    const getIPUsuario = async () => {
        const response = await axios.get('http://ipwho.is/')
        if (response.data) {
            setIpUsuario(response.data.ip);
        }
        return response.data;
    }

    const handleCadastrar = async () => {
        if (descricao == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Informe a Descrição da Promoção!',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (aplicacaoSelecionada == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Informe um Tipo de Aplicação de Entrada para a Promoção.!',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (aplicacaoSelecionada == '1' && qtdAplicacao < 2) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'A Aplicação para a quantidade não pode ser menor que duas unidades.',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (aplicacaoSelecionada == '2' && valor <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'A Aplicação para o valor não pode ser menor que zero',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        // if (aplicacaoSaida == '') {
        //     Swal.fire({
        //         icon: 'error',
        //         title: 'Oops...',
        //         text: 'Informe a Aplicação de Saída!',
        //         customClass: {
        //             container: 'custom-swal',
        //         },
        //         timer: 1500,
        //     })
        //     return false;
        // }

        if (fatorSelecionado == '') {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Informe um Fator para a Promoção.',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (fatorSelecionado == '0' && valorProduto <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'O valor para o Produto não pode ser menor que zero.',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (fatorSelecionado == '1' && valorDesconto <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'O valor do Desconto não pode ser menor que zero.',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        if (fatorSelecionado == '2' && percentual <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'O Percentual não pode ser menor que zero.',
                customClass: {
                    container: 'custom-swal',
                },
                timer: 1500,
            })
            return false;
        }

        const postData = [{

            DSPROMOCAOMARKETING: descricao,
            DTHORAINICIO: dataInicio,
            DTHORAFIM: dataFim,
            TPAPLICADOA: toFloat(aplicacaoSelecionada.value),
            APARTIRDEQTD: qtdAplicacao,
            APARTIRDOVLR: valor,
            TPFATORPROMO: toFloat(fatorSelecionado.value),
            FATORPROMOVLR: valorDesconto,
            FATORPROMOPERC: percentual,
            TPAPARTIRDE: aplicacaoSaida,
            VLPRECOPRODUTO: valorProduto,
            STEMPRESAPROMO: 'False',
            STDETPROMOORIGEM: 'False',
            STDETPROMODESTINO: 'False',
        }]
        try {

            const response = await post('/criar-listaPromocoes', postData)

            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Atualizado com sucesso!',
                showConfirmButton: false,
                timer: 3000,
                customClass: {
                    container: 'custom-swal',
                }
            })

            const textDados = JSON.stringify(postData)
            let textFuncao = 'COMPRASADM/CADASTRAR PROGRAMAÇÃO DE PROMOÇÕES';

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: textDados,
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)


            return responseLog.data;
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
            
            let textFuncao = 'COMPRASADM/ERRO AO CADASTRAR PROGRAMAÇÃO DE PROMOÇÕES'

            const createtLog = {
                IDFUNCIONARIO: usuarioLogado.id,
                PATHFUNCAO: textFuncao,
                DADOS: 'Erro ao criar Cadastro de Programações de Promoções',
                IP: ipUsuario
            }

            const responseLog = await post('/log-web', createtLog)


            console.error('Erro ao criar Cadastro de Progamação de Promoções:', error);
            return responseLog.data;
        }
    }


    return {
        dataInicio,
        setDataInicio,
        dataFim,
        setDataFim,
        descricao,
        setDescricao,
        aplicacaoSelecionada,
        setAplicacaoSelecionada,
        qtdAplicacao,
        setQtdAplicacao,
        valor,
        setValor,
        valorProduto,
        setValorProduto,
        fatorSelecionado,
        setFatorSelecionado,
        valorDesconto,
        setValorDesconto,
        percentual,
        setPercentual,
        aplicacaoSaida,
        setAplicacaoSaida,
        optionsAplicaocao,
        optionsFator,
        handleCadastrar
    }
}