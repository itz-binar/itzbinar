#!/usr/bin/env bash

# itzbinar - Rootless Linux Installer for Android
# Author: Itzbinar Team
# License: MIT
# Version: 1.1.0

# Source utility functions
source "utils/colors.sh"
source "utils/checks.sh"

# Global variables
INSTALL_DIR="$HOME/itzbinar"
LOG_FILE="$INSTALL_DIR/install.log"

# Enhanced banner with version
show_banner() {
    clear
    echo -e "${BLUE}"
    echo "╔══════════════════════════════════════╗"
    echo "║             ITZBINAR                 ║"
    echo "║   Rootless Linux for Android        ║"
    echo "║          Version 1.1.0              ║"
    echo "╚══════════════════════════════════════╝"
    echo -e "${NC}"
}

# Progress spinner
spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf " [%c]  " "$spinstr"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        printf "\b\b\b\b\b\b"
    done
    printf "    \b\b\b\b"
}

# Setup GUI environment
setup_gui() {
    print_info "Setting up GUI environment..."
    pkg install -y x11-repo
    pkg install -y tigervnc xfce4
    
    # Create VNC startup script
    cat > "$INSTALL_DIR/start-gui.sh" << 'EOF'
#!/usr/bin/env bash
vncserver -geometry 1920x1080 -xstartup /usr/bin/startxfce4
EOF
    chmod +x "$INSTALL_DIR/start-gui.sh"
}

# Enhanced main menu with more options
main_menu() {
    while true; do
        show_banner
        echo -e "\n${YELLOW}Main Menu:${NC}"
        echo "1) Install Kali Linux"
        echo "2) Install Arch Linux"
        echo "3) Setup GUI Environment"
        echo "4) View Installation Log"
        echo "5) System Information"
        echo "6) Update Itzbinar"
        echo "7) Exit"
        
        read -p "Enter choice [1-7]: " choice
        
        case $choice in
            1)
                source "systems/kali/setup.sh"
                install_kali
                ;;
            2)
                source "systems/arch/setup.sh"
                install_arch
                ;;
            3)
                setup_gui
                ;;
            4)
                if [ -f "$LOG_FILE" ]; then
                    less "$LOG_FILE"
                else
                    print_error "No installation log found"
                fi
                ;;
            5)
                show_system_info
                ;;
            6)
                update_itzbinar
                ;;
            7)
                echo -e "${BLUE}Thanks for using itzbinar!${NC}"
                exit 0
                ;;
            *)
                print_error "Invalid choice"
                sleep 1
                ;;
        esac
    done
}

# Show system information
show_system_info() {
    clear
    echo -e "${YELLOW}System Information:${NC}"
    echo -e "Architecture: $(uname -m)"
    echo -e "Android Version: $(getprop ro.build.version.release)"
    echo -e "Available RAM: $(free -h | awk '/^Mem:/ {print $2}')"
    echo -e "Available Storage: $(df -h ~ | awk 'NR==2 {print $4}')"
    echo -e "CPU Cores: $(nproc)"
    
    read -p "Press Enter to continue..."
}

# Update Itzbinar
update_itzbinar() {
    print_info "Checking for updates..."
    cd "$INSTALL_DIR"
    
    if git pull origin main | grep -q 'Already up to date'; then
        print_success "Itzbinar is already up to date"
    else
        print_success "Itzbinar has been updated"
        chmod +x itzbinar.sh utils/*.sh systems/*/*.sh
    fi
    
    read -p "Press Enter to continue..."
}

# Initialize logging
mkdir -p "$(dirname "$LOG_FILE")"
exec 1> >(tee -a "$LOG_FILE")
exec 2> >(tee -a "$LOG_FILE" >&2)

# Main script execution
trap 'echo -e "\n${RED}Installation interrupted.${NC}"; exit 1' INT TERM
check_termux
check_internet
check_storage
check_arch
main_menu