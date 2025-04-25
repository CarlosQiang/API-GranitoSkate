import DataForm from "@/app/components/DataForm"

export default function EditBannerPage({ params }: { params: { id: string } }) {
  return (
    <DataForm
      title="Editar Banner"
      endpoint="banners"
      fields={[
        { name: "titulo", label: "Título", type: "text", required: true },
        { name: "imagen_url", label: "URL de la imagen", type: "url", required: true },
        { name: "enlace", label: "Enlace", type: "text", required: true },
        { name: "orden", label: "Orden", type: "number", required: true },
      ]}
      id={params.id}
      returnPath="/admin/banners"
      isEdit={true}
    />
  )
}
