# Development Utilities

## Test the API Locally

1. **Start the emulators:**

   ```bash
   npm run serve
   ```

2. **Test report creation:**

   ```bash
   curl -X POST http://localhost:5001/brandlight-project/us-central1/createReport \
     -H "Content-Type: application/json" \
     -d '{
       "reportType": "A",
       "data": {
         "title": "Test Report",
         "subtitle": "Development Testing",
         "author": "Developer",
         "date": "2024-01-01"
       },
       "options": {
         "format": "A4",
         "orientation": "portrait"
       }
     }'
   ```

3. **Check job status:**

   ```bash
   curl "http://localhost:5001/brandlight-project/us-central1/getJobStatus?jobId=YOUR_JOB_ID"
   ```

4. **Health check:**
   ```bash
   curl http://localhost:5001/brandlight-project/us-central1/health
   ```

## Sample Test Data

```json
{
  "reportType": "A",
  "data": {
    "title": "Q4 2024 Performance Report",
    "subtitle": "Annual Business Analysis",
    "author": "Analytics Team",
    "date": "2024-12-31T00:00:00.000Z",
    "data": {
      "summary": {
        "totalRevenue": 1500000,
        "growth": 15.2,
        "customers": 2500
      },
      "metrics": [
        { "name": "Conversion Rate", "value": 3.2, "unit": "%" },
        { "name": "Customer Satisfaction", "value": 94, "unit": "%" }
      ]
    }
  },
  "options": {
    "format": "A4",
    "orientation": "portrait",
    "quality": 100
  }
}
```

## Debug Commands

```bash
# Build and watch
npm run build:watch

# Serve with hot reload
npm run serve:watch

# Check logs
firebase functions:log --only=functions

# Deploy single function
firebase deploy --only functions:createReport
```
