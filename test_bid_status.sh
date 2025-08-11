#!/bin/bash

echo "Testing Conditional Bid Status Functionality"
echo "============================================"

echo ""
echo "1. Testing User 6 (who has paid for Bid 40):"
echo "Expected: Should see Bid 40 status as 'Under Review'"
curl -s "http://localhost:5000/api/bids?userId=6" | grep -A15 '"id":40' | grep -E '"conditionalStatus"|"userHasPaid"|"totalBookedSeats"'

echo ""
echo "2. Testing User 3 (who has not paid for Bid 40):"
echo "Expected: Should see Bid 40 status as 'Open'"
curl -s "http://localhost:5000/api/bids?userId=3" | grep -A15 '"id":40' | grep -E '"conditionalStatus"|"userHasPaid"|"totalBookedSeats"'

echo ""
echo "3. Testing without authentication:"
echo "Expected: Should see generic status"
curl -s "http://localhost:5000/api/bids" | grep -A15 '"id":40' | grep -E '"conditionalStatus"|"totalBookedSeats"'

echo ""
echo "4. Database verification - Payments for Bid 40:"
echo "Expected: Should show User 6 has completed payment"