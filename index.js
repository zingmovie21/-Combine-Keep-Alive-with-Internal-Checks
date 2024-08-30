import cron from 'node-cron';
import fetch from 'node-fetch';

// URLs of your websites
const REFRESH_PAGE_URL = 'https://www.adityadevarshi.online/#/';
const GROCERYSTORE_URL = 'https://www.vegetablesking.in/';

// Function to check if a website is active
async function isWebsiteActive(url) {
  console.log(`Checking if website ${url} is active...`);
  try {
    const response = await fetch(url);
    console.log(`Checked ${url}: ${response.ok ? 'Active' : 'Inactive'}`);
    return response.ok;
  } catch (error) {
    console.error(`Error checking website status for ${url}:`, error);
    return false;
  }
}

// Function to refresh a website
async function refreshWebsite(url) {
  console.log(`Refreshing website ${url}...`);
  try {
    await fetch(url);
    console.log(`Website ${url} refreshed successfully.`);
  } catch (error) {
    console.error(`Error refreshing website ${url}:`, error);
  }
}

// Function to handle the refresh logic for each website
async function handleRefresh(url) {
  const active = await isWebsiteActive(url);

  if (active) {
    console.log(`Website ${url} is active. Waiting for the next refresh cycle.`);
  } else {
    console.log(`Website ${url} is inactive. Refreshing now...`);
    await refreshWebsite(url);
    // Wait for a short period to allow the website to come back online
    console.log(`Waiting for 1 minute before the next check...`);
    await new Promise(resolve => setTimeout(resolve, 60000)); // 1 minute
  }
}

// Schedule a job to run every 15 minutes from 6 AM to 12 AM for refresh page
cron.schedule('*/15 6-23 * * *', () => {
  console.log(`Scheduled task: Checking ${REFRESH_PAGE_URL}`);
  handleRefresh(REFRESH_PAGE_URL);
});

// Schedule a job to run every 15 minutes from 6 AM to 12 AM for grocery store
cron.schedule('*/15 6-23 * * *', () => {
  console.log(`Scheduled task: Checking ${GROCERYSTORE_URL}`);
  handleRefresh(GROCERYSTORE_URL);
});

// Keep-alive mechanism
setInterval(async () => {
  console.log(`Keep-alive check for ${REFRESH_PAGE_URL} and ${GROCERYSTORE_URL}...`);
  await handleRefresh(REFRESH_PAGE_URL);
  await handleRefresh(GROCERYSTORE_URL);
}, 1000 * 60 * 14); // Every 14 minutes
