const axios = require('axios');

const getZoomAccessToken = async () => {
  const clientId = process.env.ZOOM_CLIENT_ID; ;
  const clientSecret = process.env.ZOOM_CLIENT_SECRET;
  const accountId = process.env.ZOOM_ACCOUNT_ID
  const tokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`;
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  try {
    const response = await axios.post(tokenUrl, null, {
      headers: {
        Authorization: `Basic ${credentials}`,
      },
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Error generating Zoom access token:', error.response?.data || error.message);
    throw new Error('Failed to get Zoom access token');
  }
};

const createZoomMeeting = async ({ topic, startTime, duration, agenda }) => {
    const accessToken = await getZoomAccessToken();
  
    const zoomApiUrl = 'https://api.zoom.us/v2/users/me/meetings';
  
    const meetingConfig = {
      topic,
      type: 2, // Scheduled meeting
      start_time: startTime, // ISO 8601 format (e.g., "2025-01-01T15:00:00Z")
      duration, // Duration in minutes
      agenda,
      settings: {
        join_before_host: true,
        mute_upon_entry: true,
        approval_type: 0,
        registration_type: 1,
      },
    };
  
    try {
      const response = await axios.post(zoomApiUrl, meetingConfig, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
  
      console.log('Zoom Meeting Created:', response.data);
      return response.data.join_url; // Return the meeting link
    } catch (error) {
      console.error('Error scheduling Zoom meeting:', error.response?.data || error.message);
      throw new Error('Failed to schedule Zoom meeting');
    }
  };

module.exports = { createZoomMeeting };

