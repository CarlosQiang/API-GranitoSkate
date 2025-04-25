# Integración con Shopify

## Configuración en Shopify

1. Crea una aplicación privada en Shopify
2. Configura los permisos necesarios (productos, clientes, pedidos)
3. Obtén el API Key y API Secret
4. Configura las variables de entorno en tu proyecto

## Instalación del script en el tema

1. Ve a tu panel de administración de Shopify
2. Navega a Tienda online > Temas > Acciones > Editar código
3. Crea un nuevo archivo en la carpeta `assets` llamado `granito-integration.js`
4. Copia y pega el contenido del archivo `public/shopify-integration.js`
5. Añade la siguiente línea al final de tu archivo `theme.liquid`:

```liquid
<script>
  // Configura la API Key para el script de integración
  window.GRANITO_API_KEY = "{{ shop.metafields.granito.api_key }}";
</script>
{{ 'granito-integration.js' | asset_url | script_tag }}
