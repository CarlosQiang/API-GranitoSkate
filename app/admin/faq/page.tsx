import DataTable from "@/app/components/DataTable"

export default function FAQPage() {
  return (
    <DataTable
      title="Preguntas Frecuentes"
      endpoint="faq"
      columns={[
        { key: "id", label: "ID" },
        { key: "pregunta", label: "Pregunta" },
      ]}
      createPath="/admin/faq/new"
    />
  )
}
