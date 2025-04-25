import DataTable from "@/app/components/DataTable"

export default function EventsPage() {
  return (
    <DataTable
      title="Eventos"
      endpoint="events"
      columns={[
        { key: "id", label: "ID" },
        { key: "titulo", label: "Título" },
        { key: "fecha_inicio", label: "Fecha de inicio" },
        { key: "fecha_fin", label: "Fecha de fin" },
      ]}
      createPath="/admin/events/new"
    />
  )
}
