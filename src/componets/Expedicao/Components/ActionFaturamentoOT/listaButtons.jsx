import { Fragment } from "react"
import { ButtonType } from "../../../Buttons/ButtonType"
import { FaTruckFast } from "react-icons/fa6"
import { GrDocumentDownload } from "react-icons/gr"
import { FcProcess } from "react-icons/fc"
import { MdFormatListBulleted } from "react-icons/md"
import Swal from "sweetalert2"
import JSZip from "jszip";


export const ListaButtons = ({dados}) => {
    const baixarPDFs = async (dados) => {
          let pdfDataArray = [];
          let nomeArquivos = [];
      
          try {
            for (const url of dados) {
              const response = await fetch('https://cors-anywhere.herokuapp.com/' + url);
              const pdfData = await response.arrayBuffer();
              pdfDataArray.push(pdfData);
      
              // Extrair nome do arquivo da URL
              const nomeArquivo = url.substring(url.lastIndexOf("/") + 1);
              nomeArquivos.push(nomeArquivo);
            }
      
            return [pdfDataArray, nomeArquivos];
          } catch (error) {
            console.error("Erro ao baixar os arquivos PDF:", error);
            throw error;
          }
        };
      
        // Função para comprimir os PDFs em ZIP
        const comprimirPDFs = async (pdfDataArray, nomeArquivos) => {
          try {
            const zip = new JSZip();
            for (let i = 0; i < pdfDataArray.length; i++) {
              zip.file(nomeArquivos[i], pdfDataArray[i]);
            }
            const zipData = await zip.generateAsync({ type: "blob" });
            return zipData;
          } catch (error) {
            console.error("Erro ao comprimir os arquivos PDF:", error);
            throw error;
          }
        };
      
        // Função para fazer o download do ZIP
        const baixarArquivoZIP = (zipData) => {
          try {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(zipData);
            link.download = "download_notasfiscais.zip";
            link.click();
          } catch (error) {
            console.error("Erro ao baixar o arquivo ZIP:", error);
            throw error;
          }
        };
      
        // Função principal para baixar as notas fiscais
        const downloadNFE = async () => {
          try {
            if (dadosSelecionados.length === 0) {
              Swal.fire("Atenção", "Nenhuma nota foi selecionada!", "warning");
              return;
            }
      
            const [pdfDataArray, nomeArquivos] = await baixarPDFs(dadosSelecionados);
            const zipData = await comprimirPDFs(pdfDataArray, nomeArquivos);
            baixarArquivoZIP(zipData);
          } catch (error) {
            Swal.fire("Erro", "Ocorreu um erro ao baixar as notas fiscais.", "error");
          }
        };
      
        // Exemplo para seleção de dados (substituir lógica de seleção conforme necessidade)
        const handleSelecionarDados = (CHAVESEFAZ) => {
          const mockDados = [
            `http://164.152.244.96:3000/files/NFe${CHAVESEFAZ}.pdf`,
            `http://164.152.244.96:3000/files/NFe${CHAVESEFAZ}.pdf`,
          ];
          setDadosSelecionados(mockDados);
          Swal.fire("Notas Selecionadas", "As notas foram selecionadas com sucesso!", "success");
        };

    return (
        <Fragment>
            <div className="row mb-4 " style={{ marginTop: '1rem' }}>

                <ButtonType
                    Icon={MdFormatListBulleted}
                    iconSize="16px"
                    textButton="Selecionar Registros"
                    cor="primary"
                    tipo="button"
                    onClickButtonType={selecionarRegistros}
                />
                <ButtonType
                    Icon={FcProcess}
                    iconSize="16px"
                    textButton="Processar Faturamento"
                    cor="warning"
                    tipo="button"
                    onClickButtonType={""}
                />
                <ButtonType
                    Icon={FcProcess}
                    iconSize="16px"
                    textButton="Processar SEFAZ"
                    cor="info"
                    tipo="button"
                    onClickButtonType={""}
                />
                <ButtonType
                    Icon={GrDocumentDownload}
                    iconSize="16px"
                    textButton="Download Notas"
                    cor="danger"
                    tipo="button"
                    onClickButtonType={""}
                />
                <ButtonType
                    Icon={FaTruckFast}
                    iconSize="16px"
                    textButton="Conhecimento Entrega"
                    cor="danger"
                    tipo="button"
                    onClickButtonType={""}
                />
            </div>
        </Fragment>
    )
}