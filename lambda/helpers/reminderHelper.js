function getReminder(reminders, rowNumber) {
  if (!reminders) return null;
  return reminders[String(rowNumber)] || null;
}

function buildReminderSpeech(reminders, newRow) {
  const parts = [];

  const currentReminder = getReminder(reminders, newRow);
  if (currentReminder) {
    parts.push(`Reminder: ${currentReminder}.`);
  }

  const nextReminder = getReminder(reminders, newRow + 1);
  if (nextReminder) {
    parts.push(`Heads up: ${nextReminder} next row.`);
  }

  return parts.join(' ');
}

function listUpcoming(reminders, currentRow) {
  if (!reminders) return [];
  return Object.entries(reminders)
    .map(([row, instruction]) => ({ row: Number(row), instruction }))
    .filter((r) => r.row > currentRow)
    .sort((a, b) => a.row - b.row);
}

module.exports = { getReminder, buildReminderSpeech, listUpcoming };
