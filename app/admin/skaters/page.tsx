import DataTable from "@/app/components/DataTable"

export default function SkatersPage() {
  return (
    <DataTable
      title="Skaters"
      endpoint="skaters"
      columns={[
        { key: "id", label: "ID" },
        { key: "nombre", label: "Nombre" },
        { key: "estilo", label: "Estilo" },
        { key: "ciudad", label: "Ciudad" },
      ]}
      createPath="/admin/skaters/new"
    />
  )
}
