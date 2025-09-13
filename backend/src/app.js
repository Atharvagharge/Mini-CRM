require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const ingestRoutes = require('./routes/ingest');
const segmentRoutes = require('./routes/segments');
const campaignRoutes = require('./routes/campaigns');
const vendorRoutes = require('./routes/vendor');

const { ensureJwt } = require('./middleware/auth');
const aiRoutes = require("./routes/ai");



const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));
app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// session needed for passport oauth2 flow
app.use(session({
  secret: process.env.JWT_SECRET || 'dev_secret',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

// connect DB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(()=> console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connect error:', err.message);
    process.exit(1);
  });

// swagger setup (small)
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Mini CRM API", version: "1.0.0" }
  },
  apis: ["./src/routes/*.js"]
};
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/ai', aiRoutes);

app.use('/auth', authRoutes);
app.use('/api/ingest', ensureJwt, ingestRoutes);
app.use('/api/segments', ensureJwt, segmentRoutes);
app.use('/api/campaigns', ensureJwt, campaignRoutes);

// vendor & receipt endpoints (no auth for vendor callbacks)
app.use('/vendor', vendorRoutes);

app.get('/', (req,res) => res.json({ok: true, message: 'Mini CRM backend'}));

app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));
