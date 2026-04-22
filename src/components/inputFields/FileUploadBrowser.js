import Image from "next/image";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { RiCloseLine } from "react-icons/ri";
import { Input, Row } from "reactstrap";
import { ToastNotification } from "../../utils/customFunctions/ToastNotification";

const FileUploadBrowser = ({ values, setFieldValue, dispatch, ...props }) => {
    const { t } = useTranslation("common");
    const dropRef = useRef(null);

    useEffect(() => {
        dispatch && dispatch({ type: "SETBROWSERIMAGE", payload: values });
    }, [values]);

    function addFileFromFileList(newFiles) {
        const dt = new DataTransfer();
        if (!(values[props.name]?.[0] instanceof File)) return newFiles;
        const files = values[props.name] || [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            file && dt.items.add(file);
        }
        for (let i = 0; i < newFiles.length; i++) {
            const file = newFiles[i];
            file && dt.items.add(file);
        }
        return dt.files;
    }

    function removeFileFromFileList(index) {
        const dt = new DataTransfer();
        const files = values[props.name];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (index !== i) dt.items.add(file);
        }
        return dt.files;
    }

    function ImageShow(fileDetail) {
        return fileDetail ? (
            props.multiple ? (
                [...fileDetail]?.map((elem, i) => (
                    <div key={i}>
                        <div className="img-box">
                            {elem?.type?.startsWith('image/')
                                ? <Image src={elem instanceof File ? URL.createObjectURL(elem) : elem} className="img-fluid" width={100} height={100} alt="image" />
                                : <div><h4>{elem?.name}</h4><h4>{elem?.type}</h4></div>}
                            {elem instanceof File && (
                                <div className="remove-img">
                                    <RiCloseLine
                                        className="remove-icon"
                                        onClick={() => setFieldValue(props.name, removeFileFromFileList(i))}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <li>
                    <Image src={fileDetail instanceof File ? URL.createObjectURL(fileDetail) : fileDetail} className="img-fluid" width={100} height={100} alt="image" />
                    {fileDetail instanceof File && (
                        <p>
                            <RiCloseLine
                                className="remove-icon"
                                onClick={() => setFieldValue(props.name, "")}
                            />
                        </p>
                    )}
                </li>
            )
        ) : null;
    }

    const processFiles = (fileList) => {
        if (fileList.length > 5) {
            return ToastNotification('error', `You've reached 5 file maximum.`);
        }
        setFieldValue(props.name, props.multiple ? addFileFromFileList(fileList) : fileList, props.index);
    };

    const onSelect = (event) => processFiles(event.currentTarget.files);

    const handleClick = (event) => {
        const { target = {} } = event || {};
        target.value = "";
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropRef.current) dropRef.current.classList.add('drag-over');
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropRef.current) dropRef.current.classList.remove('drag-over');
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (dropRef.current) dropRef.current.classList.remove('drag-over');
        const files = e.dataTransfer.files;
        if (files?.length) processFiles(files);
    };

    return (
        <>
            <div
                ref={dropRef}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                style={{ display: 'contents' }}
            >
                <a href="#javascript" className="font-blue browse-file">
                    {t("browsefiles")}
                    <Input {...props} accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,application/zip" onChange={(event) => onSelect(event)} onClick={handleClick} />
                </a>
            </div>
            <div className={`overflow-section ${!values[props?.name]?.length > 0 ? 'd-none' : ''}`}>
                <Row xl={5} xxl={6} lg={4} md={3} xs={2} className="image-selection-list g-sm-4 g-3">
                    {values?.[props.name] && ImageShow(values?.[props.name])}
                </Row>
            </div>
        </>
    );
};

export default FileUploadBrowser;
