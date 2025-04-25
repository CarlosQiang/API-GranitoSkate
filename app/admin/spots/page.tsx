import DataTable from "@/app/components/DataTable"

export default function SpotsPage() {
  return (
    <DataTable
      title="Spots"
      endpoint="spots"
      columns={[
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "tipo", label: "Tipo" },
        { key: "ciudad", label: "Ciudad" },
      ]}
      createPath="/admin/spots/new"
    />
  )
}
