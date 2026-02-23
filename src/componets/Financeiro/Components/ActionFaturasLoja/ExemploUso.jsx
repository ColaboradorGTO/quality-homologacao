// Exemplo de como usar o componente ActionImportacaoArquivo

import React, { useState, useEffect } from 'react';
import { ActionImportacaoArquivo } from './actionImportacaoArquivo';

export const ExemploUso = () => {
    const [respostaDetFaturaReceber, setRespostaDetFaturaReceber] = useState(null);

    // Simular busca dos dados de fatura (substitua pela sua API real)
    useEffect(() => {
        const buscarDadosFatura = async () => {
            try {
                // Substitua pela sua chamada API real
                // const response = await fetch('/api/detalhes-fatura-receber');
                // const data = await response.json();
                
                // Dados de exemplo
                const dadosExemplo = {
                    data: [
                        {
                            CODEMPRESA: '001',
                            NOFANTASIA: 'Empresa Teste 1',
                            VRFATURA: 1500.00,
                            VRFATURAPIX: 500.00
                        },
                        {
                            CODEMPRESA: '002',
                            NOFANTASIA: 'Empresa Teste 2',
                            VRFATURA: 2000.00,
                            VRFATURAPIX: 0
                        }
                    ]
                };
                
                setRespostaDetFaturaReceber(dadosExemplo);
            } catch (error) {
                console.error('Erro ao buscar dados de fatura:', error);
            }
        };

        buscarDadosFatura();
    }, []);

    if (!respostaDetFaturaReceber) {
        return <div>Carregando dados...</div>;
    }

    return (
        <div>
            <ActionImportacaoArquivo 
                respostaDetFaturaReceber={respostaDetFaturaReceber}
            />
        </div>
    );
};
