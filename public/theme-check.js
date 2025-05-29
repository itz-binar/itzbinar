// Theme check script to set initial theme based on user preference
(function() {
  // Check if user prefers dark mode
  const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  
  // Apply theme based on preference or saved setting
  if (savedTheme === 'light') {
    document.documentElement.classList.remove('dark-theme');
    document.documentElement.classList.add('light-theme');
  } else if (savedTheme === 'dark' || prefersDarkMode) {
    document.documentElement.classList.add('dark-theme');
    document.documentElement.classList.remove('light-theme');
  }
})(); 