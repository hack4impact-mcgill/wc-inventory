export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      box_contents: {
        Row: {
          box_content_id: number
          box_id: number | null
          category_id: number
          gender: Database["public"]["Enums"]["gender_enum"]
          quantity: number
          size: Database["public"]["Enums"]["size_enum"]
        }
        Insert: {
          box_content_id?: number
          box_id?: number | null
          category_id: number
          gender: Database["public"]["Enums"]["gender_enum"]
          quantity?: number
          size: Database["public"]["Enums"]["size_enum"]
        }
        Update: {
          box_content_id?: number
          box_id?: number | null
          category_id?: number
          gender?: Database["public"]["Enums"]["gender_enum"]
          quantity?: number
          size?: Database["public"]["Enums"]["size_enum"]
        }
        Relationships: [
          {
            foreignKeyName: "box_contents_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
          {
            foreignKeyName: "box_contents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      box_movements: {
        Row: {
          box_id: number | null
          box_movement_id: number
          from_location_id: number | null
          moved_at: string | null
          moved_by: string | null
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          note: string | null
          to_location_id: number | null
        }
        Insert: {
          box_id?: number | null
          box_movement_id?: number
          from_location_id?: number | null
          moved_at?: string | null
          moved_by?: string | null
          movement_type: Database["public"]["Enums"]["movement_type_enum"]
          note?: string | null
          to_location_id?: number | null
        }
        Update: {
          box_id?: number | null
          box_movement_id?: number
          from_location_id?: number | null
          moved_at?: string | null
          moved_by?: string | null
          movement_type?: Database["public"]["Enums"]["movement_type_enum"]
          note?: string | null
          to_location_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "box_movements_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
          {
            foreignKeyName: "box_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "box_movements_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      boxes: {
        Row: {
          box_id: number
          box_number: string
          created_at: string | null
          location_id: number | null
          status: Database["public"]["Enums"]["box_status_enum"]
          updated_at: string | null
        }
        Insert: {
          box_id?: number
          box_number: string
          created_at?: string | null
          location_id?: number | null
          status?: Database["public"]["Enums"]["box_status_enum"]
          updated_at?: string | null
        }
        Update: {
          box_id?: number
          box_number?: string
          created_at?: string | null
          location_id?: number | null
          status?: Database["public"]["Enums"]["box_status_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boxes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: number
          description: string | null
          level: number
          name: string
          parent_id: number | null
        }
        Insert: {
          category_id?: number
          description?: string | null
          level: number
          name: string
          parent_id?: number | null
        }
        Update: {
          category_id?: number
          description?: string | null
          level?: number
          name?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      locations: {
        Row: {
          description: string | null
          level: number | null
          location_id: number
          name: string
          parent_id: number | null
        }
        Insert: {
          description?: string | null
          level?: number | null
          location_id?: number
          name: string
          parent_id?: number | null
        }
        Update: {
          description?: string | null
          level?: number | null
          location_id?: number
          name?: string
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          first_name: string
          id: string
          last_name: string
          role: Database["public"]["Enums"]["user_role_enum"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name: string
          id: string
          last_name: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string
          id?: string
          last_name?: string
          role?: Database["public"]["Enums"]["user_role_enum"]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      box_status_enum: "Active" | "Donated" | "Archived"
      gender_enum: "Male" | "Female" | "Unisex"
      movement_type_enum: "Create" | "Move" | "Donate" | "Archive"
      size_enum: "XXS" | "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL"
      user_role_enum: "Volunteer" | "Admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
