# Backend deploy rotation/admin AppRole policy.

path "{{kv_mount}}/data/{{env}}/backend-deploy/config" {
  capabilities = ["create", "update", "read"]
}

path "{{kv_mount}}/metadata/{{env}}/backend-deploy/*" {
  capabilities = ["list"]
}

path "{{kv_mount}}/data/{{env}}/ops/github/backend-deploy" {
  capabilities = ["create", "update", "read"]
}

path "{{kv_mount}}/metadata/{{env}}/ops/github/*" {
  capabilities = ["list"]
}
