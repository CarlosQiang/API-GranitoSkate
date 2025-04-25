import DataForm from "@/app/components/DataForm"

export default function EditFAQPage({ params }: { params: { id: string } }) {
  return (
    <DataForm
      title="Editar Pregunta Frecuente"
      endpoint="faq"
      fields={[
        { name: "pregunta", label: "Pregunta", type: "text", required: true },
        { name: "respuesta", label: "Respuesta", type: "textarea", required: true },
      ]}
      id={params.id}
      returnPath="/admin/faq"
      isEdit={true}
    />
  )
}
