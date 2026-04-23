# Backend deploy runtime AppRole policy.

path "{{kv_mount}}/data/{{env}}/backend-deploy/config" {
  capabilities = ["read"]
}

path "{{kv_mount}}/metadata/{{env}}/backend-deploy/*" {
  capabilities = ["list"]
}

path "{{kv_mount}}/data/{{env}}/db/auth-service" {
  capabilities = ["read"]
}

path "{{kv_mount}}/data/{{env}}/db/user-service" {
  capabilities = ["read"]
}

path "{{kv_mount}}/data/{{env}}/db/permission-service" {
  capabilities = ["read"]
}

path "{{kv_mount}}/data/{{env}}/db/variant-service" {
  capabilities = ["read"]
}

path "{{kv_mount}}/metadata/{{env}}/db/*" {
  capabilities = ["list"]
}

path "{{kv_mount}}/data/{{env}}/jwt/auth-service" {
  capabilities = ["read"]
}

path "{{kv_mount}}/metadata/{{env}}/jwt/*" {
  capabilities = ["list"]
}
