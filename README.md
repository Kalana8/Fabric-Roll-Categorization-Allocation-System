# Fabric Roll Categorization & Allocation System

Backend: Express + TypeScript + Prisma (MySQL)
Frontend: React + TypeScript (Vite)

Setup

Backend
- Create backend/.env with DATABASE_URL and PORT=4000
- cd backend && npm i && npm run prisma:generate && npm run prisma:migrate -- --name init
- npm run dev

Frontend
- cd frontend && npm i && npm run dev
- Optional: set VITE_API_URL=http://localhost:4000/api

API
- GET/POST /api/styles
- GET/POST /api/rolls
- GET/POST /api/rules
- POST /api/categorize { ruleId }
- POST /api/allocate { styleId, requiredLength }

Notes
- Categorization writes to categorized_rolls
- Allocation updates roll balance and logs consumption

## Testing Guide

### Prerequisites
1. Backend running on `http://localhost:4000`
2. Frontend running on `http://localhost:5173` (or Vite default port)
3. MySQL database connected and migrations applied

### Authentication Test
**Login Flow:**
- Navigate to `/login`
- Enter any username and password (demo auth accepts any non-empty values)
- Should redirect to Roll Entry page
- Click "Logout" button - should redirect back to login

### Feature Testing Scenarios

#### 1. Style Management
**Test: Create Style**
- Go to Roll Entry page
- If no styles exist, create one via API or add directly:
  ```bash
  curl -X POST http://localhost:4000/api/styles \
    -H "Content-Type: application/json" \
    -d '{"name": "Sample Style", "code": "666765"}'
  ```
- Verify style appears in dropdown

#### 2. Fabric Roll Entry
**Test: Add Fabric Roll**
- Fill form with:
  - Style: Select from dropdown (e.g., "666765")
  - Roll ID: "011"
  - Fabric Width: 55
  - Width Shrinkage: +4.5 (positive)
  - Length: 50
  - Location: "A"
- Click "Add Roll"
- Verify roll appears in table

**Test: Search & Filter**
- Add multiple rolls with different:
  - Roll IDs (e.g., "011", "012", "013")
  - Locations (e.g., "A", "B", "C")
- Test search by Roll ID - should filter table
- Test search by Location - should filter table
- Enable "Balance only" checkbox - should show only balance rolls
- Enable "Show consumed" - should show rolls with length <= 0
- Check for visual badges:
  - Green "Balance" badge for balance rolls
  - Red "Consumed" badge for fully consumed rolls

**Validation Tests:**
- Submit empty form - should show validation errors
- Enter negative length - should be rejected (PRD requires > 0)
- Enter duplicate Roll ID for same Style - should fail (unique constraint)

#### 3. Rule Creation
**Test: Create Rule**
- Navigate to Rules page
- Select a Style from dropdown
- Set tolerances:
  - Width Tolerance Min: -5
  - Width Tolerance Max: 5
  - Shrinkage Tolerance Min: -5
  - Shrinkage Tolerance Max: 5
- Click "Create Rule"
- Verify rule appears in list with auto-generated Rule ID

**Test: Multiple Rules per Style**
- Create multiple rules for same style with different tolerance ranges
- Verify all rules are displayed

#### 4. Categorization
**Test: Run Categorization**
- Ensure you have:
  - At least one style with rolls
  - At least one rule for that style
- Navigate to Categorization page
- Select a rule from dropdown
- Click "Run Categorization"
- Verify response shows:
  - `ruleId`
  - `styleId`
  - `positiveShrinkage` array
  - `negativeShrinkage` array
  - `categorizedRollIds` array

**Categorization Logic Test:**
1. Create rolls with:
   - Positive shrinkage: +4.5, +3.0, +2.0
   - Negative shrinkage: -2.0, -1.5
2. Create rule with:
   - Width Tolerance: -5 to +5
   - Shrinkage Tolerance: -5 to +5
3. Run categorization
4. Verify rolls are correctly separated into positive/negative shrinkage
5. Verify categorized rolls meet tolerance criteria

#### 5. Allocation & Consumption
**Test: Allocate Requirement**
- Navigate to Allocation page
- Select a style that has categorized rolls
- Enter required length (e.g., 30 meters)
- Click "Consume Roll"
- Verify response shows:
  - `allocated: true`
  - `rollId`
  - `newLength` (previous length - required length)
  - `logId`

**Test: Balance Roll Handling**
1. Allocate 30m from a roll with 50m length
2. Check Roll Entry page
3. Verify:
   - Roll now shows length: 20m
   - Roll has green "Balance" badge
   - Roll appears first in sorted list (priority)

**Test: Full Consumption**
1. Allocate length equal to or greater than roll length
2. Verify:
   - Roll length becomes 0 or negative
   - Roll shows red "Consumed" badge
   - Roll is marked as inactive (`isActive: false`)
   - Roll removed from active allocation list

**Test: Multiple Roll Matching**
- Create multiple rolls with different lengths:
  - Roll A: 25m
  - Roll B: 50m
  - Roll C: 100m
- Request allocation of 30m
- Verify system selects smallest usable roll (Roll B: 50m)
- Verify sorting: minimum enough length → maximum length

**Test: No Suitable Roll**
- Request allocation larger than all available rolls
- Verify response: `allocated: false`, `reason: "No suitable roll found"`

### API Endpoint Testing

**Health Check:**
```bash
curl http://localhost:4000/health
# Expected: {"status":"ok"}
```

**Create Style:**
```bash
curl -X POST http://localhost:4000/api/styles \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Style", "code": "TEST001"}'
```

**List Rolls:**
```bash
curl http://localhost:4000/api/rolls
```

**Create Rule:**
```bash
curl -X POST http://localhost:4000/api/rules \
  -H "Content-Type: application/json" \
  -d '{
    "styleId": "<style-id>",
    "widthToleranceMin": -5,
    "widthToleranceMax": 5,
    "shrinkageToleranceMin": -5,
    "shrinkageToleranceMax": 5
  }'
```

**Run Categorization:**
```bash
curl -X POST http://localhost:4000/api/categorize \
  -H "Content-Type: application/json" \
  -d '{"ruleId": "<rule-id>"}'
```

**Allocate:**
```bash
curl -X POST http://localhost:4000/api/allocate \
  -H "Content-Type: application/json" \
  -d '{
    "styleId": "<style-id>",
    "requiredLength": 30
  }'
```

### Test Data Example

**Complete Test Flow:**
1. Create Style: `{"name": "Style 666765", "code": "666765"}`
2. Add Rolls:
   - Roll 1: `{rollId: "011", fabricWidth: 55, widthShrinkage: +4.5, lengthM: 50, location: "A"}`
   - Roll 2: `{rollId: "012", fabricWidth: 54, widthShrinkage: -2.0, lengthM: 75, location: "B"}`
   - Roll 3: `{rollId: "013", fabricWidth: 56, widthShrinkage: +3.0, lengthM: 100, location: "A"}`
3. Create Rule: Width tolerance (-5 to +5), Shrinkage tolerance (-5 to +5)
4. Run Categorization: Should categorize all 3 rolls if within tolerance
5. Allocate 30m: Should consume from Roll 2 (smallest sufficient: 75m)
6. Verify Roll 2 now has 45m length and Balance badge
7. Allocate another 30m from same style: Should prioritize Roll 2 (balance roll)

### UI/UX Testing

**Responsive Design:**
- Test on different screen sizes (mobile, tablet, desktop)
- Verify tables and forms adapt properly
- Check navigation remains accessible

**Visual Indicators:**
- Verify Balance badge (green) appears on balance rolls
- Verify Consumed badge (red) appears on consumed rolls
- Check active navigation link highlighting

**Error Handling:**
- Test invalid API responses (network errors, validation errors)
- Test empty states (no rolls, no rules)
- Verify user-friendly error messages

### Database Verification

After testing, verify data integrity:
```sql
-- Check styles
SELECT * FROM Style;

-- Check rolls with status
SELECT id, rollId, lengthM, isBalance, isActive FROM Roll;

-- Check categorized rolls mapping
SELECT * FROM CategorizedRoll;

-- Check allocation logs
SELECT * FROM AllocationLog ORDER BY createdAt DESC;
```
