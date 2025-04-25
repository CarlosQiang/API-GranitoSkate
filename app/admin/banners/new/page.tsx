import DataForm from "@/app/components/DataForm"

export default function NewBannerPage() {
  return (
    <DataForm
      title="Nuevo Banner"
      endpoint="banners"
      fields={[
        { name: "titulo", label: "Título", type: "text", required: true },
        { name: "imagen_url", label: "URL de la imagen", type: "url", required: true },
        { name: "enlace", label: "Enlace", type: "text", required: true },
        { name: "orden", label: "Orden", type: "number", required: true },
      ]}
      returnPath="/admin/banners"
    />
  )
}
