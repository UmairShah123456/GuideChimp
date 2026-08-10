-- Demo data so the guest portal renders end-to-end without signup.
-- Visit /g/demo-aspects-court after `supabase start` + `supabase db reset`.
-- Copy mirrors the Guest Portal Explorations design file.

-- Fixed UUIDs so inserts can reference each other deterministically.
-- account
insert into public.accounts (id, name, brand_color, theme_preset, font_heading, font_body)
values ('a0000000-0000-0000-0000-000000000001', 'Airhosts', '#2a6e7e', 'editorial', 'outfit', 'outfit');

-- property
insert into public.properties (id, account_id, name, address, hero_image_url)
values (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'Aspects Court',
  '1-bed apartment · Slough SL1 2EZ',
  null
);

-- guide (the property's guest guide; everything below hangs off it)
insert into public.guides (id, account_id, property_id, name, kind, position)
values (
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'Guest guide',
  'guest',
  0
);

-- an account-level guide: a company process, not tied to any property
insert into public.guides (id, account_id, property_id, name, kind, position)
values (
  'd0000000-0000-0000-0000-000000000002',
  'a0000000-0000-0000-0000-000000000001',
  null,
  'Guest background checks',
  'staff',
  0
);

insert into public.custom_sections (id, guide_id, title, subtitle, position, blocks)
values (
  'e0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000002',
  'Running a check',
  'Before you approve a booking',
  0,
  '[{"id":"s1","type":"text","body":"Verify ID against the booking name, then check the platform profile age."}]'::jsonb
);

insert into public.magic_links (guide_id, token, expires_at)
values ('d0000000-0000-0000-0000-000000000002', 'demo-background-checks', null);

-- guide sections
insert into public.guide_sections (id, property_id, guide_id, type, position, content) values
(
  'c0000000-0000-0000-0000-000000000001',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'check_in', 0,
  jsonb_build_object(
    'eyebrow', 'Getting in',
    'headline', E'Park, walk, tap,\nyou''re in.',
    'checkInTime', '15:00',
    'checkoutTime', '10:00',
    'steps', jsonb_build_array(
      jsonb_build_object('title','Park in bay 14','body','Level -1, to the left of the lifts. Bay 15 belongs to a neighbour who will notice.'),
      jsonb_build_object('title','Main door — flat 32''s buzzer','body','Take the lift to ground, exit right to the main entrance keypad.','code', jsonb_build_object('label','DOOR CODE','value','4821#')),
      jsonb_build_object('title','Key box by flat 32''s door','body','3rd floor. Black lockbox left of the door frame.','code', jsonb_build_object('label','LOCKBOX','value','0724'),'photoCaption','photo · lockbox location')
    ),
    'note', 'Arriving before 3pm? Message me — early check-in is usually fine midweek.'
  )
),
(
  'c0000000-0000-0000-0000-000000000002',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'parking', 1,
  jsonb_build_object(
    'lotName', 'Underground car park',
    'lotDetail', 'Entrance on Hencroft St · 2.1m height limit',
    'mapCaption', 'map · car park entrance pin',
    'directionsUrl', 'https://www.google.com/maps/search/?api=1&query=Aspects+Court+Slough'
  )
),
(
  'c0000000-0000-0000-0000-000000000003',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'wifi', 2,
  jsonb_build_object(
    'network', 'AspectsCourt_5G',
    'password', 'sunnyslough24',
    'band', '5GHz · whole flat'
  )
),
(
  'c0000000-0000-0000-0000-000000000004',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'amenities', 3,
  jsonb_build_object(
    'eyebrow', 'How stuff works',
    'headline', E'No manuals.\nJust short videos.',
    'askNote', 'Something not covered here?',
    'askLabel', 'Ask Umair'
  )
),
(
  'c0000000-0000-0000-0000-000000000005',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'local_guide', 4,
  jsonb_build_object(
    'eyebrow', 'Local guide',
    'headline', E'Where we''d\nactually go.',
    'mapCaption', 'map · all pins'
  )
),
(
  'c0000000-0000-0000-0000-000000000006',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'house_rules', 5,
  jsonb_build_object(
    'eyebrow', 'House rules',
    'headline', E'Just 5 rules.\nWe counted.',
    'rules', jsonb_build_array(
      jsonb_build_object('title','No smoking anywhere inside','reason','Balcony''s fine — there''s an ashtray out there'),
      jsonb_build_object('title','Quiet hours 10pm – 8am','reason','The walls are friendlier than they are thick'),
      jsonb_build_object('title','No parties or extra guests','reason','Only booked guests overnight, please'),
      jsonb_build_object('title','Shoes off at the door','reason','Slippers in the hallway basket, help yourself'),
      jsonb_build_object('title','Bins out if you''re last to leave Sunday','reason','Black bin, kerbside — thank you!')
    )
  )
),
(
  'c0000000-0000-0000-0000-000000000008',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'check_out', 6,
  jsonb_build_object(
    'eyebrow', 'Before you go',
    'headline', 'Checking out',
    'label', 'CHECKOUT · SAT 24 JUL, 10AM',
    'items', jsonb_build_array(
      'Pop used towels in the bath',
      'Windows shut, heating as you found it',
      'Keys back in the lockbox, scramble the dial'
    )
  )
),
(
  'c0000000-0000-0000-0000-000000000007',
  'b0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'emergency_contacts', 7,
  jsonb_build_object(
    'eyebrow', 'Contact',
    'headline', E'We''re real people.\nSay hello.',
    'host', jsonb_build_object(
      'name', 'Umair',
      'role', 'Your host · Airhosts · usually replies in ~10 min',
      'whatsapp', '+447700900123',
      'phone', '+447700900123',
      'sms', '+447700900123'
    ),
    'services', jsonb_build_array(
      jsonb_build_object('code','999','name','Emergency services','detail','Fire, police, ambulance','phone','999','tone','danger'),
      jsonb_build_object('code','111','name','NHS non-emergency','detail','Medical advice, 24/7','phone','111','tone','normal')
    ),
    'goodToKnow', jsonb_build_array(
      jsonb_build_object('label','Stopcock','value','under the kitchen sink'),
      jsonb_build_object('label','Fuse box','value','hallway cupboard, top shelf'),
      jsonb_build_object('label','Fire assembly point','value','front car park, by the postbox'),
      jsonb_build_object('label','Nearest A&E','value','Wexham Park Hospital, 10 min drive')
    )
  )
);

-- amenity video guides (placeholder media — real uploads replace these)
insert into public.media_items (property_id, guide_id, guide_section_id, type, url, caption, position, metadata) values
('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','video','','Heating & hot water',0, jsonb_build_object('duration','0:48','subtitle','Thermostat by the door')),
('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','video','','TV & streaming',1, jsonb_build_object('duration','1:12','subtitle','Sign into your own Netflix')),
('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','video','','Washer-dryer',2, jsonb_build_object('duration','0:35','subtitle','The dial that makes sense')),
('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000004','video','','Balcony door',3, jsonb_build_object('duration','0:22','subtitle','Lift handle up to lock'));

-- local guide entries
insert into public.local_guide_entries (guide_section_id, category, name, description, price, hours, position, url) values
('c0000000-0000-0000-0000-000000000005','Food and drink','The Red Lion','"Get the Sunday roast. Book ahead, it fills up by noon." — Umair','££','Kitchen closes 9pm',0,null),
('c0000000-0000-0000-0000-000000000005','Food and drink','Bakers Dozen','"Best flat white in Slough. Cinnamon buns sell out early."','£','7am–3pm',1,null),
('c0000000-0000-0000-0000-000000000005','Other','Tesco Express','"Open till 11pm. Cash machine outside, no fee."',null,'7am–11pm',2,null),
('c0000000-0000-0000-0000-000000000005','Point of interest','Slough Station','"Elizabeth line to central London in ~35 min. Paddington in 17."',null,null,3,null);

-- magic link — /g/demo-aspects-court, no expiry
insert into public.magic_links (property_id, guide_id, token, expires_at)
values ('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001', 'demo-aspects-court', null);

-- a pre-expired link to exercise the expired-state fallback: /g/expired-demo
insert into public.magic_links (property_id, guide_id, token, expires_at)
values ('b0000000-0000-0000-0000-000000000001','d0000000-0000-0000-0000-000000000001', 'expired-demo', now() - interval '1 day');
