import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://huivhwoadftxrigadolh.supabase.co/';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1aXZod29hZGZ0eHJpZ2Fkb2xoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI1MDgxNDgsImV4cCI6MjA1ODA4NDE0OH0.o5N0DrgJ5mxKx4aaAdvNw7DHU7VFOBEvVM7t3VtaaV0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
