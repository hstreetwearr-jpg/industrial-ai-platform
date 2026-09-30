# Industrial AI Performance System

Plataforma SaaS para descubrir, medir y validar oportunidades de inteligencia artificial en operaciones industriales.

## Desarrollo local

Requisitos: Node.js 20.9 o posterior y npm.

1. Instala dependencias con `npm install`.
2. Copia `.env.example` a `.env.local` y configura `NEXT_PUBLIC_SUPABASE_ANON_KEY` con la clave publicable (anon) del proyecto Supabase. La URL del proyecto ya está precargada.
3. Ejecuta `npm run dev` y abre `http://localhost:3000`.
4. Ejecuta `npm run build` para validar la compilación de producción.

No uses una clave `service_role` en el navegador ni en variables `NEXT_PUBLIC_*`.

## Contrato de datos Supabase

La aplicación usa las tablas `organizations`, `profiles`, `opportunities`, `evidence_ledger`, `economic_validations` y `pilots`. Las consultas esperan `profiles.id` igual al ID de `auth.users`, y `profiles.organization_id` para vincular al usuario con su organización.

Las inserciones de registro esperan `organizations.name`, `organizations.created_by` y los campos `profiles.id`, `profiles.organization_id`, `profiles.full_name` y `profiles.role`. Para `opportunities` se usan `organization_id`, `created_by`, `title`, `description`, `area`, `projected_impact_mxn`, `status`, `stage` y `created_at`. `evidence_ledger` usa `opportunity_id`, `organization_id`, `created_by`, `claim`, `evidence_type`, `content`, `verification_status` y `created_at`.

El dashboard usa `organization_id` y `status` en `pilots`; en `economic_validations` usa `organization_id`, `status` y `validated_benefit_mxn` (o `actual_benefit_mxn`). Configura políticas RLS que limiten lectura e inserción a la organización del usuario autenticado y validen `created_by = auth.uid()`; los filtros de la aplicación no sustituyen las políticas de base de datos. Las policies deben permitir al nuevo usuario crear su organización y su perfil.

Las cuentas con confirmación de correo completan la creación de su organización al iniciar sesión después de verificar el correo.
