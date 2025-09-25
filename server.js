//server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cron = require('node-cron');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const User = require('./models/User');
const Task = require('./models/Task');
const transporter = require('./mailer');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(e => console.error('MongoDB connection error:', e));

// Modern async/await version
cron.schedule('0 8 * * *', async () => {
  console.log('Running daily notification job...');
  try {
    const users = await User.find({ isVerified: true });
    for (const user of users) {
      const tasks = await Task.find({ user: user._id, status: { $ne: 'Completed' } });
      if (tasks.length === 0) continue;

      const taskList = tasks.map(
        t => `- ${t.title} (Due: ${t.dueDate ? t.dueDate.toDateString() : 'No due date'})`
      ).join('\n');

      const mailOptions = {
        from: '"Task Manager" <manikumargajam@gmail.com>',
        to: user.email,
        subject: 'Your Pending Tasks Reminder',
        text: `Hello,\n\nYou have the following pending tasks:\n${taskList}\n\nPlease check your Todo App.\n`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${user.email}`);
      } catch (error) {
        console.error(`Error sending email to ${user.email}:`, error);
      }
    }
  } catch (outerErr) {
    console.error('Error in daily reminder cron job:', outerErr);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
