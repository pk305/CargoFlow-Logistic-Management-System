# 🚚 CargoFlow - Logistic Management System

CargoFlow is a full-stack logistics management system built with:

- **Frontend:** React 17 (CoreUI, Redux Toolkit, Axios)
- **Backend:** Laravel 9 (REST API, Passport Authentication)
- **Database:** PostgreSQL / MySQL (configurable)

---

## 📂 Project Structure

```
CargoFlow/
│
├── backend/    # Laravel 9 API
└── frontend/   # React 17 Web App
```

---

## ⚙️ Requirements

- **PHP**: 8.0 or 8.1
- **Composer**: 2.x
- **Node.js**: 16.x
- **npm**: 6+
- **Database**: PostgreSQL or MySQL
- **Git**: latest version

---

## 🛠 Backend Setup (Laravel 9)

1. **Navigate to backend folder**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   composer install
   ```

3. **Copy and configure `.env`**

   ```bash
   cp .env.example .env
   ```

   - Set your **DB connection**
   - Set `APP_URL` and `APP_NAME`

4. **Generate app key**

   ```bash
   php artisan key:generate
   ```

5. **Run migrations and seed data**

   ```bash
   php artisan migrate --seed
   ```

6. **Generate Passport keys**

   ```bash
   php artisan passport:install
   ```

7. **Run backend**
   ```bash
   php artisan serve
   ```
   API will be available at: `http://127.0.0.1:8000`

---

## 🎨 Frontend Setup (React 17)

1. **Navigate to frontend folder**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment**
   Create `.env` file in `frontend` with:

   ```
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   ```

4. **Run development server**
   ```bash
   npm start
   ```
   Frontend will be available at: `http://localhost:3000`

---

## 📌 Features

- User Authentication (Laravel Passport)
- Dashboard with shipment overview
- Cargo tracking
- Customer & order management
- Reports export (Excel, PDF)
- Role-based access control
- API integration-ready

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## 👨‍💻 Author

**Kennedy Peters**  
GitHub: [@nukeflame](https://github.com/nukeflame)
