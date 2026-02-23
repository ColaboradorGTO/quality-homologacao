  ## LINK VERCEL
  https://quality-web.vercel.app/

  ## LINK HOMOLOGAÇÃO ABA PROMOÇÃO
  http://164.152.245.77:8000/quality/concentrador_homologacao/dashboardinformatica.html
 

  ## Regras Para Cadastro de Promoções:

  ## Validações iniciais de campos obrigatórios
  1.  mecânica deve ser selecionada.
  3.  se você selecionar uma Marca e Selecionar todas as empresas, será enviado para todas empresa daquela marca / bandeira especifíco.
  4.  se você selecionar todas as empresas sem selecionar nenhuma marca / bandeira o cadastro da promoção será em todas as lojas
  5.  descrição deve ter entre 20 e 200 caracteres.

  ## Validações de promoções ativas
  6. verifica se existem promoções ativas.
  7. se já existe uma promoção ativa com a mesma aplicação de destino na empresa Selecionada não será cadastrado uma nova.

  8.verifica se o produto destino já está vinculado a uma promoção ativa.
  9.se aplicação destino for por pares e já existir uma promoção ativa com a aplicação destino em um produto, não poderá cadastrar juntas.
  10.se aplicação destino for por pares ou menos na primeira, os produtos de origem e   destino devem ser iguais.   
  11.se aplicação destino for em um produto, pode ser enviado  apenas um produto e tem que ser o mesmo, tanto na origem quanto no destino.
  12.verificar se já existe uma promoção ativa com a mesma mecânica e aplicação destino.
  13.verificar se já existe uma promoção ativa com a mesma empresa e mecânica.
  14.verificar se já existem 2 promoções ativas na empresa selecionada.
  14 se aplicação destinos for por todos os produtos, os produtos origem e destino precisam ser o mesmos. 

  



# Cadastro de Promoções - Regras de Negócio

Este documento descreve as regras de negócio implementadas no hook `useCreatePromocaoAtiva` para garantir a integridade e unicidade das promoções cadastradas no sistema.

---

## 1. Validações Iniciais Obrigatórias

- **Mecânica:**  
  Deve estar selecionada.  
  Se não, exibe erro: “Selecione uma mecânica!”

- **Empresa:**  
  Deve estar selecionada (pode ser múltipla).  
  Se não, exibe erro: “Selecione uma empresa!”

- **Descrição:**  
  Deve ter entre 20 e 200 caracteres.  
  Se não, exibe erro: “Descrição deve ter entre 20 e 200 caracteres!”

---

## 2. Validação de Produtos

- **Produtos de Origem e Destino:**  
  Devem ser informados via campo ou arquivo.  
  São convertidos para array antes do envio.

---

## 3. Regras de Promoções Ativas

- **Busca promoções ativas** para a empresa e data fim.
- **Verifica se já existe aplicação de destino ativa** para a mesma empresa e aplicação (`TPAPARTIRDE`).  
  Se sim, bloqueia o cadastro.
- **Verifica se algum produto destino já está em promoção ativa.**  
  Se sim, bloqueia o cadastro.
- **Não permite cadastrar promoção por pares e em um produto ao mesmo tempo.**
- **Não permite cadastrar promoção com o mesmo tipo de desconto já ativo na empresa.**
- **Não permite mais de 3 promoções ativas na mesma empresa.**
- **Não permite mais de uma promoção ativa com aplicação destino por pares.**
- **Não permite mais de uma promoção ativa com aplicação destino menos na primeira.**

---

## 4. Regras Específicas por Aplicação de Destino

- **Por Pares ou Menos na Primeira (`aplicacaoDestinoSelecionada == 0 || 3`):**
  - Produtos de origem e destino devem ser iguais (mesmo array e ordem).
  - Se não, bloqueia o cadastro.

- **Por Todos os Produtos (`aplicacaoDestinoSelecionada == 1`):**
  - Quantidade de produtos de origem e destino deve ser igual.
  - Se não, bloqueia o cadastro.

- **Em Um Produto (`aplicacaoDestinoSelecionada == 4`):**
  - Apenas um produto na origem e no destino.
  - Produto de origem e destino deve ser o mesmo.
  - Se não, bloqueia o cadastro.

---

## 5. Conversão de Valores

- **Valor monetário (`precoProduto`):**  
  Deve ser convertido para número no padrão americano (ex: `49,99` → `49.99`) antes do envio.

---

## 6. Envio dos Dados

- Se todas as validações forem aprovadas, os dados são enviados via POST para `/criar-promocoes-ativas`.
- Exibe mensagem de sucesso ou erro conforme o resultado.

---

## Resumo

O cadastro só será realizado se:
- Todos os campos obrigatórios estiverem preenchidos corretamente.
- Não houver conflitos com promoções já ativas conforme as regras acima.
- Os produtos de origem e destino respeitarem as regras da mecânica selecionada.
- O valor monetário estiver no formato correto.

Essas regras garantem a integridade e unicidade das promoções cadastradas no sistema do PDV.


<!--  
1.produto tem que ser pesquisado por
descrição codigo de barras, idproduto
no input 

2.quando for editar promoção trazer os dados da campanha
para mesma tela de criação de campanha

3.permitir edição da mecanica no select colocar icon de editar,
para que seja possível editar a mecanica 

4.Adicionar o nome da mecanica adicionada na tabela MECANICARESUMOPROMOCAOMARKETING [X]

5.Adicionar um STATIVO na tabela RESUMOPROMOCAOMARKETING
-->
