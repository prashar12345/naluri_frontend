provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Environment = terraform.workspace
      Team        = "hogwarts"
      Owner       = "yenwei"
      Project     = "b2mm-web"
    }

  }
}

terraform {
  backend "s3" {
    bucket               = "naluri-dev"
    key                  = "b2mm-web.tfstate"
    region               = "ap-southeast-1"
    workspace_key_prefix = "terraform/b2mm-workspace"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.31"
    }
  }

  required_version = ">= 1.0.0, < 2.0.0"
}

module "b2mm-web" {
  source      = "github.com/naluri-hidup/tf-cloudfront-web-module?ref=1.1.0"
  domain_name = var.domain_name
  hosted_zone = var.hosted_zone
  s3_cors_rule = [
    {
      allowed_headers = ["*"]
      allowed_methods = ["GET", "HEAD"]
      allowed_origins = ["*"]
    }
  ]
  distribution_custom_error_response = [
    {
      error_code    = 403
      response_code = 200
    },
    {
      error_code    = 404
      response_code = 200
    }
  ]
}

output "app_distribution_id" {
  value = module.b2mm-web.app_distribution_id
}
