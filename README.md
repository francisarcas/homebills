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

## ✨ Features

### Core Functionality
- **👥 Multi-User Support**: Track expenses for two household members with distinct profiles
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

## 💡 Usage

### Getting Started

1. **Sign Up/Login**: Create an account or log in with existing credentials
2. **Select Profile**: Choose which household member you are (User 1 or User 2)
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
- Roommates splitting bills
- Family budget tracking
- Personal finance management
- Subscription tracking
- Recurring bill forecasting

---

**Built with ❤️ for better household financial management**
