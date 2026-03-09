variable "project_id" {
  description = "The ID of the GCP project to deploy resources."
  type        = string
}

variable "region" {
  description = "The region to deploy resources."
  type        = string
  default     = "europe-north1"
}

variable "google_api_key" {
  description = "The Gemini API Key for the AI service."
  type        = string
  sensitive   = true
}

variable "supabase_url" {
  description = "The Supabase Project URL."
  type        = string
}

variable "supabase_key" {
  description = "The Supabase Anon/Service Key."
  type        = string
  sensitive   = true
}
