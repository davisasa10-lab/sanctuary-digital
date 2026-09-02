export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          entity: string
          entity_id: string | null
          id: string
          summary: string
          user_email: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          summary?: string
          user_email?: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string
          entity_id?: string | null
          id?: string
          summary?: string
          user_email?: string
          user_id?: string | null
        }
        Relationships: []
      }
      announcements: {
        Row: {
          body: string
          category: string
          created_at: string
          excerpt: string
          featured_image: string | null
          id: string
          publish_date: string
          published: boolean
          seo_description: string
          seo_title: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          publish_date?: string
          published?: boolean
          seo_description?: string
          seo_title?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          body?: string
          category?: string
          created_at?: string
          excerpt?: string
          featured_image?: string | null
          id?: string
          publish_date?: string
          published?: boolean
          seo_description?: string
          seo_title?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          active: boolean
          created_at: string
          description: string
          goal: number
          id: string
          raised: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string
          goal?: number
          id?: string
          raised?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          goal?: number
          id?: string
          raised?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      contact_messages: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      donations: {
        Row: {
          amount: number
          campaign_id: string | null
          created_at: string
          currency: string
          donor_name: string | null
          email: string | null
          fund: string
          id: string
          method: string
          reference: string | null
          status: string
          updated_at: string
        }
        Insert: {
          amount: number
          campaign_id?: string | null
          created_at?: string
          currency?: string
          donor_name?: string | null
          email?: string | null
          fund?: string
          id?: string
          method?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          campaign_id?: string | null
          created_at?: string
          currency?: string
          donor_name?: string | null
          email?: string | null
          fund?: string
          id?: string
          method?: string
          reference?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "donations_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          address: string
          category: string
          created_at: string
          description: string
          end_time: string
          event_date: string
          featured: boolean
          id: string
          image_url: string | null
          location: string
          published: boolean
          registration_url: string | null
          start_time: string
          title: string
          updated_at: string
        }
        Insert: {
          address?: string
          category?: string
          created_at?: string
          description?: string
          end_time?: string
          event_date: string
          featured?: boolean
          id?: string
          image_url?: string | null
          location?: string
          published?: boolean
          registration_url?: string | null
          start_time?: string
          title: string
          updated_at?: string
        }
        Update: {
          address?: string
          category?: string
          created_at?: string
          description?: string
          end_time?: string
          event_date?: string
          featured?: boolean
          id?: string
          image_url?: string | null
          location?: string
          published?: boolean
          registration_url?: string | null
          start_time?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_albums: {
        Row: {
          cover_image: string | null
          created_at: string
          description: string
          id: string
          published: boolean
          slug: string
          sort_order: number
          title: string
          updated_at: string
        }
        Insert: {
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          title: string
          updated_at?: string
        }
        Update: {
          cover_image?: string | null
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      gallery_items: {
        Row: {
          album_id: string | null
          caption: string
          category: string
          created_at: string
          id: string
          media_type: string
          published: boolean
          sort_order: number
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          album_id?: string | null
          caption?: string
          category?: string
          created_at?: string
          id?: string
          media_type?: string
          published?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          album_id?: string | null
          caption?: string
          category?: string
          created_at?: string
          id?: string
          media_type?: string
          published?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "gallery_items_album_id_fkey"
            columns: ["album_id"]
            isOneToOne: false
            referencedRelation: "gallery_albums"
            referencedColumns: ["id"]
          },
        ]
      }
      leaders: {
        Row: {
          bio: string
          created_at: string
          email: string | null
          id: string
          image_url: string | null
          name: string
          published: boolean
          role: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          bio?: string
          created_at?: string
          email?: string | null
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          role?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      live_settings: {
        Row: {
          description: string
          id: string
          is_live: boolean
          scheduled_at: string | null
          title: string
          updated_at: string
          youtube_channel_id: string | null
          youtube_video_id: string | null
        }
        Insert: {
          description?: string
          id?: string
          is_live?: boolean
          scheduled_at?: string | null
          title?: string
          updated_at?: string
          youtube_channel_id?: string | null
          youtube_video_id?: string | null
        }
        Update: {
          description?: string
          id?: string
          is_live?: boolean
          scheduled_at?: string | null
          title?: string
          updated_at?: string
          youtube_channel_id?: string | null
          youtube_video_id?: string | null
        }
        Relationships: []
      }
      media_assets: {
        Row: {
          alt_text: string
          created_at: string
          file_name: string
          id: string
          mime_type: string
          public_url: string
          size_bytes: number
          storage_path: string
          updated_at: string
          uploaded_by: string | null
        }
        Insert: {
          alt_text?: string
          created_at?: string
          file_name: string
          id?: string
          mime_type?: string
          public_url: string
          size_bytes?: number
          storage_path: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Update: {
          alt_text?: string
          created_at?: string
          file_name?: string
          id?: string
          mime_type?: string
          public_url?: string
          size_bytes?: number
          storage_path?: string
          updated_at?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      ministries: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          leader: string
          name: string
          published: boolean
          schedule: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          leader?: string
          name: string
          published?: boolean
          schedule?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          leader?: string
          name?: string
          published?: boolean
          schedule?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      pages: {
        Row: {
          canonical_url: string | null
          content: string
          created_at: string
          featured_image: string | null
          id: string
          og_image: string | null
          published: boolean
          seo_description: string
          seo_title: string
          slug: string
          title: string
          updated_at: string
        }
        Insert: {
          canonical_url?: string | null
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          published?: boolean
          seo_description?: string
          seo_title?: string
          slug: string
          title: string
          updated_at?: string
        }
        Update: {
          canonical_url?: string | null
          content?: string
          created_at?: string
          featured_image?: string | null
          id?: string
          og_image?: string | null
          published?: boolean
          seo_description?: string
          seo_title?: string
          slug?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      prayer_requests: {
        Row: {
          anonymous: boolean
          body: string
          category: string
          created_at: string
          email: string | null
          id: string
          name: string | null
          phone: string | null
          status: string
          updated_at: string
        }
        Insert: {
          anonymous?: boolean
          body: string
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          anonymous?: boolean
          body?: string
          category?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          phone?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
        }
        Relationships: []
      }
      role_permissions: {
        Row: {
          created_at: string
          id: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          created_at?: string
          id?: string
          permission: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          created_at?: string
          id?: string
          permission?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
      sermons: {
        Row: {
          audio_url: string | null
          category: string
          created_at: string
          duration: string
          id: string
          published: boolean
          scripture: string
          series: string
          sermon_date: string
          speaker: string
          summary: string
          tags: string[]
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          audio_url?: string | null
          category?: string
          created_at?: string
          duration?: string
          id?: string
          published?: boolean
          scripture?: string
          series?: string
          sermon_date?: string
          speaker?: string
          summary?: string
          tags?: string[]
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          audio_url?: string | null
          category?: string
          created_at?: string
          duration?: string
          id?: string
          published?: boolean
          scripture?: string
          series?: string
          sermon_date?: string
          speaker?: string
          summary?: string
          tags?: string[]
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      testimonies: {
        Row: {
          created_at: string
          id: string
          name: string
          quote: string
          role: string
          status: string
          type: string
          updated_at: string
          video_url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          quote: string
          role?: string
          status?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          quote?: string
          role?: string
          status?: string
          type?: string
          updated_at?: string
          video_url?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          created_at: string
          description: string
          duration: string
          external_id: string | null
          id: string
          placement: string
          provider: string
          published: boolean
          published_at: string | null
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_url: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          external_id?: string | null
          id?: string
          placement?: string
          provider?: string
          published?: boolean
          published_at?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          duration?: string
          external_id?: string | null
          id?: string
          placement?: string
          provider?: string
          published?: boolean
          published_at?: string | null
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_permission: {
        Args: { _permission: string; _user_id: string }
        Returns: boolean
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "editor"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor"],
    },
  },
} as const
