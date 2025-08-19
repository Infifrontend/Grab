
#!/bin/bash

echo "Testing Payment Fix"
echo "=================="

echo ""
echo "1. Checking existing statuses in the system:"
curl -s "http://localhost:5000/api/admin/statuses" | jq '.statuses'

echo ""
echo "2. Testing payment for bid 9 with user 8:"
echo "This should now work without the status error"
curl -X POST "http://localhost:5000/api/retail/bids/9/payment" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 8,
    "amount": 900,
    "paymentMethod": "bankTransfer"
  }' | jq '.'

echo ""
echo "3. Checking statuses again to see if any were auto-created:"
curl -s "http://localhost:5000/api/admin/statuses" | jq '.statuses'
