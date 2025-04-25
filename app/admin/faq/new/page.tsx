import DataForm from "@/app/components/DataForm"

export default function NewFAQPage() {
  return (
    <DataForm
      title="Nueva Pregunta Frecuente"
      endpoint="faq"
      fields={[
        { name: "pregunta", label: "Pregunta", type: "text", required: true },
        { name: "respuesta", label: "Respuesta", type: "textarea", required: true },
      ]}
      returnPath="/admin/faq"
    />
  )
}
