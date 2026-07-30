-- Productos de ejemplo para probar el catalogo antes de cargar el stock real.
-- imagen_url queda en null: las fotos reales se suben desde /admin.
insert into public.productos
  (nombre, descripcion_corta, categoria, subcategoria, estado, precio, destacado, tonos, orden_display)
values
  ('Aros Argolla Finas', 'Argollas livianas de uso diario, cierre a presion.', 'Aritos', 'Aritos', 'Disponible', 8500, true, '[{"nombre":"Dorado","hex":"#d4af37"},{"nombre":"Plateado","hex":"#c0c0c0"}]', 0),
  ('Aros Perla Blanca', 'Perla sintetica clasica, ideal para looks formales.', 'Aritos', 'Aritos', 'Disponible', 6200, false, null, 1),
  ('Pulsera Cadena Fina', 'Cadena delicada ajustable, combina con cualquier outfit.', 'Pulseras', 'Pulseras', 'Disponible', 7500, true, '[{"nombre":"Dorado","hex":"#d4af37"},{"nombre":"Plateado","hex":"#c0c0c0"}]', 0),
  ('Pulsera Dije Corazon', 'Dije corazon con detalle de circonias.', 'Pulseras', 'Pulseras', 'Disponible', 9200, false, null, 1),
  ('Collar Choker', 'Choker ajustable de acero quirurgico, no se decolora.', 'Collares', 'Collares', 'Disponible', 10500, true, null, 0),
  ('Collar Perlas Clasico', 'Hilo de perlas sinteticas, largo 45cm.', 'Collares', 'Collares', 'Sin stock', 12800, false, null, 1),
  ('Anillo Solitario Circonia', 'Circonia central engarzada, banda fina.', 'Anillos', 'Anillos', 'Disponible', 6800, false, '[{"nombre":"Dorado","hex":"#d4af37"},{"nombre":"Plateado","hex":"#c0c0c0"}]', 0),
  ('Set Anillos Ajustables x3', 'Combo de 3 anillos ajustables, apilables entre si.', 'Anillos', 'Anillos', 'Disponible', 5400, false, null, 1);
