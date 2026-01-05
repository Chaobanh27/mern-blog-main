import { Editor } from '@tinymce/tinymce-react'
import { uploadMediaContentAPI } from '~/apis'

export default function DashboardEditor({ setContent, content, initialValue, draftId }) {

  return (
    <>
      <Editor
        apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
        init={{
          height: '100%',
          width: '100%',
          plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount fullscreen',
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | fullscreen',
          images_upload_handler : async (blobInfo, progress) => {
            try {
              const formData = new FormData()
              formData.append('draftId', draftId)
              formData.append('file', blobInfo.blob())

              const result = await uploadMediaContentAPI(formData)

              return result.url

            } catch (error) {
              console.log(error)
            }
          }
        }}
        initialValue={initialValue}
        value = {content}
        onEditorChange={(newValue, editor) => setContent(newValue)}


      />
    </>
  )
}