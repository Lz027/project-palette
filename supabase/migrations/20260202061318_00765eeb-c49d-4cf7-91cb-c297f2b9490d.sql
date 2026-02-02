-- Create profiles table for user data including avatars
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles are viewable by the user
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add UPDATE and DELETE policies for columns table
CREATE POLICY "Users can update columns in their boards" 
ON public.columns 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid()));

CREATE POLICY "Users can delete columns in their boards" 
ON public.columns 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM boards WHERE boards.id = columns.board_id AND boards.user_id = auth.uid()));

-- Add UPDATE and DELETE policies for tasks table
CREATE POLICY "Users can update their tasks" 
ON public.tasks 
FOR UPDATE 
USING (EXISTS ( SELECT 1 FROM columns JOIN boards ON boards.id = columns.board_id WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()));

CREATE POLICY "Users can delete their tasks" 
ON public.tasks 
FOR DELETE 
USING (EXISTS ( SELECT 1 FROM columns JOIN boards ON boards.id = columns.board_id WHERE columns.id = tasks.column_id AND boards.user_id = auth.uid()));

-- Add column type and settings to columns table
ALTER TABLE public.columns ADD COLUMN column_type TEXT DEFAULT 'text';
ALTER TABLE public.columns ADD COLUMN settings JSONB DEFAULT '{}';

-- Add INSERT policy for user_settings
CREATE POLICY "Users can insert own settings" 
ON public.user_settings 
FOR INSERT 
WITH CHECK (user_id = auth.uid());