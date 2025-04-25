import DataForm from "@/app/components/DataForm"

export default function EditHomeBlockPage({ params }: { params: { id: string } }) {
  return (
    <DataForm
      title="Editar Bloque de Inicio"
      endpoint="home-blocks"
      fields={[
        { name: "titulo", label: "Título", type: "text", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea", required: true },
        {
          name: "tipo",
          label: "Tipo",
          type: "select",
          required: true,
          options: [
            { value: "productos", label: "Productos" },
            { value: "equipo", label: "Equipo" },
            { value: "tutoriales", label: "Tutoriales" },
            { value: "spots", label: "Spots" },
            { value: "testimonios", label: "Testimonios" },
          ],
        },
        { name: "contenido", label: "Contenido (JSON)", type: "json", required: true },
        { name: "orden", label: "Orden", type: "number", required: true },
      ]}
      id={params.id}
      returnPath="/admin/home-blocks"
      isEdit={true}
    />
  )
}
