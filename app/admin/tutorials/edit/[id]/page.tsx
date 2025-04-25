import DataForm from "@/app/components/DataForm"

export default function EditTutorialPage({ params }: { params: { id: string } }) {
  return (
    <DataForm
      title="Editar Tutorial"
      endpoint="tutorials"
      fields={[
        { name: "titulo", label: "Título", type: "text", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea", required: true },
        {
          name: "nivel",
          label: "Nivel",
          type: "select",
          required: true,
          options: [
            { value: "principiante", label: "Principiante" },
            { value: "intermedio", label: "Intermedio" },
            { value: "avanzado", label: "Avanzado" },
          ],
        },
        { name: "video_url", label: "URL del video", type: "url", required: true },
        { name: "imagen_url", label: "URL de la imagen", type: "url", required: true },
        { name: "contenido", label: "Contenido", type: "textarea", required: true },
      ]}
      id={params.id}
      returnPath="/admin/tutorials"
      isEdit={true}
    />
  )
}
