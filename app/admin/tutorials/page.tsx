import DataTable from "@/app/components/DataTable"

export default function TutorialsPage() {
  return (
    <DataTable
      title="Tutoriales"
      endpoint="tutorials"
      columns={[
        { key: "id", label: "ID" },
        { key: "titulo", label: "Título" },
        { key: "nivel", label: "Nivel" },
      ]}
      createPath="/admin/tutorials/new"
    />
  )
}
