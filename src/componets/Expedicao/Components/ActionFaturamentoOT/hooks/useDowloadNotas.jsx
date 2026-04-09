import Swal from "sweetalert2";
import JSZip from "jszip";

export const useDowloadNotasSaida = () => {

  const baixarPDFs = async (urls) => {
    const pdfDataArray = [];
    const nomeArquivos = [];

    for (const url of urls) {
      const response = await fetch(url);
      const pdfData = await response.arrayBuffer();

      pdfDataArray.push(pdfData);

      const nomeArquivo = url.substring(url.lastIndexOf("/") + 1);
      nomeArquivos.push(nomeArquivo);
    }

    return [pdfDataArray, nomeArquivos];
  };

  const comprimirPDFs = async (pdfDataArray, nomeArquivos) => {
    const zip = new JSZip();

    pdfDataArray.forEach((pdf, index) => {
      zip.file(nomeArquivos[index], pdf);
    });

    return await zip.generateAsync({ type: "blob" });
  };


  const baixarArquivoZIP = (zipData) => {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipData);
    link.download = "notas_fiscais.zip";
    link.click();
  };


  const downloadNFE = async (selectedRows, selectedIds) => {
    console.log(selectedRows, "ROW");
    try {
      if (!selectedRows || selectedRows.length === 0) {
        Swal.fire({
          title: 'Nenhuma OT Selecionada, selecione e tente novamente!',
          icon: 'info',
          confirmButtonText: 'OK'
        });
        return;
      }

      const otsSemNota = selectedRows.filter(
        (item) =>
          !item.CHAVESEFAZ ||
          item.CHAVESEFAZ === '' ||
          item.CHAVESEFAZ === null
      );

      if (otsSemNota.length > 0) {
        const listaOTs = otsSemNota.map(item => item.IDRESUMOOT).join(', ');

        Swal.fire({
          title: 'OT´s Selecionadas Não Possuem Notas Emitidas',
          html: `Lista de OT´s: (${listaOTs})`,
          icon: 'warning',
          confirmButtonText: 'OK'
        });
        return;
      }

      Swal.fire({
        title: 'Baixando notas...',
        text: 'Aguarde enquanto processamos os arquivos',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const urls = selectedRows.map(
        (item) =>
          `http://164.152.244.96:3000/files/NFe${item.CHAVESEFAZ}.pdf`
      );

      const [pdfDataArray, nomeArquivos] = await baixarPDFs(urls);
      const zipData = await comprimirPDFs(pdfDataArray, nomeArquivos);

      Swal.close();

      baixarArquivoZIP(zipData);

      Swal.fire({
        title: 'Download concluído!',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error("Erro ao baixar NFEs:", error);

      Swal.close();

      Swal.fire({
        title: 'Erro ao baixar notas',
        text: 'Tente novamente mais tarde.',
        icon: 'error'
      });
    }
  };

  return {
    downloadNFE,
  };
};

