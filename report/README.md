# PM3 Report — CSE474

## ✅ Checklist
- [x] Kubernetes manifests (k8s/)
- [x] Helm chart (chart/)
- [x] GitHub Actions CI/CD (.github/workflows/ci-cd.yml)
- [x] Unit tests + Integration tests (17 passed per service)
- [x] Coverage reports (services/*/tests/coverage/)
- [x] Prometheus metrics (/metrics endpoint on both services)
- [x] Grafana dashboard (observability/grafana/dashboard.json)
- [x] Structured JSON logging (Winston — timestamp, service, request_id, level, message)
- [x] Distributed Tracing (OpenTelemetry → Jaeger)
- [x] Swagger API Docs (/api-docs on both services)
- [x] n8n Workflow (n8n/workflows/)

## Jaeger Multi-Service Trace Screenshot
> Place screenshot here as `jaeger-trace.png`
> 
> How to get it:
> 1. Run `docker compose up --build`
> 2. Open http://localhost:16686
> 3. Select "comments-service" from Service dropdown
> 4. Click "Find Traces"
> 5. Click any trace — screenshot it and save as `report/jaeger-trace.png`

## Grafana Dashboard Screenshot
> Place screenshot here as `grafana-dashboard.png`
>
> How to get it:
> 1. Open http://localhost:3000 (admin/admin)
> 2. Go to Dashboards → Import
> 3. Upload `observability/grafana/dashboard.json`
> 4. Screenshot the dashboard and save as `report/grafana-dashboard.png`

## n8n Workflow Demo
> Place GIF or screenshot here as `n8n-demo.gif`
>
> How to get it:
> 1. Run `docker run -it --rm -p 5678:5678 n8nio/n8n`
> 2. Open http://localhost:5678
> 3. Import `n8n/workflows/comment-to-search-notification.json`
> 4. Activate and trigger the workflow — record a GIF
