# Documentação do compenente ActionPesquisaHome

O componente `ActionPesquisaHome` é responsável por gerenciar ações relacionadas à busca e exibição de dados de pedidos. Abaixo está uma explicação detalhada de sua lógica e funcionalidades.

## Lógica do Componente

1. **handleClick**:
   - **Propósito**: Realiza uma consulta na API para buscar dados de pedidos.
   - **Resultado**: Retorna `dadosListaPedidos` e exibe o componente `ActionListaPedidosPeriodo`.

2. **handleClickRelatorioResumido**:
   - **Propósito**: Realiza uma consulta na API para buscar dados resumidos de pedidos.
   - **Resultado**: Retorna `dadosListaPedidos` e exibe o componente `ActionPDFPedidoResumido`.

3. **handleClickRelatorioProdutosCriadosReturn**:
   - **Propósito**: Gerencia a ação de retorno para o componente `ActionPesquisaHome`.
   - **Resultado**: Retorna o controle para o componente `ActionPesquisaHome`.

4. **handleClickRelatorioDetalhado**:
   - **Propósito**: Realiza uma consulta na API para buscar dados detalhados de pedidos.
   - **Resultado**: Retorna `dadosPedidosDetalhados` e exibe o componente `ActionPDFPedidoDetalhado`.

5. **handleClickRelatorioProdutosCriados**:
   - **Propósito**: Realiza uma consulta na API para buscar dados de produtos criados.
   - **Resultado**: Retorna `dadosListaProdutosCriados` e exibe o componente `ActionListaProdutosCriados`.

## Interações do Componente

- **Chamadas de API**: Cada função de manipulação é responsável por realizar chamadas específicas à API para obter dados.
- **Exibição de Dados**: Com base nos dados obtidos, diferentes componentes são renderizados para exibir as informações.
- **Ações do Usuário**: Interações do usuário, como cliques em botões, acionam essas funções de manipulação para executar suas respectivas tarefas.

# Uso

Este componente é utilizado dentro do contexto mais amplo da aplicação para gerenciar e exibir dados relacionados a pedidos de forma eficiente. Ele fornece uma interface de usuário para interagir com dados de pedidos, gerar relatórios e visualizar informações detalhadas.

## Melhorias Futuras

- Considere adicionar tratamento de erros para as chamadas de API para melhorar a experiência do usuário.
- Implemente indicadores de carregamento para informar os usuários sobre processos de recuperação de dados em andamento.

