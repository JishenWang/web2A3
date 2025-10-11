const express = require('express');
const cors = require('cors');
const { pool, testDbConnection } = require('./event_db');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err.message);
  console.error('错误堆栈:', err.stack);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  process.exit(1);
});

function formatDecimalFields(events) {
  return events.map(event => ({
    ...event,
    ticket_price: event.ticket_price !== null ? Number(event.ticket_price) : 0,
    goal_amount: event.goal_amount !== null ? Number(event.goal_amount) : 0,
    current_amount: event.current_amount !== null ? Number(event.current_amount) : 0
  }));
}

app.get('/api/events/home', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.id
      WHERE e.is_active = TRUE
      ORDER BY e.event_date ASC
    `);

    const formattedEvents = formatDecimalFields(events);
    res.status(200).json({ success: true, data: formattedEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: '获取首页事件失败：' + err.message });
  }
});


app.get('/api/events/search', async (req, res) => {
  try {
    const { startDate, endDate, location, categoryId } = req.query;
    let query = `
      SELECT e.*, c.name AS category_name 
      FROM events e
      JOIN categories c ON e.category_id = c.id
      WHERE e.is_active = TRUE
    `;
    const params = [];

    if (startDate) {
      query += ' AND e.event_date >= ?';
      params.push(startDate);
    }
    if (endDate) {
      query += ' AND e.event_date <= ?';
      params.push(endDate);
    }
    if (location) {
      query += ' AND e.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (categoryId) {
      query += ' AND e.category_id = ?';
      params.push(categoryId);
    }

    const [events] = await pool.query(query, params);
    const formattedEvents = formatDecimalFields(events);
    res.status(200).json({ success: true, data: formattedEvents });
  } catch (err) {
    res.status(500).json({ success: false, error: '搜索事件失败：' + err.message });
  }
});

app.get('/api/categories', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.status(200).json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: '获取分类失败：' + err.message });
  }
});

app.get('/api/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name 
      FROM events e JOIN categories c ON e.category_id = c.id 
      WHERE e.id = ?
    `, [eventId]);
    if (events.length === 0) return res.status(404).json({ success: false, error: 'Event not found' });
    
    const [registrations] = await pool.query(`
      SELECT * FROM event_registrations 
      WHERE event_id = ? 
      ORDER BY registration_date DESC
    `, [eventId]);
    
    const eventData = formatDecimalFields(events)[0];
    res.status(200).json({ 
      success: true, 
      data: { ...eventData, registrations: registrations } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get event details: ' + err.message });
  }
});

// 添加获取事件注册记录的端点
app.get('/api/events/:id/registrations', async (req, res) => {
  try {
    const eventId = req.params.id;
    const [registrations] = await pool.query(`
      SELECT * FROM event_registrations 
      WHERE event_id = ? 
      ORDER BY registration_date DESC
    `, [eventId]);
    
    res.status(200).json({ 
      success: true, 
      data: registrations 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get registrations: ' + err.message });
  }
});

app.post('/api/registrations', async (req, res) => {
  try {
    const { event_id, user_name, user_email, phone, ticket_quantity } = req.body;
    if (!event_id || !user_name || !user_email || !ticket_quantity) {
      return res.status(400).json({ success: false, error: 'Missing required fields (event_id, user_name, user_email, ticket_quantity)' });
    }
    if (Number(ticket_quantity) < 1) {
      return res.status(400).json({ success: false, error: 'Ticket quantity must be at least 1' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(user_email)) {
      return res.status(400).json({ success: false, error: 'Invalid email format' });
    }
    const [result] = await pool.query(`
      INSERT INTO event_registrations (event_id, user_name, user_email, phone, ticket_quantity)
      VALUES (?, ?, ?, ?, ?)
    `, [event_id, user_name, user_email, phone, ticket_quantity]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Registration successful!', 
      data: { registration_id: result.insertId } 
    });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ success: false, error: 'You have already registered for this event' });
    }
    res.status(500).json({ success: false, error: 'Failed to register: ' + err.message });
  }
});

app.post('/api/admin/events', async (req, res) => {
  try {
    const { title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, image_url, latitude, longitude } = req.body;
    if (!title || !event_date || !location || !category_id) {
      return res.status(400).json({ success: false, error: 'Missing required fields (title, event_date, location, category_id)' });
    }
    const [result] = await pool.query(`
      INSERT INTO events (title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, current_amount, image_url, is_active, latitude, longitude)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, ?, TRUE, ?, ?)  # current_amount 默认 0，is_active 默认 TRUE
    `, [title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, image_url, latitude, longitude]);
    
    res.status(201).json({ 
      success: true, 
      message: 'Event created successfully!', 
      data: { event_id: result.insertId } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to create event: ' + err.message });
  }
});

app.put('/api/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, image_url, is_active, latitude, longitude } = req.body;
    const [events] = await pool.query('SELECT id FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) return res.status(404).json({ success: false, error: 'Event not found' });

    await pool.query(`
      UPDATE events 
      SET title = ?, description = ?, full_description = ?, event_date = ?, location = ?, category_id = ?, ticket_price = ?, goal_amount = ?, image_url = ?, is_active = ?, latitude = ?, longitude = ?
      WHERE id = ?
    `, [title, description, full_description, event_date, location, category_id, ticket_price, goal_amount, image_url, is_active, latitude, longitude, eventId]);
    
    res.status(200).json({ success: true, message: 'Event updated successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to update event: ' + err.message });
  }
});

app.delete('/api/admin/events/:id', async (req, res) => {
  try {
    const eventId = req.params.id;
    const [events] = await pool.query('SELECT id FROM events WHERE id = ?', [eventId]);
    if (events.length === 0) return res.status(404).json({ success: false, error: 'Event not found' });
    
    const [registrations] = await pool.query('SELECT id FROM event_registrations WHERE event_id = ?', [eventId]);
    if (registrations.length > 0) {
      return res.status(400).json({ success: false, error: 'Cannot delete event: It has existing registrations' });
    }
    
    await pool.query('DELETE FROM events WHERE id = ?', [eventId]);
    res.status(200).json({ success: true, message: 'Event deleted successfully!' });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to delete event: ' + err.message });
  }
});

app.get('/api/admin/events', async (req, res) => {
  try {
    const [events] = await pool.query(`
      SELECT e.*, c.name AS category_name 
      FROM events e JOIN categories c ON e.category_id = c.id 
      ORDER BY e.event_date ASC
    `);
    res.status(200).json({ success: true, data: formatDecimalFields(events) });
  } catch (err) {
    res.status(500).json({ success: false, error: 'Failed to get admin events: ' + err.message });
  }
});

async function startServer() {
  try {
    await testDbConnection();
    app.listen(PORT, () => {
      console.log(`API server running at http://localhost:${PORT}`);
      console.log('Test endpoints:');
      console.log('- GET: http://localhost:3000/api/events/home (Home events)');
      console.log('- GET: http://localhost:3000/api/admin/events (All events for admin)');
      console.log('- POST: http://localhost:3000/api/registrations (Register for event)');
    });
  } catch (err) {
    console.error('Server start failed:', err.message);
    process.exit(1);
  }
}
startServer();
