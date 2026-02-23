# Documentação do compenente ActionListaPedidosPeriodo


## Lógica do Componente

1. **handleClickVisualizarPedido**:
   - **Propósito**: Realiza uma consulta na API para buscar dadosVisualizarPedido e dadosDetalhePedido.
   - **Resultado**: Retorna `dadosVisualizarPedido dadosDetalhePedidos` e exibe o componente `ActionNovoPedido`.

2. **handleClickEnviarComprasADM ButtonTable Enviar Compras Adm para Cancelar**:
   - **Propósito**: Realiza uma alteração na API  useEnviarPedidoComprasADM 
   - **Resultado**: Envia `os dados para o compras adm` 

3. **handleClickEnviarCompras no ButtonTable Enviar Compras para Ajuste**:
   - **Propósito**: Realiza uma alteração na API  useEnviarPedidoCompras 
   - **Resultado**: Envia `os dados para o compras` 

4. **handleClickImprimir ButtonTable Imprimir Pedido Com Preço de Venda**:
   - **Propósito**: Realiza uma consulta na API para buscar dadosVisualizarPedido e dadosDetalhePedido.
   - **Resultado**: Retorna `dadosPedidoSemPreco dadosDetalhePedidos` e exibe o componente `ActionPDFPedido `.

5. **handleClickImprimirSempreco ButtonTable Imprimir Pedido Sem Preço de Venda**:
   - **Propósito**: Realiza uma consulta na API para buscar dadosVisualizarPedido e dadosDetalhePedido.
   - **Resultado**: Retorna `dadosPedidoSemPreco dadosDetalhePedidos` e exibe o componente `ActionPDFPedidoSemPreco `.

6. **handleClickReceberPedido ButtonTable Recepção de Mercadoria do Pedido**:
   - **Propósito**: Realiza uma consulta na API para buscar dadosReceberPedido e verificarExistenciaNF pelo IDPEDIDO.
   - **Resultado**: Retorna `dadosPedidoSemPreco dadosDetalhePedidos` e exibe o componente `ActionPDFPedidoSemPreco `.

7. **handleClickMigrarPedido no ButtonTable Migrar Pedido SAP**:
   - **Propósito**: Realiza uma consulta na API para buscar dadosDetalheProdutoPedido.
   - **Propósito**: Realiza uma alteração na API  useMigrarPedidoSap 
   - **Resultado**: Envia `os dados para o sap