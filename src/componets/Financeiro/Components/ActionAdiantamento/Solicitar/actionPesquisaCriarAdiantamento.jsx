import { Fragment, useEffect, useState } from "react"

export const ActionPesquisaCriarAdiantamento = ({usuarioLogado, ID }) => {
  const [tabelaVisivel, setTabelaVisivel] = useState(false);
  const [dataPesquisaInicio, setDataPesquisaInicio] = useState('');
  const [dataPesquisaFim, setDataPesquisaFim] = useState('');
  const [empresaSelecionada, setEmpresaSelecionada] = useState('');
  const [empresaSelecionadaNome, setEmpresaSelecionadaNome] = useState('');
  const [marcaSelecionada, setMarcaSelecionada] = useState('');
  const [ufSelecionado, setUfSelecionado] = useState('0')
  const [selectedItems, setSelectedItems] = useState([]);
  const [menuFilhoAtual, setMenuFilhoAtual] = useState(null);

  return (

    <Fragment>

    

    </Fragment>
  )
}