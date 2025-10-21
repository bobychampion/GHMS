#!/usr/bin/env node

const fetch = require('node-fetch');

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing Godatin Hotel database...');
    
    const response = await fetch('http://localhost:3000/api/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Database initialized successfully!');
      console.log('📊 Room types and pricing have been added to the database.');
    } else {
      console.error('❌ Failed to initialize database:', result.message);
    }
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    console.log('💡 Make sure the development server is running (npm run dev)');
  }
}

// Run the initialization
initializeDatabase();



