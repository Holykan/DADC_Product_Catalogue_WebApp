import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ytrcnxcdgdnufhbvkoae.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cmNueGNkZ2RudWZoYnZrb2FlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgyNjUxNjMsImV4cCI6MjA5Mzg0MTE2M30.Mbx_dlrWP1Zd4IxwZ6yslB-QrDNxC_E-guXORtMPtaw'
)