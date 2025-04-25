import DataTable from "@/app/components/DataTable"

export default function BannersPage() {
  return (
    <DataTable
      title="Banners"
      endpoint="banners"
      columns={[
        { key: "id", label: "ID" },
        { key: "titulo", label: "Título" },
        { key: "orden", label: "Orden" },
      ]}
      createPath="/admin/banners/new"
    />
  )
}
