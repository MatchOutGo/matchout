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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      admin_templates: {
        Row: {
          content_en: string
          content_pl: string
          created_at: string | null
          id: string
          title_en: string
          title_pl: string
        }
        Insert: {
          content_en: string
          content_pl: string
          created_at?: string | null
          id?: string
          title_en: string
          title_pl: string
        }
        Update: {
          content_en?: string
          content_pl?: string
          created_at?: string | null
          id?: string
          title_en?: string
          title_pl?: string
        }
        Relationships: []
      }
      blacklist: {
        Row: {
          admin_id: string | null
          created_at: string | null
          expires_at: string | null
          id: string
          reason: string
          user_id: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason: string
          user_id?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          reason?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blacklist_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blacklist_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      complaints: {
        Row: {
          created_at: string | null
          id: string
          listing_id: string | null
          message_id: string | null
          reason: string
          reporter_id: string | null
          status: Database["public"]["Enums"]["complaint_status"] | null
          target_user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message_id?: string | null
          reason: string
          reporter_id?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          target_user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          listing_id?: string | null
          message_id?: string | null
          reason?: string
          reporter_id?: string | null
          status?: Database["public"]["Enums"]["complaint_status"] | null
          target_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "complaints_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "complaints_target_user_id_fkey"
            columns: ["target_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dictionaries: {
        Row: {
          category: string
          id: string
          is_active: boolean | null
          label_en: string
          label_pl: string
          sort_order: number | null
          value: string
        }
        Insert: {
          category: string
          id?: string
          is_active?: boolean | null
          label_en: string
          label_pl: string
          sort_order?: number | null
          value: string
        }
        Update: {
          category?: string
          id?: string
          is_active?: boolean | null
          label_en?: string
          label_pl?: string
          sort_order?: number | null
          value?: string
        }
        Relationships: []
      }
      listing_costs: {
        Row: {
          amount: number
          id: string
          is_shared: boolean | null
          listing_id: string
          title: string
        }
        Insert: {
          amount: number
          id?: string
          is_shared?: boolean | null
          listing_id: string
          title: string
        }
        Update: {
          amount?: number
          id?: string
          is_shared?: boolean | null
          listing_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_costs_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_participants: {
        Row: {
          created_at: string | null
          last_read_at: string | null
          listing_id: string
          status: Database["public"]["Enums"]["participant_status"] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          last_read_at?: string | null
          listing_id: string
          status?: Database["public"]["Enums"]["participant_status"] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          last_read_at?: string | null
          listing_id?: string
          status?: Database["public"]["Enums"]["participant_status"] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_participants_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_participants_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          activity: string
          attributes: Json | null
          budget_max: number | null
          children_allowed: string | null
          city: string | null
          country: string | null
          cover_image: string | null
          created_at: string | null
          current_participants: number | null
          date_end: string | null
          date_flexible_days: number | null
          date_start: string | null
          description: string
          gender_pref: string | null
          id: string
          is_bus_trip: boolean | null
          language_pref: string | null
          max_participants: number | null
          pickup_cities: string[] | null
          prepayment_amount: number | null
          prepayment_required: boolean | null
          status: string | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          user_id: string
        }
        Insert: {
          activity: string
          attributes?: Json | null
          budget_max?: number | null
          children_allowed?: string | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          date_end?: string | null
          date_flexible_days?: number | null
          date_start?: string | null
          description: string
          gender_pref?: string | null
          id?: string
          is_bus_trip?: boolean | null
          language_pref?: string | null
          max_participants?: number | null
          pickup_cities?: string[] | null
          prepayment_amount?: number | null
          prepayment_required?: boolean | null
          status?: string | null
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          user_id: string
        }
        Update: {
          activity?: string
          attributes?: Json | null
          budget_max?: number | null
          children_allowed?: string | null
          city?: string | null
          country?: string | null
          cover_image?: string | null
          created_at?: string | null
          current_participants?: number | null
          date_end?: string | null
          date_flexible_days?: number | null
          date_start?: string | null
          description?: string
          gender_pref?: string | null
          id?: string
          is_bus_trip?: boolean | null
          language_pref?: string | null
          max_participants?: number | null
          pickup_cities?: string[] | null
          prepayment_amount?: number | null
          prepayment_required?: boolean | null
          status?: string | null
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          listing_id: string
          sender_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          listing_id: string
          sender_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          listing_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          payload: Json
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          payload: Json
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          payload?: Json
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          first_name: string | null
          id: string
          is_banned: boolean | null
          language: string | null
          phone: string
          role: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          first_name?: string | null
          id: string
          is_banned?: boolean | null
          language?: string | null
          phone: string
          role?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          first_name?: string | null
          id?: string
          is_banned?: boolean | null
          language?: string | null
          phone?: string
          role?: string | null
        }
        Relationships: []
      }
      user_interests: {
        Row: {
          activity: string
          user_id: string
        }
        Insert: {
          activity: string
          user_id: string
        }
        Update: {
          activity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_interests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_unread_messages_count: { Args: never; Returns: number }
      increment_participants: { Args: { row_id: string }; Returns: undefined }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      activity_type:
        | "skiing"
        | "snowboarding"
        | "skitouring"
        | "freeride"
        | "snowmobiles"
        | "trekking"
        | "mtb"
        | "climbing"
        | "kayaking"
      complaint_status: "pending" | "resolved" | "dismissed"
      listing_type: "offer" | "seek"
      participant_status: "pending" | "approved" | "rejected"
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
      activity_type: [
        "skiing",
        "snowboarding",
        "skitouring",
        "freeride",
        "snowmobiles",
        "trekking",
        "mtb",
        "climbing",
        "kayaking",
      ],
      complaint_status: ["pending", "resolved", "dismissed"],
      listing_type: ["offer", "seek"],
      participant_status: ["pending", "approved", "rejected"],
    },
  },
} as const
