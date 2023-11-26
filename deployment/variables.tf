variable "domain_name" {
  type        = string
  description = "The domain URL to reach your services"
}

variable "hosted_zone" {
  type        = string
  description = "The hosted zone on Route53 to create for the service"
  default     = "naluri.net"
}

variable "region" {
  type        = string
  description = "The AWS region to create ECS cluster in."
  default     = "ap-southeast-1"
}

variable "distribution_custom_error_response" {
  type        = list(map(any))
  description = "One or more custom error response elements"
  default     = []
}
