import DataTable from "@/app/components/DataTable"

export default function HomeBlocksPage() {
  return (
    <DataTable
      title="Bloques de Inicio"
      endpoint="home-blocks"
      columns={[
        { key: "id", label: "ID" },
        { key: "titulo", label: "Título" },
        { key: "tipo", label: "Tipo" },
        { key: "orden", label: "Orden" },
      ]}
      createPath="/admin/home-blocks/new"
    />
  )
}
