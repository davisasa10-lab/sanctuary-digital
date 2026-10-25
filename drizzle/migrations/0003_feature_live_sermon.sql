UPDATE public.sermons SET featured = false WHERE featured;
INSERT INTO public.sermons (title, speaker, series, scripture, sermon_date, duration, category, summary, video_url, thumbnail_url, published, featured)
SELECT 'Sunday Service — Live','Next Gen Church','Sunday Gathering','',current_date,'','Faith','Join us live every Sunday at 9:30 AM GMT.','https://www.youtube.com/watch?v=jfKfPfyJRdk','https://img.youtube.com/vi/jfKfPfyJRdk/hqdefault.jpg',true,true
WHERE NOT EXISTS (SELECT 1 FROM public.sermons WHERE video_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk');