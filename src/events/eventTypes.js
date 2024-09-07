const eventTypes = {
    LOGIN: { name: "Login", desc: "User successfully logged in" },
    LOGOUT: { name: "Logout", desc: "User successfully logged out" },
    COURSE_ENROLLMENT: {
      name: "Course Enrollment",
      desc: "User enrolled in a course",
    },
    ADD_TO_CART: { name: "Add to Cart", desc: "User added an item to the cart" },
    PURCHASE: { name: "Purchase", desc: "User completed a purchase" },
    PASSWORD_RESET: { name: "Password Reset", desc: "User reset their password" },
    FORGOT_PASSWORD: {
      name: "Forgot Password",
      desc: "User requested a password reset",
    },
    ACCOUNT_STATE_CHANGE: {
      name: "Account State Change",
      desc: "User's account state changed",
    },
    REFRESH_TOKEN: {
      name: "Refresh Token",
      desc: "User's session token was refreshed",
    },
    CONTACT_FORM_SUBMISSION: {
      name: "Contact Form Submission",
      desc: "User submitted the contact form",
    },
    COURSE_COMPLETION: {
      name: "Course Completion",
      desc: "User completed a course",
    },
    LESSON_PROGRESS: {
      name: "Lesson Progress",
      desc: "User progressed through a lesson",
    },
    PLAY_MEDITATION: {
      name: "Play Meditation",
      desc: "User started playing a meditation session",
    },
    PAUSE_MEDITATION: {
      name: "Pause Meditation",
      desc: "User paused a meditation session",
    },
    STOP_MEDITATION: {
      name: "Stop Meditation",
      desc: "User stopped a meditation session",
    },
    MEDITATION_COMPLETED: {
      name: "Meditation Completed",
      desc: "User completed a meditation session",
    },
    MOOD_UPDATE: {
      name: "Mood Update",
      desc: "User updated their mood",
    },
    GOAL_SET: {
      name: "Goal Set",
      desc: "User set a new goal",
    },
    GOAL_ACHIEVED: {
      name: "Goal Achieved",
      desc: "User achieved a goal",
    },
    NOTIFICATION_RECEIVED: {
      name: "Notification Received",
      desc: "User received a notification",
    },
    SETTINGS_UPDATED: {
      name: "Settings Updated",
      desc: "User updated their settings",
    },
    PROFILE_UPDATED: {
      name: "Profile Updated",
      desc: "User updated their profile",
    },
    FRIEND_REQUEST_SENT: {
      name: "Friend Request Sent",
      desc: "User sent a friend request",
    },
    FRIEND_REQUEST_ACCEPTED: {
      name: "Friend Request Accepted",
      desc: "User accepted a friend request",
    },
    MESSAGE_SENT: {
      name: "Message Sent",
      desc: "User sent a message",
    },
    MESSAGE_RECEIVED: {
      name: "Message Received",
      desc: "User received a message",
    },
    APP_INITIALIZED: {
      name: "App Initialized",
      desc: "App was initialized",
    },
    APP_CLOSED: {
      name: "App Closed",
      desc: "App was closed",
    },
    FEEDBACK_SUBMITTED: {
      name: "Feedback Submitted",
      desc: "User submitted feedback",
    },
    ERROR_OCCURRED: {
      name: "Error Occurred",
      desc: "An error occurred in the app",
    },
  };
  
  export default eventTypes;
  