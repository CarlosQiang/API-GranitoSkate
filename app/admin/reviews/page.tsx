import DataTable from "@/app/components/DataTable"

export default function ReviewsPage() {
  return (
    <DataTable
      title="Reseñas"
      endpoint="reviews"
      columns={[
        { key: "id", label: "ID" },
        { key: "nombre_cliente", label: "Cliente" },
        { key: "id_producto", label: "Producto" },
        { key: "valoracion", label: "Valoración" },
      ]}
      createPath="/admin/reviews/new"
    />
  )
}
