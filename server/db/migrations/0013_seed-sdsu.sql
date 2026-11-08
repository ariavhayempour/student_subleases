INSERT INTO schools (slug, name, short_name, city, campus_name, theme, campus_location, default_map_zoom, timezone, warn_radius_km)
VALUES (
  'sdsu',
  'San Diego State University',
  'SDSU',
  'San Diego, CA',
  'Hepner Hall',
  '{"primary":"#A6192E","primaryDeep":"#7E1323","onPrimary":"#FFFFFF","secondary":"#FFFFFF","onSecondary":"#7E1323","highlight":"#000000","onHighlight":"#FFFFFF","tint":"#F9ECEE","link":"#A6192E"}'::jsonb,
  'SRID=4326;POINT(-117.0711 32.7758)'::geography,
  13,
  'America/Los_Angeles',
  25
)
ON CONFLICT (slug) DO NOTHING;
