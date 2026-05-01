DROP POLICY IF EXISTS "Public submit contact_messages" ON public.contact_messages;

CREATE POLICY "Public submit validated contact_messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (
  length(trim(name)) BETWEEN 1 AND 120
  AND length(trim(email)) BETWEEN 3 AND 254
  AND email LIKE '%@%'
  AND length(trim(message)) BETWEEN 1 AND 5000
  AND is_read = false
);