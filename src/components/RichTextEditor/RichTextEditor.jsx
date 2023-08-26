import React, { useImperativeHandle, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
// import { Editor as IEditor } from "tinymce";
// import { UploadImageModal } from './components/UploadImageModal';
// import { Button } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';
// import { $url } from 'utils/url';

let editorRef = null;

// interface IRichTextEditor {
//   onChange: (content: string) => void;
//   onInit: () => void;
//   inputHeight?: number;
// }

export const RichTextEditor = React.forwardRef(({ onChange, onInit, inputHeight = 500 }, ref) => {
    const [initValue, setInitValue] = useState('');
    useImperativeHandle(ref, () => ({
        setContent: (content) => {
            editorRef?.setContent(content);
            setInitValue(content);
        },
    }));

    // const [visibleUploadModal, setVisibleUploadModal] = useState(false);

    return (
        <>
            {/* <div style={{ textAlign: 'right', marginBottom: 12 }}>
                <Button icon={<UploadOutlined />} onClick={() => setVisibleUploadModal(true)} type="primary">
                    Upload ảnh
                </Button>
            </div> */}

            <Editor
                // apiKey="qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc"
                apiKey="tv0oqxnll9j8nbiqw57qecc1em1vc3v0pza5o3q9a0k7mben"
                onInit={(evt, editor) => {
                    editorRef = editor;
                    onInit?.();
                }}
                onEditorChange={(val) => {
                    onChange(val);
                }}
                initialValue={initValue}
                // init={{
                //     entity_encoding: 'numeric',
                //     height: inputHeight,
                //     menubar: false,
                //     convert_urls: true,
                //     relative_urls: false,
                //     remove_script_host: false,
                //     plugins: [
                //         'advlist autolink lists link image charmap print preview anchor',
                //         'searchreplace visualblocks code fullscreen',
                //         'insertdatetime media table paste code help wordcount emoticons',
                //         'Enhanced Image',
                //     ],
                //     toolbar:
                //         'undo redo | formatselect | image emoticons | ' +
                //         'bold italic backcolor | alignleft aligncenter ' +
                //         'alignright alignjustify | forecolor fontsizeselect | bullist numlist outdent indent | ' +
                //         'removeformat | help',
                //     content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                //     fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt 48pt',
                // }}
            />
            {/* {visibleUploadModal && (
                <UploadImageModal
                    onClose={() => setVisibleUploadModal(false)}
                    onSubmitOk={(path) => {
                        setVisibleUploadModal(false);
                        editorRef.insertContent(`<img src="${$url(path)}"/>`);
                    }}
                    visible={visibleUploadModal}
                />
            )} */}
            {/* `<figure><img src="${path}"/><figcaption>${desc}</figcaption></figure><p></p>` */}
        </>
    );
});
