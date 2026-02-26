// @system — scheduler entry point
// Tasks run on a cron schedule. Add @custom tasks below.

const customTasks = require('../@custom')

// Example built-in task runner (extend as needed)
function startScheduler() {
  console.log('[scheduler] started')
  customTasks.forEach((task) => task.start?.())
}

module.exports = { startScheduler }
