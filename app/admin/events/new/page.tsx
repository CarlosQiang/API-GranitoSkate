import DataForm from "@/app/components/DataForm"

export default function NewEventPage() {
  return (
    <DataForm
      title="Nuevo Evento"
      endpoint="events"
      fields={[
        { name: "titulo", label: "Título", type: "text", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea", required: true },
        { name: "fecha_inicio", label: "Fecha de inicio", type: "date", required: true },
        { name: "fecha_fin", label: "Fecha de fin", type: "date", required: true },
      ]}
      returnPath="/admin/events"
    />
  )
}
