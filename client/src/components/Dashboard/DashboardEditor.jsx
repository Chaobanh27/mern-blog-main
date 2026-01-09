import { Editor } from '@tinymce/tinymce-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { uploadMediaContentAPI } from '~/apis'
import { selectCurrentTheme } from '~/redux/theme/themeSlice'

export default function DashboardEditor({ setContent, content, initialValue, draftId }) {

  const currentTheme = useSelector(selectCurrentTheme)

  const [systemTheme, setSystemTheme] = useState( window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light')

  // theo dõi OS theme realtime
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setSystemTheme( window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light')

    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = currentTheme === 'system' ? systemTheme : currentTheme

  return (
    <>
      <Editor
        key={resolvedTheme}
        apiKey={import.meta.env.VITE_TINY_MCE_API_KEY}
        init={{
          height: '100%',
          width: '100%',
          skin: resolvedTheme == 'dark' ? 'oxide-dark' : 'oxide',
          content_css: resolvedTheme == 'dark' ? 'dark' : 'light',
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
              // eslint-disable-next-line no-console
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