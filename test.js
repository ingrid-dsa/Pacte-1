const rdvDate = "2025-06-11";
const startDate = "2025-05-11";

const today = new Date("2025-05-21T12:00:00Z");
const rdv = new Date(rdvDate);
const start = new Date(startDate);

today.setHours(0, 0, 0, 0);
rdv.setHours(0, 0, 0, 0);
start.setHours(0, 0, 0, 0);

const totalCycleMs = rdv.getTime() - start.getTime();
const totalCycleDays = Math.max(1, Math.ceil(totalCycleMs / (1000 * 60 * 60 * 24)));

const remainingMs = rdv.getTime() - today.getTime();
const remainingDays = Math.max(0, Math.ceil(remainingMs / (1000 * 60 * 60 * 24)));

const elapsedDays = totalCycleDays - remainingDays;
const progress = Math.min(1, Math.max(0, elapsedDays / totalCycleDays));

console.log({ totalCycleDays, remainingDays, elapsedDays, progress });
