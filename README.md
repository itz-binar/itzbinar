# Itzbinar

🚀 Professional Rootless Linux Installer for Android

## Features

- 🔓 **No Root Required** — Works entirely via Termux and PRoot
- 🐧 **Multiple Distributions** — Choose between Kali Linux and Arch Linux
- ⚡ **One-Line Setup** — Single command installs everything automatically
- 🖥️ **GUI Support** — XFCE Desktop + VNC server with auto-resolution detection
- 🛠️ **Pre-installed Tools** — Metasploit, Nmap, Sqlmap, Hydra, Python3, and more
- 📱 **Android 7.0+** — Supports modern Android devices
- 💾 **Efficient Storage** — Optimized installation size
- 🔄 **Auto-Updates** — Keep your system up to date

## Quick Installation

```bash
bash <(curl -s https://raw.githubusercontent.com/itzbinar/itzbinar/main/install.sh)
```

## Requirements

- 📱 Android device (ARM64)
- 📦 Termux app installed
- 💾 4GB+ free storage
- 🌐 Internet connection

## Usage

After installation, use these commands:

- **Start Kali Linux**: `startkali`
- **Start Arch Linux**: `startarch`
- **Start GUI**: `start-gui`

## GUI Access

To start the GUI environment:

1. Start your Linux environment
2. Run `start-gui`
3. Connect using any VNC viewer app
4. Default resolution: 1920x1080 (customizable)

## Pre-installed Tools

### Security Tools
- 🛡️ Metasploit Framework
- 🔍 Nmap
- 💉 Sqlmap
- 🔑 Hydra
- 📊 Wireshark CLI

### Development Tools
- 🐍 Python3 + pip
- 📦 Git
- 🌐 Curl & Wget
- 📝 Nano
- 🎨 Neofetch

### Optional Tools
- 🖥️ XFCE4 Desktop
- 🔄 VNC Server
- 💻 Terminal Utilities

## Updates

To update Itzbinar:

1. Start Itzbinar
2. Select "Update Itzbinar" from the main menu

## Troubleshooting

Common issues and solutions:

1. **VNC not starting**:
   - Ensure you have enough free RAM
   - Try killing existing VNC sessions

2. **Storage Issues**:
   - Clean Termux: `pkg clean`
   - Remove unused distributions

3. **Network Problems**:
   - Check internet connection
   - Try different mirrors

## Contributing

Pull requests are welcome! For major changes:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

[MIT License](LICENSE) - feel free to use and modify!