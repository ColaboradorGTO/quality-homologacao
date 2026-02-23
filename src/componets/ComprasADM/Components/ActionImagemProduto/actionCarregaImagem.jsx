import React, { useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { FaRegImages } from 'react-icons/fa';
import { AiOutlineCloseCircle, AiOutlineCloudUpload } from 'react-icons/ai';
import { IoMdCloseCircleOutline } from 'react-icons/io';
import { ButtonType } from '../../../Buttons/ButtonType';
import { Button } from 'primereact/button';

export const ActionCarregaImagem = () => {
  const toast = useRef(null);
  const [totalSize, setTotalSize] = useState(0);
  const fileUploadRef = useRef(null);

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    let files = e.files;

    Object.keys(files).forEach((key) => {
      _totalSize += files[key].size || 0;
    });

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  };

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" style={{ marginRight: '1rem'}} />
        <Button 
          type="button" 
          icon={<AiOutlineCloseCircle size={25}/>} 
          className="p-button-outlined p-button-rounded p-button-danger ml-auto" 
          onClick={() => onTemplateRemove(file, props.onRemove)} 
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column" style={{ width: '100%', height: '100%', textAlign: 'center' }}>
        <FaRegImages size={200} className="pi pi-image mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: '#f9fafb', color: '#e5e7eb' }}></FaRegImages>
        <p style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
          Selecione os Produtos para a Imagem
        </p>
      </div>
    );
  };

  const chooseOptions = { icon:  <FaRegImages size={25} />,  label: 'Selecionar', className: 'custom-choose-btn p-button p-button-outlined',};
  const uploadOptions = { icon: <AiOutlineCloudUpload size={25}/>, label: 'Enviar', className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: <AiOutlineCloseCircle size={25}/>, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined', label: 'Limpar', };

  return (
    <div className="panel">

      <div style={{backgroundColor: 'panel-hdr', container: 'custom-swal',}}>
        <Toast ref={toast}></Toast>


          <Tooltip target=".custom-choose-btn" content="Selecionar Imagem" position="top"  />
          <Tooltip target=".custom-upload-btn" content="Enviar Imagens" position="top" />
          <Tooltip target=".custom-cancel-btn" content="Limpar" position="right" />

        <FileUpload 
            ref={fileUploadRef} 
            name="demo[]" 
            url="/api/upload" 
            multiple 
            accept="image/*" 
            maxFileSize={1000000}
            onUpload={onTemplateUpload} 
            onSelect={onTemplateSelect} 
            onError={onTemplateClear} 
            onClear={onTemplateClear}
            headerTemplate={headerTemplate} 
            itemTemplate={itemTemplate} 
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions} 
            uploadOptions={uploadOptions} 
            cancelOptions={cancelOptions} 
          
          />
      </div>
    </div>


  )
}