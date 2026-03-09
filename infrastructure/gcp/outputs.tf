output "backend_url" {
  description = "The public URL of the backend API deployed on Cloud Run."
  value       = google_cloud_run_v2_service.backend.uri
}

output "artifact_registry_repo" {
  description = "The Artifact Registry repository ID for Docker images."
  value       = google_artifact_registry_repository.backend_repo.id
}
