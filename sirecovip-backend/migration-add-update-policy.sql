-- ========================================================================
-- MIGRACIÓN: Agregar política de UPDATE para tabla merchants
-- Fecha: 2025-12-08
-- Descripción: Permite a usuarios autenticados actualizar comerciantes
-- ========================================================================

-- PROBLEMA IDENTIFICADO:
-- El schema original solo tiene políticas para SELECT e INSERT,
-- pero NO para UPDATE. Esto causa error 404 al intentar editar comerciantes.

-- SOLUCIÓN:
-- Agregar política de UPDATE para la tabla merchants

-- Verificar políticas actuales
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command,
  qual as using_expression,
  with_check as with_check_expression
FROM pg_policies
WHERE tablename = 'merchants';

-- Agregar política de UPDATE si no existe
DO $$
BEGIN
  -- Verificar si la política ya existe
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'merchants'
    AND cmd = 'UPDATE'
  ) THEN
    -- Crear política de UPDATE
    -- Permite a usuarios autenticados actualizar cualquier comerciante
    EXECUTE 'CREATE POLICY "Enable update for authenticated users"
      ON public.merchants
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true)';

    RAISE NOTICE 'Política de UPDATE creada exitosamente para merchants';
  ELSE
    RAISE NOTICE 'Ya existe una política de UPDATE para merchants';
  END IF;
END $$;

-- Verificar que se creó correctamente
SELECT
  policyname,
  cmd as command,
  CASE
    WHEN qual = 'true'::text THEN 'Sin restricción (true)'
    ELSE qual::text
  END as using_clause,
  CASE
    WHEN with_check = 'true'::text THEN 'Sin restricción (true)'
    ELSE with_check::text
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'merchants'
AND cmd = 'UPDATE';

-- OPCIONAL: Si quieres una política más restrictiva,
-- descomenta y ejecuta esto en su lugar:
/*
-- Eliminar la política permisiva
DROP POLICY IF EXISTS "Enable update for authenticated users" ON public.merchants;

-- Crear política restrictiva: solo el usuario que registró puede editar
CREATE POLICY "Enable update for owner"
  ON public.merchants
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = registered_by)
  WITH CHECK (auth.uid() = registered_by);
*/

-- RESULTADO ESPERADO:
-- Después de ejecutar este script, los usuarios autenticados
-- podrán actualizar comerciantes sin recibir error 404
