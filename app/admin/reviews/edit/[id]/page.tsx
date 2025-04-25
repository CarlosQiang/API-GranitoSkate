import DataForm from "@/app/components/DataForm"

export default function EditReviewPage({ params }: { params: { id: string } }) {
  return (
    <DataForm
      title="Editar Reseña"
      endpoint="reviews"
      fields={[
        { name: "nombre_cliente", label: "Nombre del cliente", type: "text", required: true },
        { name: "id_producto", label: "ID del producto", type: "text", required: true },
        { name: "valoracion", label: "Valoración (1-5)", type: "number", required: true, min: 1, max: 5 },
        { name: "comentario", label: "Comentario", type: "textarea", required: true },
        { name: "fecha_creacion", label: "Fecha de creación", type: "date", required: true },
      ]}
      id={params.id}
      returnPath="/admin/reviews"
      isEdit={true}
    />
  )
}
