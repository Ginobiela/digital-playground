# Digital Playground

## Publicar

1. En el repositorio de GitHub, abrí **Settings → Pages → Build and deployment** y elegí **GitHub Actions**.
2. Subí el proyecto a la rama `main`. Si ya lo habías subido, ejecutá **Actions → Publicar en GitHub Pages → Run workflow**.

El flujo compila el sitio y publica `dist`. La ruta se ajusta al nombre del repositorio.

## Editar y probar

Editá los proyectos y los enlaces de contacto en `src/content.js`. El correo aparece cuando completás `contact.email`.

Con Node.js 24, ejecutá `npm ci` y `npm run dev`. Para comprobar la versión de producción, ejecutá `npm run build` y `npm run preview`.
