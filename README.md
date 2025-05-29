# Matrix-Themed Social Links

A cyberpunk-inspired web application with Matrix-style visual effects, featuring a responsive design and interactive terminal interface.

![Matrix Social Links](./screenshot.png)

## Features

- 🖥️ Interactive terminal interface with realistic commands
- 🔄 Real-time system monitoring that displays actual browser information
- 🔒 Security event simulation with dynamic notifications
- 🎨 Dark/light theme toggle with Matrix-inspired aesthetics
- 📱 Fully responsive design for mobile and desktop
- ✨ Particle and Matrix rain effects with hardware acceleration
- 🔄 3D flip animations and interactive UI elements

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- EmailJS for contact form

## Development

To run the project locally:

### Using Batch Files (Windows)

```
# Start development server
dev.bat

# Build the project
build.bat

# Deploy to Netlify
deploy.bat
```

### Using PowerShell Scripts

```powershell
# Start development server
.\dev.ps1

# Build the project
.\build.ps1

# Deploy to Netlify
.\deploy.ps1
```

### Using npm (Alternative)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment to Netlify

### Automatic Deployment with Batch File (Windows)

```
deploy.bat
```

### Automatic Deployment with PowerShell

```powershell
.\deploy.ps1
```

### Manual Deployment

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy using Netlify CLI:
   ```bash
   npx netlify deploy --prod
   ```

3. Or deploy via the Netlify web interface by dragging the `dist` folder.

## Environment Variables

Create a `.env` file with the following variables for the contact form:

```
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## License

MIT # itzbinar
