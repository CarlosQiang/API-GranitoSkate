import DataForm from "@/app/components/DataForm"

export default function NewSkaterPage() {
  return (
    <DataForm
      title="Nuevo Skater"
      endpoint="skaters"
      fields={[
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "estilo", label: "Estilo", type: "text", required: true },
        { name: "edad", label: "Edad", type: "number", required: true },
        { name: "ciudad", label: "Ciudad", type: "text", required: true },
        { name: "pais", label: "País", type: "text", required: true },
        { name: "biografia", label: "Biografía", type: "textarea", required: true },
        { name: "logros", label: "Logros", type: "textarea", required: true },
        { name: "imagen_url", label: "URL de la imagen", type: "url", required: true },
      ]}
      returnPath="/admin/skaters"
    />
  )
}
