# Explicacao do ZPL - Etiquetas de Volumes

Este arquivo documenta o ZPL montado na funcao `handlePrintZPL` do componente de etiquetas de volumes.

## Fluxo geral

1. O codigo percorre `dadosAcumuladorEtiquetas`.
2. Para cada item, concatena um bloco ZPL completo em `etiquetasZPL`.
3. Ao final, envia todas as etiquetas para impressao.
4. Depois da impressao, envia um bloco ZPL de reset (`zplResetConfiguracao`).

## Bloco de reset ao finalizar

```zpl
^XA
^MD0
~SD07
^JUS
^XZ
```

Significado:

- `^XA`: inicia um formato.
- `^MD0`: define escuridao para 0.
- `~SD07`: define densidade para 07.
- `^JUS`: grava configuracoes na impressora.
- `^XZ`: finaliza o formato.

## Bloco principal da etiqueta

### Setup inicial rapido

```zpl
^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR2,2~SD15^JUS^LRN^CI0^XZ
```

- `^XA` / `^XZ`: abre e fecha o bloco.
- `~TA000`: ajuste de tear-off/timing.
- `~JSN`: comportamento do sensor/head.
- `^LT0`: deslocamento vertical global da etiqueta.
- `^MNW`: modo de midia web (com gap).
- `^MTT`: modo transferencia termica.
- `^PON`: orientacao normal da impressao.
- `^PMN`: sem espelhamento.
- `^LH0,0`: origem em (0,0).
- `^JMA`: backfeed automatico.
- `^PR2,2`: velocidade de impressao/retorno.
- `~SD15`: densidade 15 para o bloco.
- `^JUS`: salva configuracao.
- `^LRN`: reverse print desligado.
- `^CI0`: code page padrao.

### Configuracao de pagina da etiqueta

```zpl
^XA
^MMT
^FWR
^PW800 aqui muda o tamanho vertical do background 
^LL980
^LS0
^CI28
```

- `^MMT`: modo tear-off.
- `^FWR`: rotacao de campos para orientacao R.
- `^PW700`: largura da etiqueta (dots). do background do titulo
- `^LL980`: comprimento da etiqueta (dots). do background do titulo
- `^LS0`: deslocamento horizontal global.
- `^CI28`: UTF-8 (acentos e caracteres especiais).

### Background do titulo

```zpl
^FO565,0
^GB150,1000,250^FS
```

- `^FO565,0`: posicao inicial do background.
- `^GB150,1000,250`: retangulo do background.
  - `150`: largura.
  - `1000`: altura/comprimento.
  - `250`: espessura da linha.

### Texto do titulo

```zpl
^FO550,${titulo == 'REMANEJAMENTO' ? '120' : '250'}
^FR
^CF0,75
^FD${titulo}^FS
```

- `^FO...`: posicao do titulo.
- `^FR`: inverte cores do campo (texto claro em fundo escuro).
- `^CF0,75`: fonte padrao 0 com tamanho 75.
- `^FD...^FS`: texto do campo e fechamento.

### Campos OR e OT

```zpl
^CF0,60
^FO430,20^FB480,2,1,L,0^FDOR: ${numeroOR}^FS
^FO430,520^FB480,2,1,L,0^FDOT: ${numeroOT}^FS
```

- `^CF0,60`: reduz tamanho da fonte.
- `^FB480,2,1,L,0`: bloco de texto com quebra e alinhamento.

### Campos de descricao/categoria/solicitante

```zpl
^CF0,45
^FO420,20^FDDESCRICAO: ${descricao}^FS
^FO360,20^FDCATEGORIA: ${categoria}^FS
${solicitanteSelecionado && `^FO300,20^FDSOLICITANTE: ${solicitanteSelecionado}^FS`}
```

- `^CF0,45`: fonte menor.
- O campo solicitante e condicional no JavaScript.

### Remetente e destinatario

```zpl
^FO180,20^FB980,2,1,L,0^FDREMETENTE: ${empresaOrigem}^FS
^FO80,20^FB980,2,1,L,0^FDDESTINATARIO: ${empresaDestino}^FS
```

- Usa `^FB` para limitar largura e permitir quebra em ate 2 linhas.

### Quantidade

```zpl
^CF0,40
^FO40,750^FDQTD: ${itemIndex + 1}/${quantidade}^FS
```

- Exibe pagina/total da quantidade de etiquetas do item.

### Fechamento da etiqueta

```zpl
^XZ
```

Finaliza a etiqueta atual.

## Como ajustar posicoes rapidamente

- Para mover um campo: altere os valores de `^FOx,y`.
- Para mover todo o layout: ajuste `^LT` (vertical) e `^LS` (horizontal).
- Para aumentar/reduzir area do fundo: ajuste `^GB(largura,altura,espessura)`.
- Para tamanho de texto: ajuste `^CF0,tamanho`.

## Observacao

Como a etiqueta usa `^FWR`, o sentido visual de "subir/descer" pode parecer invertido dependendo da orientacao fisica do papel na impressora. Por isso, os ajustes devem ser validados por teste fisico.

<!-- 
  ^XA~TA000~JSN^LT0^MNW^MTT^PON^PMN^LH0,0^JMA^PR2,2~SD15^JUS^LRN^CI0^XZ
  ^XA
  ^MMT
  ^FWR
  ^PW700
  ^LL980
  ^LS0
  ^CI28
  ^FO560,-20
  ^GB150,1200,250^FS
  ^FO600, REMANEJAMENTO 
  ^FB1100,1,0,C,0
  ^FR
  ^CF0,100
  ^FD titulo ^FS
  ^CF0,60
  ^FO430,20^FB480,2,1,L,0^FDOR: ^FS
  ^FO430,520^FB480,2,1,L,0^FDOT: ^FS
  ^CF0,45
  ^FO420,20^FDDESCRICAO: TESTE CD ^FS
  ^FO360,20^FDCATEGORIA: TESTE ^FS
  ^FO300,20^FDSOLICITANTE: ^FS
  ^FO180,20^FB980,2,1,L,0^FDREMETENTE: 0001 - TO - Recanto 1 Matriz ^FS
  ^FO80,20^FB980,2,1,L,0^FDDESTINATÁRIO: 0101 - TO - CD (DEPÓSITO) ^FS
  ^CF0,40
  ^FO40,750^FDQTD: 1/1 ^FS
  ^XZ      

  Visualizar etiqueta 
  https://zplprinter.azurewebsites.net/
  https://labelary.com/viewer.html
 -->


 