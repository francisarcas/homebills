# Home Bill Tracker

A modern, collaborative household expense tracking application with real-time synchronization and intelligent recurring bill management.

![Home Bill Tracker](https://img.shields.io/badge/status-active-success)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?logo=chartdotjs&logoColor=white)

## 🎯 Overview

Home Bill Tracker is a sophisticated web application designed for couples or roommates to collaboratively manage shared and personal expenses. Built with a sleek dark theme and Apple-inspired design language, it provides real-time expense tracking, automatic recurring bill projections, and intelligent settlement management.

**⚠️ Important Note**: This application uses **Supabase** as its backend database. To use this application, you'll need to set up your own Supabase project or connect it to another database provider of your choice.

**👥 Household Size**: The application currently supports **2 users** by default, but can be easily extended to support more household members (see [Expanding to More Users](#-expanding-to-more-users) section below).

## ✨ Features

### Core Functionality
- **👥 Multi-User Support**: Track expenses for household members with distinct profiles (2 users by default, expandable)
- **💰 Shared & Personal Expenses**: Differentiate between shared bills and personal spending
- **🔄 Recurring Bill Management**: Automatic projection of recurring expenses up to 3 years ahead
- **📊 Visual Analytics**: Interactive charts showing spending breakdowns and expense history
- **📅 Monthly & Annual Views**: Switch between detailed monthly tracking and yearly overviews
- **✅ Settlement Tracking**: Mark months as settled with visual indicators and animations
- **💬 Expense Comments**: Add notes and context to individual expenses
- **🏷️ Brand Recognition**: Automatic logo detection for 40+ popular brands and services

### User Experience
- **🎨 Dark Theme**: Sleek, modern interface optimized for low-light environments
- **📱 Fully Responsive**: Seamless experience across desktop, tablet, and mobile devices
- **🔐 Secure Authentication**: Email/password authentication with Supabase Auth
- **☁️ Real-time Sync**: All data synchronized across devices instantly
- **💾 Auto-save**: Changes are automatically saved to the database
- **🎯 Smart Suggestions**: Autocomplete for common expense descriptions
- **📈 Historical Charts**: View spending trends for individual expenses over time

## 🚀 Demo

[**Live Demo**](https://francisarcas.github.io/homebills/)

## 📱 Screenshots

### Dashboard View
- Monthly expense overview with interactive charts
- User profile switching
- Settlement status indicators

### Expense Management
- Add/edit/delete expenses
- Bulk operations in edit mode
- Recurring bill automation

### Analytics
- Per-expense historical charts
- Monthly and annual comparisons
- Shared vs. personal expense breakdowns

## 🛠️ Technologies Used

### Frontend
- **HTML5**: Semantic markup and structure
- **CSS3**: 
  - CSS Grid and Flexbox layouts
  - Custom properties (CSS variables)
  - Smooth animations and transitions
  - Responsive media queries
- **Vanilla JavaScript**: 
  - Modern ES6+ syntax
  - Async/await for database operations
  - DOM manipulation
  - Chart.js integration

### Backend & Database
- **Supabase**: 
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication system
  - Edge Functions for settlement logic

### Libraries
- **Chart.js 4.x**: Interactive data visualization
- **Font Awesome 6.5.1**: Icon library
- **Supabase JS Client 2.x**: Database connectivity

## 📦 Installation & Setup

### Prerequisites
- A Supabase account (free tier available at [supabase.com](https://supabase.com))
- Basic knowledge of SQL for database setup
- A web server or local development environment

### Step 1: Clone the Repository

```bash
git clone https://github.com/francisarcas/homebills.git
cd homebills
```

### Step 2: Set Up Supabase Database

1. Create a new project in [Supabase](https://supabase.com)
2. Run the following SQL in the Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user01', 'user02')),
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(household_id, role)
);

-- Create expenses table
CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  household_id UUID NOT NULL,
  person TEXT NOT NULL CHECK (person IN ('user01', 'user02')),
  month TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  note TEXT NOT NULL,
  logo TEXT,
  recurring BOOLEAN DEFAULT FALSE,
  "isPersonal" BOOLEAN DEFAULT FALSE,
  "isProjected" BOOLEAN DEFAULT FALSE,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create month_settlements table
CREATE TABLE month_settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  household_id UUID NOT NULL,
  month_key TEXT NOT NULL,
  is_settled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(household_id, month_key)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE month_settlements ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Profiles: Users can read all profiles in their household
CREATE POLICY "Users can view household profiles"
  ON profiles FOR SELECT
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

-- Expenses: Users can manage expenses in their household
CREATE POLICY "Users can view household expenses"
  ON expenses FOR SELECT
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert household expenses"
  ON expenses FOR INSERT
  WITH CHECK (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update household expenses"
  ON expenses FOR UPDATE
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can delete household expenses"
  ON expenses FOR DELETE
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

-- Month Settlements: Users can manage settlements in their household
CREATE POLICY "Users can view household settlements"
  ON month_settlements FOR SELECT
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can insert household settlements"
  ON month_settlements FOR INSERT
  WITH CHECK (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can update household settlements"
  ON month_settlements FOR UPDATE
  USING (household_id IN (
    SELECT household_id FROM profiles WHERE user_id = auth.uid()
  ));
```

### Step 3: Create Edge Function for Settlements

Create a Supabase Edge Function called `mark-month-settled`:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const { household_id, month_key, is_settled } = await req.json()

  const { data, error } = await supabaseClient
    .from('month_settlements')
    .upsert({
      household_id,
      month_key,
      is_settled,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'household_id,month_key'
    })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 400
    })
  }

  return new Response(JSON.stringify({ success: true, data }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Step 4: Configure the Application

1. Open `index.html` in your code editor
2. Locate these lines (around line 1040):

```javascript
const SUPABASE_URL = "YOUR_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
```

3. Replace with your Supabase project credentials:
   - Find your URL and anon key in Supabase Dashboard → Settings → API

### Step 5: Create User Profiles

After setting up authentication, you'll need to create profile entries:

```sql
-- Replace these UUIDs with your actual user IDs and generate a household ID
INSERT INTO profiles (user_id, household_id, role, display_name, avatar_url)
VALUES 
  ('user-uuid-1', 'household-uuid', 'user01', 'Person 1', 'assets/person001.png'),
  ('user-uuid-2', 'household-uuid', 'user02', 'Person 2', 'assets/person002.png');
```

### Step 6: Add Avatar Images

Place your avatar images in the `assets/` directory:
- `assets/person001.png`
- `assets/person002.png`

### Step 7: Deploy

Upload all files to your web server or use a service like:
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

## 👥 Expanding to More Users

The application is designed for 2 users by default, but can be extended to support more household members (e.g., 3-4 roommates). Here's how:

### Database Changes

1. **Update the profiles table constraint**:

```sql
-- Remove the old CHECK constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;

-- Add new constraint with additional users
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user01', 'user02', 'user03', 'user04'));
```

2. **Update the expenses table constraint**:

```sql
-- Remove the old CHECK constraint
ALTER TABLE expenses DROP CONSTRAINT IF EXISTS expenses_person_check;

-- Add new constraint with additional users
ALTER TABLE expenses ADD CONSTRAINT expenses_person_check 
  CHECK (person IN ('user01', 'user02', 'user03', 'user04'));
```

3. **Add new user profiles**:

```sql
INSERT INTO profiles (user_id, household_id, role, display_name, avatar_url)
VALUES 
  ('user-uuid-3', 'household-uuid', 'user03', 'Person 3', 'assets/person003.png'),
  ('user-uuid-4', 'household-uuid', 'user04', 'Person 4', 'assets/person004.png');
```

### Code Changes

1. **Add CSS color variables** for new users (in the `:root` section):

```css
:root {
  /* ... existing variables ... */
  --user03-color: #30d158;  /* Green for user03 */
  --user04-color: #ffd60a;  /* Yellow for user04 */
}
```

2. **Add profile buttons** in the HTML (in the `.profiles` div):

```html
<div class="profiles">
  <img src="assets/person001.png" id="user01Btn" class="profile active" onclick="selectPerson('user01')">
  <img src="assets/person002.png" id="user02Btn" class="profile" onclick="selectPerson('user02')">
  <img src="assets/person003.png" id="user03Btn" class="profile" onclick="selectPerson('user03')">
  <img src="assets/person004.png" id="user04Btn" class="profile" onclick="selectPerson('user04')">
</div>
```

3. **Update JavaScript data initialization** (around line 1030):

```javascript
const data = {
  user01: [],
  user02: [],
  user03: [],  // Add new users
  user04: [],
  settlements: {}
};
```

4. **Update the chart labels** in `updateChart()` function:

```javascript
function updateChart() {
  const user01DisplayName = householdProfilesMap.get('user01')?.display_name || 'User 1';
  const user02DisplayName = householdProfilesMap.get('user02')?.display_name || 'User 2';
  const user03DisplayName = householdProfilesMap.get('user03')?.display_name || 'User 3';
  const user04DisplayName = householdProfilesMap.get('user04')?.display_name || 'User 4';
  
  // Update chart data accordingly
  chart.data.labels = [user01DisplayName, user02DisplayName, user03DisplayName, user04DisplayName];
  // ... rest of chart update logic
}
```

5. **Update loops** that iterate over users (search for `["user01", "user02"]` and extend):

```javascript
["user01", "user02", "user03", "user04"].forEach(p => {
  // ... existing logic
});
```

6. **Update `selectPerson()` function** to handle new users:

```javascript
function selectPerson(p) {
  activePerson = p;
  const buttons = ['user01Btn', 'user02Btn', 'user03Btn', 'user04Btn'];
  const colors = {
    user01: 'var(--user01-color)',
    user02: 'var(--user02-color)',
    user03: 'var(--user03-color)',
    user04: 'var(--user04-color)'
  };
  
  buttons.forEach(btnId => {
    const btn = document.getElementById(btnId);
    if (btn) {
      const userKey = btnId.replace('Btn', '');
      btn.classList.toggle("active", p === userKey);
      btn.style.borderColor = (p === userKey) ? colors[userKey] : 'transparent';
    }
  });
  
  cancelEditMode();
  updateAll();
}
```

7. **Update chart colors** in the `updateChart()` function to include new user colors:

```javascript
backgroundColor: (ctx) => {
  if (ctx.dataIndex === 0) return "#0a84ff80";      // user01
  if (ctx.dataIndex === 1) return "#d14d2180";      // user02
  if (ctx.dataIndex === 2) return "#30d15880";      // user03
  if (ctx.dataIndex === 3) return "#ffd60a80";      // user04
  return 'transparent';
}
```

8. **Add avatar images** for new users:
   - `assets/person003.png`
   - `assets/person004.png`

### Settlement Logic Considerations

For more than 2 users, the settlement calculation becomes more complex. You may need to:

1. **Implement a more sophisticated settlement algorithm** (e.g., minimize number of transactions)
2. **Update the `updateBalance()` function** to handle multiple debtors/creditors
3. **Consider using a settlement matrix** to show who owes whom

Example settlement calculation for multiple users:

```javascript
function calculateSettlements() {
  const users = ['user01', 'user02', 'user03', 'user04'];
  const balances = {};
  
  // Calculate each user's balance
  users.forEach(user => {
    const expenses = getMonthlyExpenses(user, activeMonth);
    const totalShared = expenses.shared;
    balances[user] = totalShared;
  });
  
  // Calculate average shared expense
  const totalShared = Object.values(balances).reduce((sum, val) => sum + val, 0);
  const averageShare = totalShared / users.length;
  
  // Calculate who owes/is owed
  const settlements = {};
  users.forEach(user => {
    settlements[user] = balances[user] - averageShare;
  });
  
  return settlements; // Positive = owed money, Negative = owes money
}
```

## 💡 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Select Profile**: Choose which household member you are
3. **Add Expenses**: 
   - Enter amount and description
   - Mark as recurring if it's a regular bill
   - Mark as personal if not shared
   - Optionally add a comment
4. **View Analytics**: Switch between monthly and annual views
5. **Settle Up**: Mark months as settled when payments are made

### Managing Recurring Bills

- **Add Recurring**: Select "Recurring" when adding an expense
- **Auto-Projection**: Future months automatically show projected amounts
- **Edit Series**: Update one entry to modify all future projections
- **Stop Recurring**: Delete the last actual entry to stop projections

### Bulk Operations

1. Click "Edit" button in expense header
2. Select multiple expenses using checkboxes
3. Use "Select All" or delete selected items
4. Click "✕" to cancel edit mode

## 🎨 Customization

### Changing Colors

Edit CSS variables in the `:root` selector:

```css
:root {
  --bg: #0e0e11;              /* Background */
  --card: #1b1b20;            /* Card background */
  --text: #f5f5f7;            /* Text color */
  --accent1: #0a84ff;         /* Primary accent (User 1) */
  --accent2: #ff375f;         /* Secondary accent */
  --user02-color: #e85a2a;    /* User 2 color */
}
```

### Adding Brand Logos

1. Add logo image to `assets/logos/`
2. Update `BRAND_LOGO_RULES` array:

```javascript
{ keywords: ["brand name"], logo: "assets/logos/brandname.png" }
```

3. Add to `SUGGESTION_BRANDS` array for autocomplete

### Modifying Database Schema

If using a different database provider:

1. Adapt the SQL schema to your database system
2. Update the JavaScript database calls
3. Replace Supabase client with your database client
4. Implement authentication system
5. Handle Edge Function logic server-side

## 🔧 Alternative Database Setup

While this app is built for Supabase, you can adapt it to other providers:

### Firebase
- Use Firestore for data storage
- Firebase Authentication for users
- Cloud Functions for settlement logic

### MongoDB
- MongoDB Atlas for database
- Custom Node.js/Express backend
- JWT authentication

### PostgreSQL (Self-hosted)
- Direct PostgreSQL connection
- Custom REST API
- Session-based authentication

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- Projected expenses cannot be edited directly (by design)
- Maximum 3-year projection for recurring bills
- Requires manual profile creation in database
- Settlement calculation for 2 users only (requires custom logic for 3+ users)

## 📞 Contact

Francis Arcas - [Linkedin](https://www.linkedin.com/in/francisarcas)

Project Link: [https://francisarcas.github.io/homebills/](https://francisarcas.github.io/homebills/)

Repository: [https://github.com/francisarcas/homebills](https://github.com/francisarcas/homebills)

## 🙏 Acknowledgments

- Chart.js for beautiful data visualization
- Supabase for backend infrastructure
- Font Awesome for comprehensive icon library
- Inspired by modern expense tracking needs

## 💼 Use Cases

- Couples managing shared household expenses
- Roommates splitting bills (2-4 people)
- Family budget tracking
- Personal finance management
- Subscription tracking
- Recurring bill forecasting
- Student house expense sharing

---

**Built with ❤️ for better household financial management**
