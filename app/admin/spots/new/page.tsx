import DataForm from "@/app/components/DataForm"

export default function NewSpotPage() {
  return (
    <DataForm
      title="Nuevo Spot"
      endpoint="spots"
      fields={[
        { name: "nombre", label: "Nombre", type: "text", required: true },
        {
          name: "tipo",
          label: "Tipo",
          type: "select",
          required: true,
          options: [
            { value: "street", label: "Street" },
            { value: "park", label: "Park" },
            { value: "bowl", label: "Bowl" },
            { value: "vert", label: "Vert" },
          ],
        },
        { name: "ciudad", label: "Ciudad", type: "text", required: true },
        { name: "direccion", label: "Dirección", type: "text", required: true },
        { name: "descripcion", label: "Descripción", type: "textarea", required: true },
        { name: "mapa_iframe", label: "Iframe del mapa", type: "textarea", required: true },
        { name: "imagen_url", label: "URL de la imagen", type: "url", required: true },
      ]}
      returnPath="/admin/spots"
    />
  )
}
