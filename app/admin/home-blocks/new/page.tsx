import DataForm from "@/app/components/DataForm"

export default function NewHomeBlockPage() {
  return (
    <DataForm
      title="Nuevo Bloque de Inicio"
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
      returnPath="/admin/home-blocks"
    />
  )
}
